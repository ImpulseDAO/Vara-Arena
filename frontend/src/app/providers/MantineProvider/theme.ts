import {
  type Tuple,
  type DefaultMantineColor,
  type MantineThemeOverride,
  rem,
} from "@mantine/core";

export const customColors = {
  // as in Figma
  // https://www.figma.com/file/k61yZ0UVAlmOlvtTRJWFCh/Marketplace?node-id=470%3A11377&t=S3aqhDYsBpC3jlk8-4
  primary: "#2C67FF",
  //
  themeLightBlue: "#E3F3FF",
  backgroundLightGreen: "#E9F1E5",
  backgroundLightGreenHover: "#BFD6B2",
  backgroundLightBlue: "#EAF9FF",
  backgroundLightBlueHover: "#CBEDFB",
  red: "#F93642",
  //
  white: "#FFFFFF",
  //
  gray5: "#F6F7F9",
  gray10: "#EAEDF0",
  gray25: "#C6CAD2",
  gray35: "#A8AEBA",
  gray50: "#737A87",
  gray80: "#3B3E45",
  gray90: "#1C1C1C",
  //
};

// format colors for mantine theme
const formatColors = (colors: typeof customColors) =>
  Object.entries(colors).reduce((acc, item) => {
    const [key, value] = item;
    return { ...acc, [key]: Array(10).fill(value) };
  }, {});

export const theme: MantineThemeOverride = {
  colorScheme: "light",
  black: "#18191B",
  white: "#FFFFFF",
  colors: {
    ...formatColors(customColors),
  },
  fontFamily: "Inter, sans-serif",
  // these are default values of breakpoints
  // https://mantine.dev/styles/responsive/
  breakpoints: {
    xs: "36em",
    sm: "48em",
    md: "62em",
    lg: "75em",
    xl: "88em",
  },
  primaryColor: "primary",
  primaryShade: {
    light: 6,
    dark: 8,
  },
  headings: {
    sizes: {
      h1: { fontSize: rem(32), lineHeight: rem(40) },
      h2: { fontSize: rem(24), lineHeight: rem(32) },
      h3: { fontSize: rem(20), lineHeight: rem(32) },
    },
  },
  components: {
    Button: {
      defaultProps: {
        sx: (theme) => ({
          transition: "all 0.07s ease-in-out",
          "&:hover": {
            backgroundColor: `${theme.fn.darken(
              theme.colors.primary[0],
              0.07
            )}!important`,
          },
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px 18px",
        }),
      },
    },
    Container: {
      defaultProps: {
        sizes: {
          xs: 540,
          sm: 720,
          md: 960,
          lg: 1140,
          xl: 1440,
        },
      },
      styles: (theme) => ({
        root: {
          width: "100%",
          paddingLeft: theme.spacing.xl,
          paddingRight: theme.spacing.xl,
          // styles for mobile
          [theme.fn.smallerThan("sm")]: {
            paddingLeft: theme.spacing.md,
            paddingRight: theme.spacing.md,
          },
        },
      }),
    },
  },
  fontSizes: {
    xs: rem(10),
    sm: rem(13),
    md: rem(16),
    lg: rem(18),
    xl: rem(20),
  },
  radius: {
    xs: rem(4),
    sm: rem(8),
    md: rem(12),
    xl: rem(24),
  },
  spacing: {
    xs: rem(8),
    sm: rem(12),
    md: rem(16),
    lg: rem(24),
    xl: rem(32),
  },
  other: {
    // you can add here anything
  },
  globalStyles: (theme) => ({
    "*": {
      boxSizing: "border-box",
      margin: 0,
      padding: 0,
    },
    a: {
      color: "inherit",
      textDecoration: "none",
    },
    body: {
      color: theme.white,
    },
  }),
};

type ExtendedCustomColors = keyof typeof customColors | DefaultMantineColor;

declare module "@mantine/core" {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, Tuple<string, 10>>;
  }
  export interface MantineThemeOther {
    // you can add here anything
  }
}
