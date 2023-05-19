import { TableCell, TableRow, styled } from "@mui/material";
import React from "react";
import TableAction from "../../table/TableAction";

const TableDestination = ({ item, columns }) => {
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },

    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  return (
    <StyledTableRow hover role="checkbox" tabIndex={-1} sx={{ height: "10px" }}>
      {columns.map((column) => {
        const value = item[column.id];

        return (
          <TableCell
            key={column.id}
            size="small"
            style={{
              whiteSpace: "nowrap",
              textTransform: "capitalize",
            }}
          >
            {column.id === "action" ? <TableAction item={item} /> : value}
          </TableCell>
        );
      })}
    </StyledTableRow>
  );
};

export default TableDestination;
