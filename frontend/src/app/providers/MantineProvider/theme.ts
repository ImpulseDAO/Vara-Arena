import {
  type DefaultMantineColor,
  type MantineThemeOverride,
  type CSSVariablesResolver,
  rem,
  MantineColorsTuple,
  darken,
} from "@mantine/core";

export const customColors = {
  // as in Figma
  // https://www.figma.com/file/k61yZ0UVAlmOlvtTRJWFCh/Marketplace?node-id=470%3A11377&t=S3aqhDYsBpC3jlk8-4
  primary: "#2C67FF",
  background: "rgba(0, 0, 0, 0.7)",
  //
  redHealth: "#f93642",
  blueEnergy: "#2152ff",
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
    if (Array.isArray(value)) return { ...acc, [key]: value };

    /**
     * Mantine theme has 10 shades of each color
     * We use only 2 shades: light and dark.
     * We make the last array element (index 9) darker
     */
    return {
      ...acc,
      [key]: Array(10)
        .fill(value)
        .map((color, idx) => {
          return idx === 9 ? darken(color, 0.3) : color;
        }),
    };
  }, {});

export const theme: MantineThemeOverride = {
  black: "#000000",
  white: "#FFFFFF",
  colors: {
    ...formatColors(customColors),
  },
  fontFamily: "Poppins, sans-serif",
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
  components: {
    Modal: {},
  },
  other: {
    // you can add here anything
  },
};

/**
 *
 */

export const cssVariablesResolver: CSSVariablesResolver = (theme) => ({
  variables: {},
  dark: {
    ...overwrittenVariables,
  },
  light: {
    ...overwrittenVariables,
  },
});

const overwrittenVariables = {
  "--mantine-color-body": "rgba(0, 0, 0, 0.7)",
} as const;

/**
 *
 */

type ExtendedCustomColors = keyof typeof customColors | DefaultMantineColor;

declare module "@mantine/core" {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, MantineColorsTuple>;
  }
  export interface MantineThemeOther {
    // you can add here anything
  }
}
