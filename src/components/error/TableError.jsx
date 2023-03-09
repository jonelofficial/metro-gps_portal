import { Box, Typography } from "@mui/material";
import React from "react";
import "../../style/outlet/users/users.scss";
import Lottie from "lottie-react";
import error from "../../assets/images/lottie/error.json";

const TableError = () => {
  return (
    <Box
      className="table"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "600px",
          height: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Lottie animationData={error} loop={false} />
      </Box>
    </Box>
  );
};

export default TableError;
