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
  myLogs: "/my-logs",
  lobbyDynamic: "/lobby/:lobbyId",
  lobby: (lobbyId: string) => `/lobby/${lobbyId}`,
  leaderboard: "/leaderboard",
  myProfile: "/my-profile",
  battleResultDynamic: "/battle-result/:lobbyId",
  battleResult: (lobbyId: string) => `/battle-result/${lobbyId}`,
};
