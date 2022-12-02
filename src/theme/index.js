import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      light: "#f8d738",
      main: "#f6a03d",
      dark: "#e8673d",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#000",
    },
    danger: {
      light: "#f56565",
      main: "#f56565",
    },
    custom: {
      danger: "#f56565",
      warning: "#eed202",
      success: "#48bb78",
      dark: "#fff",
      mediumDark: "#000000db",
    },
    customSuccess: {
      light: "#48bb78",
      main: "#48bb78",
      dark: "#3ca266",
      contrastText: "#fff",
    },
  },
  typography: {
    fontFamily: [
      "Open Sans",
      "Montserrat",
      "Roboto",
      "Helvetica",
      "sans-serif",
    ].join(","),
  },
});
