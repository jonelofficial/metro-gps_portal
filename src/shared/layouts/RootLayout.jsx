import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../partials/Header";
import Sidebar from "../partials/Sidebar";
import { Box } from "@mui/material";

import "../../style/root/index.scss";

const RootLayout = () => {
  return (
    <Box className="main" component="section">
      <Box className="main__wrapper">
        <Sidebar />
        <Box className="body-wrapper">
          <Header />
          <Box className="body-wrapper__outlet">
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RootLayout;
