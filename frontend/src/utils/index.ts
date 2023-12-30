import type { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { LOCAL_STORAGE } from "consts";

export const isLoggedIn = ({ address }: InjectedAccountWithMeta) =>
  localStorage[LOCAL_STORAGE.ACCOUNT] === address;

export const getShortIdString = (id: string) =>
  `@${id.substring(0, 7)}...${id.substring(id.length - 3)}`;
