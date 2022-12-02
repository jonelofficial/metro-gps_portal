import { Box, Typography } from "@mui/material";
import React from "react";
import "../../style/outlet/users/users.scss";

const TableError = () => {
  return (
    <Box className="table">
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80%",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontFamily: "Helvetica",
            fontWeight: "bold",
            color: "custom.danger",
          }}
        >
          NO SERVER RESPONSE
        </Typography>
      </Box>
    </Box>
  );
};

export default TableError;
