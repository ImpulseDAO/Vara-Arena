import {
  useUploadCode,
} from "hooks/useUploadCode";
import { Select } from "@mantine/core";
import React, { useEffect } from "react";
import { OLD_STRATEGY_CODE_ID_HARDCODED, STRATEGY_CODE_ID_HARDCODED } from "consts";
import { useAlert } from "@gear-js/react-hooks";
import { getCodeIdsFromLocalStorage, removeCodeIdFromLocalStorage } from "hooks/useUploadCode/useUploadCode";
import styles from "./StrategyInput.module.css";

export const StrategyInput = ({
  codeId,
  setCodeId,
  onUploadCodeChange,
}: {
  codeId: string;
  setCodeId: (codeId: string | null) => void;
  onUploadCodeChange: (codeId: string) => void;
}) => {
  const alert = useAlert();
  const uploadCode = useUploadCode();

  const [strategyCodeIds, setStrategyCodeIds] = React.useState<string[]>([]);

  useEffect(() => {
    /**
      * FILTER OUT OLD STRATEGY CODE ID
      */
    const updatedCodeIds = removeCodeIdFromLocalStorage(OLD_STRATEGY_CODE_ID_HARDCODED);
    setStrategyCodeIds(updatedCodeIds);
  }, []);

  const onUploadCodeSuccess = () => {
    const updatedCodeIds = getCodeIdsFromLocalStorage();
    setStrategyCodeIds(updatedCodeIds);
  };

  const selectData = React.useMemo(() => {
    return strategyCodeIds.map((codeId, index) => {
      const firstPart =
        codeId === STRATEGY_CODE_ID_HARDCODED
          ? "Default Strategy"
          : `Strategy ${index + 1}`;

      return {
        value: codeId,
        label: `${firstPart}: ${codeId.substring(0, 8)}...`,
      };
    });
  }, [strategyCodeIds]);


  /**
   * 
   */

  const inputFileRef = React.useRef<HTMLInputElement>(null);

  const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (!event.target.files?.[0]) {
      alert.error("No file selected");
      return;
    }

    fileReader.readAsArrayBuffer(event.target.files[0]);

    fileReader.onload = async (e) => {
      const fileContent = fileReader.result as ArrayBuffer;

      if (fileContent) {
        const buffer = Buffer.from(fileContent);
        await uploadCode({
          optBuffer: buffer,
          name: "test",
          metaHex: undefined,
          resolve: (codeId) => {
            console.log("upload code resolved for codeId ", codeId);

            setCodeId(codeId);
            onUploadCodeChange(codeId);
            onUploadCodeSuccess();
          },
        });
      }
    };
  };

  const handleClickAndUpload = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  return (
    <>
      <Select
        data={[
          ...selectData,
          {
            value: "upload",
            label: "+ Upload code",
          },
        ]}
        value={codeId}
        onChange={(value) => {
          if (value === "upload") {
            handleClickAndUpload();
            return;
          }
          setCodeId(value);
        }}
        placeholder="Select items"
        nothingFoundMessage="Nothing found"
        classNames={{
          input: styles.input,
          options: styles.options,
          option: styles.option,
          dropdown: styles.dropdown,
        }}

      />

      <input
        type="file"
        onChange={uploadFile}
        className={"input_file"}
        ref={inputFileRef}
        style={{
          display: "none",
        }}
      />
    </>
  );
};
