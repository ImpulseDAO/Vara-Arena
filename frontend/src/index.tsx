import { memo } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  AccountProvider,
  ApiProvider as GearApiProvider,
  AlertProvider as GearAlertProvider,
} from "@gear-js/react-hooks";
import { Alert, alertStyles } from "@gear-js/ui";

import { ADDRESS } from "consts";
import { ProviderProps } from "@gear-js/react-hooks/dist/esm/types";
import { RouterProvider } from "react-router-dom";
import { appRouter } from "app/AppRouter";

const ApiProvider = memo(({ children }: ProviderProps) => {
  return (
    <GearApiProvider providerAddress={ADDRESS.NODE}>{children}</GearApiProvider>
  );
});

const AlertProvider = memo(({ children }: ProviderProps) => {
  return (
    <GearAlertProvider template={Alert} containerClassName={alertStyles.root}>
      {children}
    </GearAlertProvider>
  );
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <AlertProvider>
    <ApiProvider>
      <AccountProvider>
        <RouterProvider router={appRouter} />
      </AccountProvider>
    </ApiProvider>
  </AlertProvider>
);
