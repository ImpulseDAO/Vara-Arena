import { useCallback } from "react";
import { web3FromSource } from "@polkadot/extension-dapp";
import { EventRecord } from "@polkadot/types/interfaces";
import { HexString } from "@polkadot/util/types";
import {
  useApi,
  useAlert,
  useAccount,
  DEFAULT_ERROR_OPTIONS,
  DEFAULT_SUCCESS_OPTIONS,
} from "@gear-js/react-hooks";

import {
  ParamsToUploadCode,
  ParamsToSignAndSend,
  Method,
  PROGRAM_ERRORS,
  TransactionName,
  TransactionStatus,
} from "./types";

const useUploadCode = () => {
  const { api } = useApi();
  const alert = useAlert();
  const { account } = useAccount();

  const submit = async (optBuffer: Buffer) => {
    if (!api) {
      throw new Error("Api is not initialized");
    }

    const { codeHash } = await api.code.upload(optBuffer);

    return codeHash;
  };

  const handleEventsStatus = (
    events: EventRecord[],
    codeId: HexString,
    resolve?: (codeId: string) => void
  ) => {
    events.forEach(({ event }) => {
      const { method, section } = event;
      const alertOptions = { title: `${section}.${method}` };

      if (method === Method.ExtrinsicFailed) {
        /**
         * TODO: add error message
         */
        console.error("ExtrinsicFailed");
      } else if (method === Method.CodeChanged) {
        alert.success(
          <div>
            <p>Code uploaded</p>
            <p>Code hash: {codeId}</p>
          </div>,
          alertOptions
        );

        if (resolve) resolve(codeId);
      }
    });
  };

  const signAndSend = async ({
    signer,
    codeId,
    metaHex,
    name,
    resolve,
  }: ParamsToSignAndSend) => {
    const alertId = alert.loading("SignIn", {
      title: TransactionName.SubmitCode,
    });

    try {
      if (!api) {
        throw new Error("Api is not initialized");
      }

      await api.code.signAndSend(
        account!.address,
        { signer },
        ({ events, status }) => {
          if (status.isReady) {
            alert.update(alertId, TransactionStatus.Ready);
          } else if (status.isInBlock) {
            alert.update(alertId, TransactionStatus.InBlock);
            handleEventsStatus(events, codeId, resolve);
          } else if (status.isFinalized) {
            alert.update(
              alertId,
              TransactionStatus.Finalized,
              DEFAULT_SUCCESS_OPTIONS
            );

            /**
             * TODO: add this later or remove this completely
             */
            // timeout cuz wanna be sure that block data is ready
            // setTimeout(() => {
            //   const id = codeId;

            //   addCodeName({ id, name: name || id })
            //     .then(() => metaHex && addCodeMetadata({ id, metaHex }))
            //     .catch(({ message }: Error) => alert.error(message));
            // }, UPLOAD_METADATA_TIMEOUT);
          } else if (status.isInvalid) {
            alert.update(
              alertId,
              PROGRAM_ERRORS.INVALID_TRANSACTION,
              DEFAULT_ERROR_OPTIONS
            );
          }
        }
      );
    } catch (error) {
      const message = (error as Error).message;

      alert.update(alertId, message, DEFAULT_ERROR_OPTIONS);
    }
  };

  const uploadCode = useCallback(
    async ({ optBuffer, name, metaHex, resolve }: ParamsToUploadCode) => {
      try {
        /**
         * TODO: add this later or remove this completely
         */
        // checkWallet(account);

        const { meta } = account!;

        const [codeId, { signer }] = await Promise.all([
          submit(optBuffer),
          web3FromSource(meta.source),
        ]);

        addCodeIdToLocalStorage(codeId);
        resolve(codeId);

        if (!api) {
          throw new Error("Api is not initialized");
        }

        // const { partialFee } = await api.code.paymentInfo(account.address, { signer });

        const handleConfirm = () =>
          signAndSend({ signer, name, codeId, metaHex, resolve });

        handleConfirm();

        return codeId;

        /**
         * TODO: add this later or remove this completely
         */
        // showModal("transaction", {
        //   fee: partialFee.toHuman(),
        //   name: TransactionName.SubmitCode,
        //   addressFrom: address,
        //   onConfirm: handleConfirm,
        // });
      } catch (error) {
        const message = (error as Error).message;

        alert.error(message);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [api, account]
  );

  return uploadCode;
};

export { useUploadCode };

/**
 *  LocalStorage
 */

const UPLOADED_CODE_IDS_ARRAY = "uploadedCodeIdsArray";

export const addCodeIdToLocalStorage = (codeId: string) => {
  const arrayOfCodeIds = JSON.parse(localStorage.getItem(UPLOADED_CODE_IDS_ARRAY) || "[]") as string[];

  const uniqueSet = new Set(arrayOfCodeIds);
  uniqueSet.add(codeId);

  localStorage.setItem(UPLOADED_CODE_IDS_ARRAY, JSON.stringify(Array.from(uniqueSet)));
};

export const removeCodeIdFromLocalStorage = (codeId: string) => {
  const newValue = getCodeIdsFromLocalStorage();

  localStorage.setItem(
    UPLOADED_CODE_IDS_ARRAY,
    JSON.stringify(newValue.filter((id) => id !== codeId))
  );

  return newValue;
};

export const getCodeIdsFromLocalStorage = (): string[] => {
  return (JSON.parse(localStorage.getItem(UPLOADED_CODE_IDS_ARRAY) || "[]") as []) ?? [];
};
