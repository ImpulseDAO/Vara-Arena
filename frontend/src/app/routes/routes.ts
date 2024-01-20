export const routes = {
  startScreen: "/",
  mintCharacter: "/mint-character",
  tournament: "/tournament",
  leaderboard: "/leaderboard",
  logs: "/logs",
  strategy: "/strategy",
  arena: "/arena",
  //
  profileDynamic: "/profile/:profileId",
  profile: (profileId: string) => `/profile/${profileId}`,
  //
  battle: "/battle",
  wildcard: "/*",
  //
  startFightDynamic: `/start-fight/:lobbyId`,
  startFight: (lobbyId: string) => `/start-fight/${lobbyId}`,
};

export const newRoutes = {
  home: "/",
  arena: "/arena",
  history: "/history",
  lobbyDynamic: "/lobby/:lobbyId",
  lobby: (lobbyId: string) => `/lobby/${lobbyId}`,
  leaderboard: "/leaderboard",
  myProfile: "/my-profile",
  //
  battleResultDynamic: "/battle-result/:battleId",
  battleResult: (battleId: string) => `/battle-result/${battleId}`,
  //
  tournamentResultDynamic: "/tournament-result/:lobbyId/:battleId?",
  tournamentResult: ({
    lobbyId,
    battleId,
  }: {
    lobbyId: string;
    battleId?: string;
  }) => `/tournament-result/${lobbyId}${battleId ? `/${battleId}` : ""}`,
};

export const staticRoutes = {
  discord: "https://discord.gg/JNrDXbKVpz",
};
