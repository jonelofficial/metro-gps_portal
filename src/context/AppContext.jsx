import React, { useState } from "react";
import { Alert, Snackbar, useMediaQuery } from "@mui/material";
import WebAppContext from "./context";
import { useEffect } from "react";

const AppContext = ({ children }) => {
  const small = useMediaQuery("(max-width: 480px)");

  const [snackbar, setSnackbar] = useState({
    open: false,
    duration: 4000,
    severity: "success",
    message: "Message here",
    vertical: "bottom",
    horizontal: small ? "center" : "left",
  });

  useEffect(() => {
    setSnackbar((prevState) => ({
      ...prevState,
      horizontal: small ? "center" : "left",
    }));

    return () => {
      null;
    };
  }, [small]);

  const { vertical, horizontal } = snackbar;

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbar((prevState) => ({ ...prevState, open: false }));
  };

  const toast = (data) => {
    setSnackbar((prevState) => ({ ...prevState, open: true, ...data }));
  };
  return (
    <WebAppContext.Provider value={{ toast }}>
      {children}
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={snackbar.open}
        autoHideDuration={snackbar.duration}
        onClose={handleClose}
      >
        <Alert
          variant="filled"
          onClose={handleClose}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </WebAppContext.Provider>
  );
};

export default AppContext;
