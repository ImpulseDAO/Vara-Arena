import React, { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { AuthorizedLayer } from "layouts/AuthorizedLayer";
import { oldRoutes } from "./routes";
import { routes } from "./routes";
import { ProfilePage } from "pages/MyProfile/MyProfile";
import { LogoutScreen } from "pages/LogoutScreen";
import { APP_ROUTER_BASENAME } from "consts";
//
const History = React.lazy(() => import("pages/History").then(({ History }) => ({ default: History })));
const Lobby = React.lazy(() => import("pages/Lobby").then(({ Lobby }) => ({ default: Lobby })));
const MyProfile = React.lazy(() => import("pages/MyProfile").then(({ MyProfile }) => ({ default: MyProfile })));
const BattleResultPage = React.lazy(() => import("pages/BattleResult").then(({ BattleResultPage }) => ({ default: BattleResultPage })));
const Leaderboard = React.lazy(() => import("pages/Leaderboard").then(({ Leaderboard }) => ({ default: Leaderboard })));
const Arena = React.lazy(() => import("pages/Arena").then(({ Arena }) => ({ default: Arena })));
const UploadStrategy = React.lazy(() => import("pages/UploadStrategy").then(({ UploadStrategy }) => ({ default: UploadStrategy })));
const MintCharacter = React.lazy(() => import("pages/MintCharacter").then(({ MintCharacter }) => ({ default: MintCharacter })));
const StartScreen = React.lazy(() => import("pages/StartScreen").then(({ StartScreen }) => ({ default: StartScreen })));
const TournamentResultPage = React.lazy(() => import("pages/BattleResult/TournamentResult").then(({ TournamentResultPage }) => ({ default: TournamentResultPage })));
//

const options: Parameters<typeof createBrowserRouter>[1] = {
  // see more https://github.com/rafgraph/spa-github-pages
  // also this is related to the `homepage` field in package.json
  basename: APP_ROUTER_BASENAME,
};

export const appRouter = createBrowserRouter(
  [
    { element: <UploadStrategy />, path: oldRoutes.strategy, auth: true },
    /**
     * NEW ROUTES:
    */
    { element: <LogoutScreen />, path: routes.logoutScreen },
    { element: <StartScreen />, path: routes.startScreen },
    { element: <MintCharacter />, path: routes.mintCharacter, auth: true },
    { element: <Lobby />, path: routes.lobbyDynamic, auth: true },
    { element: <Arena />, path: routes.arena, auth: true },
    { element: <MyProfile />, path: routes.myProfile, auth: true },
    { element: <ProfilePage />, path: routes.profileDynamic, auth: true },
    { element: <Leaderboard />, path: routes.leaderboard, auth: true },
    { element: <History />, path: routes.history, auth: true },
    { element: <BattleResultPage />, path: routes.battleResultDynamic, auth: true },
    { element: <TournamentResultPage />, path: routes.tournamentResultDynamic, auth: true },
    /**
     * END NEW ROUTES
     */

    { element: <div></div>, path: routes.wildcard, auth: true },
  ].map(({ element, path, auth }) => ({
    path,
    element:
      <Suspense>
        {
          auth
            ? <AuthorizedLayer>{element}</AuthorizedLayer>
            : element
        }
      </Suspense>

  })),
  options
);
