
import {
  AccountProvider,
  ApiProvider,
  AlertProvider,
} from "@gear-js/react-hooks";
import { Alert, alertStyles } from "@gear-js/ui";
import { ADDRESS } from "consts";

export const GearProviders = ({ children }: {
  children: React.ReactNode;
}) => {
  return (
    <AlertProvider template={Alert} containerClassName={alertStyles.root}>
      <ApiProvider initialArgs={{ endpoint: ADDRESS.NODE }}>
        <AccountProvider>
          {children}
        </AccountProvider>
      </ApiProvider>
    </AlertProvider>
  );
};
