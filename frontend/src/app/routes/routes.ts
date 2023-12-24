export const routes = {
  startScreen: "/",
  mintCharacter: "/mint-character",
  tournament: "/tournament",
  leaderboard: "/leaderboard",
  logs: "/logs",
  strategy: "/strategy",
  arena: "/arena",
  profile: (profileId: string) => `/profile/${profileId}`,
  profileDynamic: "/profile/:profileId",
  battle: "/battle",
  wildcard: "/*",
};

export const newRoutes = {
  home: "/",
  arena: "/arena",
  myLogs: "/my-logs",
  lobby: "/lobby",
  leaderboard: "/leaderboard",
  myProfile: "/my-profile",
};
