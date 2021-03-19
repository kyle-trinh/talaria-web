import { extendTheme } from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";

const fonts = { mono: `'Menlo', monospace` };

const breakpoints = createBreakpoints({
  sm: "40em",
  md: "52em",
  lg: "64em",
  xl: "80em",
});

const theme = extendTheme({
  colors: {
    black: "#16161D",
    teal: {
      50: "#d8ffff",
      100: "#acf9ff",
      200: "#7df4ff",
      300: "#4defff",
      400: "#27ebfe",
      500: "#17d1e5",
      600: "#00a3b3",
      700: "#007481",
      800: "#00474f",
      900: "#00191e",
    },
  },
  fonts,
  breakpoints,
});

export default theme;
