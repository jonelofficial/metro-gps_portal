import { styled, TableCell, TableRow } from "@mui/material";
import React from "react";

const TableHighestKmRun = ({ item, columns }) => {
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
      <StyledTableRow hover role="checkbox">
        {columns.map((column) => {
          const value = item[column.id];
          return (
            <TableCell
              key={column.id}
              size="small"
              style={{ whiteSpace: "nowrap" }}
            >
              {/* {column.id === "department"
                ? item["user_id"].department.label
                : column.id === "vehicle_id"
                ? value.plate_no
                : column.id === "user_id" && value.first_name} */}
              {value}
            </TableCell>
          );
        })}
      </StyledTableRow>
    </>
  );
};

export default TableHighestKmRun;
