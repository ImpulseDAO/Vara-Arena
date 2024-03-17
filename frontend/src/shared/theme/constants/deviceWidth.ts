export const deviceType = {
  desktob: "desktob",
  tablet: "tablet",
  mobile: "mobile",
};

export const deviceWidth: Record<keyof typeof deviceType, number> = {
  desktob: 1080,
  tablet: 720,
  mobile: 320,
} as const;
