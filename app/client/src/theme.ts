import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

// const config: ThemeConfig = {
//     initialColorMode: "dark",
//     useSystemColorMode: true,

// }
const theme = extendTheme({
  config: {
    useSystemColorMode: true,
  },
  styles: {
    global: {
      body: {
        margin: 0,
      },
    },
    Stack: {
      margin: 0,
    }
  },
});

export default theme;
