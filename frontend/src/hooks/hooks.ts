/**
 * I didn't want to name this file "index.ts" and named it "hooks.ts" instead
 * so that it's easier to open from vscode search menu cmd+P menu
 */

import { useAccount } from "@gear-js/react-hooks";

export const useMyAccountId = () => {
  const { account } = useAccount();
  return account?.decodedAddress;
};
