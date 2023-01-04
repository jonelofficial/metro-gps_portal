import { Box } from "@mui/material";
import React from "react";

const TableWrapper = ({ children }) => {
  return <Box className="table">{children}</Box>;
};

export default TableWrapper;
