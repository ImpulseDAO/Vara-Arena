import { useApi } from '@gear-js/react-hooks';
import { useEffect } from 'react';

export const TestExampleProvider = ({ children }: {
  children: React.ReactNode;
}) => {
  const { isApiReady } = useApi();
  useEffect(() => console.log('isApiReady', isApiReady), [isApiReady]);

  return <>{children}</>;
};
