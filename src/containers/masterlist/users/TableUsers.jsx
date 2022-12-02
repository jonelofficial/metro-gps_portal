import { styled, TableCell, TableRow } from "@mui/material";
import React from "react";
import UserAction from "./UserAction";

const TableUsers = ({ item, columns }) => {
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },

    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  return (
    <>
      <StyledTableRow hover role="checkbox" tabIndex={-1}>
        {columns.map((column) => {
          const value = item[column.id];
          return (
            <TableCell key={column.id}>
              {column.id === "profile" && value != null ? (
                <a href={`${process.env.BASEURL}/${value}`} target="_blank">
                  View
                </a>
              ) : column.id === "profile" &&
                value == null ? null : column.id === "createdAt" ? (
                column.format(value)
              ) : column.id === "action" ? (
                <UserAction item={item} />
              ) : (
                value
              )}
            </TableCell>
          );
        })}
      </StyledTableRow>
    </>
  );
};

export default TableUsers;
