import { useAlert } from "@gear-js/react-hooks";
import { useState } from "react";

export const useStableAlert = () => {
  const alertRaw = useAlert();
  const [alert] = useState(alertRaw);
  return alert;
};
