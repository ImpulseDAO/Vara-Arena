import { FC, ReactNode, useEffect, useMemo } from 'react';
import { useAccount, useApi } from '@gear-js/react-hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import { HexString } from '@polkadot/util/types';
import { ARENA_ID, METADATA } from 'pages/StartFight/constants';
import { getProgramMetadata } from '@gear-js/api';
import { getDecodedMessagePayload } from 'utils/getDecodedMessagePayload';

export const NavWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  const { isApiReady } = useApi();
  const { isAccountReady, account } = useAccount();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { api } = useApi();
  const meta = useMemo(() => getProgramMetadata(METADATA), []);

  // useEffect(() => {
  //   let unsub;
  //   if (api?.gearEvents) {
  //     unsub = api.gearEvents.subscribeToGearEvent(
  //       'UserMessageSent',
  //       ({
  //         data: {
  //           //@ts-ignore
  //           message,
  //         },
  //       }) => {
  //         console.log(
  //           'pewepew',
  //           JSON.stringify(
  //             meta
  //               .createType(meta.types.handle.output, message.payload)
  //               .toJSON()
  //           )
  //         );
  //       }
  //     );
  //   }
  //   return () => {
  //     unsub?.();
  //   };
  // }, [api]);

  useEffect(() => {
    // if (!account?.decodedAddress) {
    //   navigate('/mint-character');
    // }
    // if (!isApiReady || !isAccountReady) {
    //   navigate('/');
    // }
  }, [isApiReady, isAccountReady]);

  return <>{children}</>;
};
