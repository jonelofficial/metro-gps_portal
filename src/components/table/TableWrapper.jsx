import { Box } from "@mui/material";
import React from "react";
import TableUsers from "../masterlist/users/TableUsers";

const TableWrapper = ({ children }) => {
  return <Box className="table">{children}</Box>;
};

export default TableWrapper;
