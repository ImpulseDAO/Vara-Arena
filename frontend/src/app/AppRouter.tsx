import { createBrowserRouter } from "react-router-dom";
import { AuthorizedLayer } from "layouts/AuthorizedLayer";
import { routes } from "./routes";
import { newRoutes } from "./routes";
//
import { Logs } from "pages/Logs";
import { Queue } from "pages/Queue";
import { Lobby } from "pages/Lobby";
import { Battle } from "pages/Battle";
import { MyProfile } from "pages/MyProfile";
import { BattleResult } from "pages/BattleResult";
import { Leaderboard } from "pages/Leaderboard";
import { BattlesList } from "pages/BattlesList";
import { UploadStrategy } from "pages/UploadStrategy";
import { MintCharacter, StartFight, StartScreen } from "pages";

const options: Parameters<typeof createBrowserRouter>[1] = {
  // see more https://github.com/rafgraph/spa-github-pages
  // also this is related to the `homepage` field in package.json
  basename: "/Vara-Arena",
};

export const appRouter = createBrowserRouter(
  [
    { element: <StartScreen />, path: routes.startScreen },
    { element: <MintCharacter />, path: routes.mintCharacter, auth: true },
    { element: <Queue />, path: routes.tournament, auth: true },

    { element: <UploadStrategy />, path: routes.strategy, auth: true },
    // 
    { element: <MyProfile />, path: routes.profileDynamic, auth: true },
    { element: <Battle />, path: routes.battle, auth: true },
    { element: < StartFight />, path: routes.startFightDynamic, auth: true },
    /**
     * NEW ROUTES:
    */
    { element: <Lobby />, path: newRoutes.lobbyDynamic, auth: true },
    { element: <BattlesList />, path: newRoutes.arena, auth: true },
    { element: <MyProfile />, path: newRoutes.myProfile, auth: true },
    { element: <Leaderboard />, path: newRoutes.leaderboard, auth: true },
    { element: <Logs />, path: newRoutes.myLogs, auth: true },
    { element: <BattleResult />, path: newRoutes.battleResultDynamic, auth: true },
    /**
     * END NEW ROUTES
     */

    { element: <div></div>, path: routes.wildcard, auth: true },
  ].map(({ element, path, auth }) => ({
    element: auth ? <AuthorizedLayer>{element}</AuthorizedLayer> : element,
    path,
  })),
  options
);
