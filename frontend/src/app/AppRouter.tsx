import { createBrowserRouter } from "react-router-dom";
import { AuthorizedLayer } from "layouts/AuthorizedLayer";
//
import { Logs } from "pages/Logs";
import { Queue } from "pages/Queue";
import { Battle } from "pages/Battle";
import { Profile } from "pages/Profile";
import { StartFight } from "pages/StartFight";
import { Leaderboard } from "pages/Leaderboard";
import { UploadStrategy } from "pages/UploadStrategy";
import { MintCharacter, StartScreen } from "pages";

const routes = [
  { element: <StartScreen />, path: "/" },
  { element: <MintCharacter />, path: "/mint-character", auth: true },
  { element: <Queue />, path: "/tournament", auth: true },
  { element: <Leaderboard />, path: "/leaderboard", auth: true },
  { element: <Logs />, path: "/logs", auth: true },
  { element: <UploadStrategy />, path: "/strategy", auth: true },
  { element: <StartFight />, path: "/arena", auth: true },
  { element: <Profile />, path: "/profile/:id/", auth: true },
  { element: <Battle />, path: "/battle", auth: true },
  { element: <div></div>, path: "/*", auth: true },
];

export const appRouter = createBrowserRouter(
  routes.map(({ element, path, auth }) => ({
    element: auth ? <AuthorizedLayer>{element}</AuthorizedLayer> : element,
    path,
  }))
);
