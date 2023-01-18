import { Box } from "@mui/material";
import React from "react";

const TableWrapper = ({ children, ...etc }) => {
  return (
    <Box className="table" {...etc}>
      {children}
    </Box>
  );
};

export default TableWrapper;
