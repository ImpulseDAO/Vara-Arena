import { Header } from "layouts/Header";
import { FC, ReactNode, memo, useEffect } from "react";
import "./styles.scss";
import { useAccount, useApi } from "@gear-js/react-hooks";
import { useNavigate } from "react-router-dom";
import { Box, LoadingOverlay, useMantineTheme } from "@mantine/core";

export type AuthorizedLayerProps = {
  children: ReactNode;
};

export const AuthorizedLayer: FC<AuthorizedLayerProps> = memo(
  ({ children }) => {
    const { isApiReady } = useApi();
    const theme = useMantineTheme();


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
        <Header />
        <Box className="content" pos="relative" sx={{
          '& svg > g > g ': {
            strokeWidth: 2
          }
        }}>
          {isLoading ? <LoadingOverlay visible loaderProps={{ size: 80, variant: 'oval', color: theme.primaryColor }} overlayColor={theme.colors.gray90[0]} /> : children}
        </Box>
      </div>
    );
  }
);
