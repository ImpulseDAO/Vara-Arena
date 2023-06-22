import { createHashRouter } from 'react-router-dom';
import { MintCharacter, StartScreen } from '../pages';
import { AuthorizedLayer } from 'layouts/AuthorizedLayer';
import { StartFight } from 'pages/StartFight';
import { Queue } from 'pages/Queue';
import { NavWrapper } from './NavWrapper';
import { Leaderboard } from '../pages/Leaderboard';
import { Logs } from '../pages/Logs';
import { Profile } from 'pages/Profile';
import { UploadStrategy } from 'pages/UploadStrategy';
import { Battle } from 'pages/Battle';

export const appRouter = createHashRouter([
  {
    element: <StartScreen />,
    path: '/',
  },
  {
    element: (
      <AuthorizedLayer>
        <NavWrapper>
          <MintCharacter />
        </NavWrapper>
      </AuthorizedLayer>
    ),
    path: '/mint-character',
  },
  {
    element: (
      <AuthorizedLayer>
        <NavWrapper>
          <Queue />
        </NavWrapper>
      </AuthorizedLayer>
    ),
    path: '/arena/queue',
  },
  {
    element: (
      <AuthorizedLayer>
        <NavWrapper>
          <Leaderboard />
        </NavWrapper>
      </AuthorizedLayer>
    ),
    path: '/leaderboard',
  },
  {
    element: (
      <AuthorizedLayer>
        <NavWrapper>
          <Logs />
        </NavWrapper>
      </AuthorizedLayer>
    ),
    path: '/logs',
  },
  {
    element: (
      <AuthorizedLayer>
        <NavWrapper>
          <UploadStrategy />
        </NavWrapper>
      </AuthorizedLayer>
    ),
    path: '/strategy',
  },
  {
    element: (
      <AuthorizedLayer>
        <NavWrapper>
          <StartFight />
        </NavWrapper>
      </AuthorizedLayer>
    ),
    path: '/arena/',
  },
  {
    element: (
      <AuthorizedLayer>
        <NavWrapper>
          <Profile />
        </NavWrapper>
      </AuthorizedLayer>
    ),
    path: '/my_profile',
  },
  {
    element: (
      <AuthorizedLayer>
        <NavWrapper>
          <Battle />
        </NavWrapper>
      </AuthorizedLayer>
    ),
    path: '/battle',
  },
  {
    element: (
      <AuthorizedLayer>
        <NavWrapper>
          <div></div>
        </NavWrapper>
      </AuthorizedLayer>
    ),
    path: '/*',
  },
]);
