export const oldRoutes = {
  strategy: "/strategy",
};

export const routes = {
  wildcard: "/*",
  startScreen: "/",
  arena: "/arena",
  history: "/history",
  mintCharacter: "/mint-character",
  lobbyDynamic: "/lobby/:lobbyId",
  lobby: (lobbyId: string) => `/lobby/${lobbyId}`,
  leaderboard: "/leaderboard",
  myProfile: "/my-profile",
  profileDynamic: "/profile/:profileId",
  profile: (profileId: string) => `/profile/${profileId}`,
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
