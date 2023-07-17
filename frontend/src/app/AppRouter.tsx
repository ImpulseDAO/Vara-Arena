import { createHashRouter } from "react-router-dom";
import { MintCharacter, StartScreen } from "../pages";
import { AuthorizedLayer } from "layouts/AuthorizedLayer";
import { StartFight } from "pages/StartFight";
import { Queue } from "pages/Queue";
import { Leaderboard } from "../pages/Leaderboard";
import { Logs } from "../pages/Logs";
import { Profile } from "pages/Profile";
import { UploadStrategy } from "pages/UploadStrategy";
import { Battle } from "pages/Battle";

export const appRouter = createHashRouter([
  {
    element: <StartScreen />,
    path: "/",
  },
  {
    element: (
      <AuthorizedLayer>
        <MintCharacter />
      </AuthorizedLayer>
    ),
    path: "/mint-character",
  },
  {
    element: (
      <AuthorizedLayer>
        <Queue />
      </AuthorizedLayer>
    ),
    path: "/arena/queue",
  },
  {
    element: (
      <AuthorizedLayer>
        <Leaderboard />
      </AuthorizedLayer>
    ),
    path: "/leaderboard",
  },
  {
    element: (
      <AuthorizedLayer>
        <Logs />
      </AuthorizedLayer>
    ),
    path: "/logs",
  },
  {
    element: (
      <AuthorizedLayer>
        <UploadStrategy />
      </AuthorizedLayer>
    ),
    path: "/strategy",
  },
  {
    element: (
      <AuthorizedLayer>
        <StartFight />
      </AuthorizedLayer>
    ),
    path: "/arena",
  },
  {
    element: (
      <AuthorizedLayer>
        <Profile />
      </AuthorizedLayer>
    ),
    path: "/my_profile",
  },
  {
    element: (
      <AuthorizedLayer>
        <Battle />
      </AuthorizedLayer>
    ),
    path: "/battle",
  },
  {
    element: (
      <AuthorizedLayer>
        <div></div>
      </AuthorizedLayer>
    ),
    path: "/*",
  },
]);
