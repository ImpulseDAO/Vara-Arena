import { createBrowserRouter } from "react-router-dom";
import { AuthorizedLayer } from "layouts/AuthorizedLayer";
import { routes } from "./routes";
import { newRoutes } from "./routes";
//
import { Logs } from "pages/Logs";
import { Queue } from "pages/Queue";
import { Battle } from "pages/Battle";
import { Profile } from "pages/Profile";
import { Leaderboard } from "pages/Leaderboard";
import { UploadStrategy } from "pages/UploadStrategy";
import { MintCharacter, StartScreen } from "pages";
import { Lobby } from "pages/Lobby";
import { BattlesList } from "pages/BattlesList";

export const appRouter = createBrowserRouter(
  [
    { element: <StartScreen />, path: routes.startScreen },
    { element: <MintCharacter />, path: routes.mintCharacter, auth: true },
    { element: <Queue />, path: routes.tournament, auth: true },

    { element: <Logs />, path: routes.logs, auth: true },
    { element: <UploadStrategy />, path: routes.strategy, auth: true },
    // 
    { element: <Profile />, path: routes.profileDynamic, auth: true },
    { element: <Battle />, path: routes.battle, auth: true },
    /**
     * NEW ROUTES:
     */
    { element: <Lobby />, path: newRoutes.lobby, auth: true },
    { element: <BattlesList />, path: newRoutes.arena, auth: true },
    { element: <Profile />, path: newRoutes.myProfile, auth: true },
    { element: <Leaderboard />, path: newRoutes.leaderboard, auth: true },
    /**
     * END NEW ROUTES
     */

    { element: <div></div>, path: routes.wildcard, auth: true },
  ].map(({ element, path, auth }) => ({
    element: auth ? <AuthorizedLayer>{element}</AuthorizedLayer> : element,
    path,
  }))
);
