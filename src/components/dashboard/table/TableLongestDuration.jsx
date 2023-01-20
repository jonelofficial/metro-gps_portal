import { styled, TableCell, TableRow } from "@mui/material";
import dayjs from "dayjs";
import React from "react";

const TableLongestDuration = ({ item, columns }) => {
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
          let hours;
          let minutes;
          if (column.id === "duration") {
            const totalMinutes = Math.floor(value / (1000 * 60));
            hours = Math.floor(totalMinutes / 60);
            minutes = totalMinutes % 60;
          }
          return (
            <TableCell
              key={column.id}
              size="small"
              style={{ whiteSpace: "nowrap" }}
            >
              {column.id === "duration"
                ? `${hours > 0 ? hours + " hours " : ""} 
                ${minutes > 0 ? minutes + " minutes " : ""}`
                : column.id === "departure" || column.id === "arrival"
                ? dayjs(value).format("MMM-DD-YY hh:mm a")
                : value}
            </TableCell>
          );
        })}
      </StyledTableRow>
    </>
  );
};

export default TableLongestDuration;
