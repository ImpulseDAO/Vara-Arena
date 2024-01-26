import { useAccount } from "@gear-js/react-hooks";
import { routes } from "app/routes";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const LogoutScreen = () => {
  const navigate = useNavigate();
  const { logout: logoutOfTheAccount } = useAccount();

  useEffect(() => {
    logoutOfTheAccount();
    navigate(routes.startScreen);
  });

  return null;
};
