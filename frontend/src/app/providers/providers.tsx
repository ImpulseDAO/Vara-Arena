import { ProvidersWrapper } from './providers-wrapper';
import { SuppressErrorProvider } from './SuppressError/SuppressError';
import { GearProviders } from './GearProviders/GearProviders';
import { MantineProvider } from './MantineProvider/MantineProvider';
import { ReactQueryProvider } from './ReactQuery';
import { TestExampleProvider } from './TestExampleProvider/TestExampleProvider';
import { InitialConfigProvider } from './InitialConfigProvider';

export const Providers = ({ children }: { children: React.ReactNode; }) => {
  return (
    <ProvidersWrapper
      /**
       * ProvidersWrapper isolates context providers and wraps them in memo boundary
       * Thus removing unnesessary renders
       */
      providers={[
        // all providers go there
        // the order is from highest to lowest in component tree
        ReactQueryProvider,
        GearProviders,
        MantineProvider,
        SuppressErrorProvider,
        InitialConfigProvider,
        TestExampleProvider,
      ]}
    >
      {children}
    </ProvidersWrapper>
  );
};
