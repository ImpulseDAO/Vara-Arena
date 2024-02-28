import { ProgramMetadata } from '@gear-js/api';
import { useApi } from '@gear-js/react-hooks';
import { ARENA_METADATA, ARENA_PROGRAM_ID } from 'consts';
import { useWatchMessages } from "hooks/useWatchMessages/useWatchMessages";
import React, { useEffect } from 'react';

export const TestExampleProvider = ({ children }: {
  children: React.ReactNode;
}) => {
  const { isApiReady } = useApi();
  useEffect(() => console.log('isApiReady', isApiReady), [isApiReady]);

  useMailbox();

  return <>{children}</>;
};

const useMailbox = () => {

  const arenaMetadata = ProgramMetadata.from(ARENA_METADATA);
  const programId = ARENA_PROGRAM_ID;
  const { subscribe, unsubscribe } = useWatchMessages<unknown>({
    meta: arenaMetadata,
    programId
  });

  useEffect(() => {
    // subscribe();

    return () => unsubscribe();
  }, [subscribe, unsubscribe]);



};
