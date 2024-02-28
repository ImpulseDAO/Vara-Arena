import React from 'react';

type ProviderType = React.FC | React.FC<{ children: React.ReactNode; }>;

const AppRerenderContext = React.createContext<React.ReactNode>(null);
export const useAppRerenderContext = (): React.ReactNode =>
  React.useContext(AppRerenderContext);

// All contexts between AppRerenderContext and AppRerenderConsumer are wrapped in memo
// this prevents contexts rerender when some state above changes as contexts don't depend on any state above
export const ProvidersWrapper = ({
  providers,
  children,
}: {
  providers: ProviderType[];
  children: React.ReactNode;
}) => {
  return (
    // when children change, AppRerenderConsumer rerenders
    <AppRerenderContext.Provider value={children}>
      <MemoWrapperBoundary>
        {providers.reduceRight(
          (result, Provider) => (<Provider>{result}</Provider>),
          <AppRerenderConsumer />
        )}
      </MemoWrapperBoundary>
    </AppRerenderContext.Provider>
  );
};

// rerender happens only when useAppRendererContext fires
// (because React.memo that never rerenders is higher in the tree)
const AppRerenderConsumer: React.FC = () => {
  const children = useAppRerenderContext();
  return <>{children}</>;
};

// the component is never rerended on props change and on parent rerender
// so all providers are wrapped and being rerended only when hooks fire
const MemoWrapperBoundary = React.memo(
  function MemoWrapperBoundary({ children }: { children: React.ReactNode; }) {
    return <>{children}</>;
  },
  () => true
);
