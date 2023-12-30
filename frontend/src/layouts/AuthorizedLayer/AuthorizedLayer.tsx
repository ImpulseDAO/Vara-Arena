import { Header } from "layouts/Header";
import { FC, ReactNode, memo, useEffect } from "react";
import "./styles.scss";
import { useAccount, useApi } from "@gear-js/react-hooks";
import { useLocation, useNavigate, useNavigation } from "react-router-dom";
import { BackgroundImage, Box, LoadingOverlay, useMantineTheme } from "@mantine/core";

import StartFightPng from "assets/images/startFightScreen.png";
import { newRoutes } from "app/routes";


export type AuthorizedLayerProps = {
  children: ReactNode;
};

export const AuthorizedLayer: FC<AuthorizedLayerProps> = memo(
  ({ children }) => {
    const { isApiReady } = useApi();
    const theme = useMantineTheme();
    const { pathname } = useLocation();

    console.log('pathname', pathname);

    const { account, isAccountReady } = useAccount();

    const navigate = useNavigate();

    useEffect(() => {
      if (isAccountReady && !account) {
        navigate("/");
      }
    }, [account, isAccountReady, navigate]);

    const isLoading = !isAccountReady || !isApiReady;

    return (
      <div className="app">
        {pathname.startsWith(newRoutes.arena) ? (
          < BackgroundImage
            src={StartFightPng}
            style={{
              position: 'absolute',
              top: '80px', // check header's height
              left: 0,
              bottom: 0,
              right: 0,
              overflow: 'hidden'
            }}
          />
        ) : null}

        <Header />

        <Box
          className="content"
          pos="relative"
          sx={{
            '& svg > g > g ': {
              strokeWidth: 2
            }
          }}
        >
          {isLoading ? <LoadingOverlay visible loaderProps={{ size: 80, variant: 'oval', color: theme.primaryColor }} overlayColor={theme.colors.gray90[0]} /> : children}
        </Box>

      </div >
    );
  }
);
