import { createMuiTheme as createTheme } from '@material-ui/core';

const theme = createTheme({
    typography: {
        fontFamily: ['Anakotmai', 'san-serif'].join(',')
    },
    palette: {
      primary: {
          main: "#ffc107",
        },
        secondary: {
            main: "#fff",
          },
    },
});

export default theme;