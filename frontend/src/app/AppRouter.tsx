import React, { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { AuthorizedLayer } from "layouts/AuthorizedLayer";
import { routes } from "./routes";
import { newRoutes } from "./routes";
//
const History = React.lazy(() => import("pages/History").then(({ History }) => ({ default: History })));
const Lobby = React.lazy(() => import("pages/Lobby").then(({ Lobby }) => ({ default: Lobby })));
const Battle = React.lazy(() => import("pages/Battle").then(({ Battle }) => ({ default: Battle })));
const MyProfile = React.lazy(() => import("pages/MyProfile").then(({ MyProfile }) => ({ default: MyProfile })));
const BattleResultPage = React.lazy(() => import("pages/BattleResult").then(({ BattleResultPage }) => ({ default: BattleResultPage })));
const Leaderboard = React.lazy(() => import("pages/Leaderboard").then(({ Leaderboard }) => ({ default: Leaderboard })));
const Arena = React.lazy(() => import("pages/Arena").then(({ Arena }) => ({ default: Arena })));
const UploadStrategy = React.lazy(() => import("pages/UploadStrategy").then(({ UploadStrategy }) => ({ default: UploadStrategy })));
const MintCharacter = React.lazy(() => import("pages/MintCharacter").then(({ MintCharacter }) => ({ default: MintCharacter })));
const StartFight = React.lazy(() => import("pages/StartFight").then(({ StartFight }) => ({ default: StartFight })));
const StartScreen = React.lazy(() => import("pages/StartScreen").then(({ StartScreen }) => ({ default: StartScreen })));
const TournamentResultPage = React.lazy(() => import("pages/BattleResult/TournamentResult").then(({ TournamentResultPage }) => ({ default: TournamentResultPage })));
//

const options: Parameters<typeof createBrowserRouter>[1] = {
  // see more https://github.com/rafgraph/spa-github-pages
  // also this is related to the `homepage` field in package.json
  basename: "/Vara-Arena",
};

export const appRouter = createBrowserRouter(
  [
    { element: <StartScreen />, path: routes.startScreen },
    { element: <MintCharacter />, path: routes.mintCharacter, auth: true },

    { element: <UploadStrategy />, path: routes.strategy, auth: true },
    // 
    { element: <MyProfile />, path: routes.profileDynamic, auth: true },
    { element: <Battle />, path: routes.battle, auth: true },
    { element: < StartFight />, path: routes.startFightDynamic, auth: true },
    /**
     * NEW ROUTES:
    */
    { element: <Lobby />, path: newRoutes.lobbyDynamic, auth: true },
    { element: <Arena />, path: newRoutes.arena, auth: true },
    { element: <MyProfile />, path: newRoutes.myProfile, auth: true },
    { element: <Leaderboard />, path: newRoutes.leaderboard, auth: true },
    { element: <History />, path: newRoutes.history, auth: true },
    { element: <BattleResultPage />, path: newRoutes.battleResultDynamic, auth: true },
    { element: <TournamentResultPage />, path: newRoutes.tournamentResultDynamic, auth: true },
    /**
     * END NEW ROUTES
     */

    { element: <div></div>, path: routes.wildcard, auth: true },
  ].map(({ element, path, auth }) => ({
    element: auth ? (
      <Suspense>
        <AuthorizedLayer>{element}</AuthorizedLayer>
      </Suspense>
    ) : element,
    path,
  })),
  options
);
