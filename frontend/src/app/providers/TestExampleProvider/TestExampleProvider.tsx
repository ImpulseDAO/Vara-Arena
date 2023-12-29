import { useApi } from '@gear-js/react-hooks';
import { useMyCharacter } from 'app/api/characters';
import { useEffect } from 'react';

export const TestExampleProvider = ({ children }: {
  children: React.ReactNode;
}) => {
  const { isApiReady } = useApi();
  useEffect(() => console.log('isApiReady', isApiReady), [isApiReady]);

  const myCharacter = useMyCharacter();
  console.log("myCharacter", myCharacter);

  return <>{children}</>;
};
