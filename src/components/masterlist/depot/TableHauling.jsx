import React from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { IconButton, TableCell } from "@mui/material";

const TableHauling = ({ item, columns }) => {
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
      <StyledTableRow
        hover
        role="checkbox"
        tabIndex={-1}
        sx={{ "& > *": { borderBottom: "unset" } }}
      >
        {columns.map((column) => {
          const value = item[column.id];
          if (column.id === "icon") {
            return (
              <TableCell
                key={column.id}
                size="small"
                style={{ whiteSpace: "nowrap" }}
                align="center"
              >
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => setOpen(!open)}
                >
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </TableCell>
            );
          }

          return <TableCell></TableCell>;
        })}
      </StyledTableRow>
    </>
  );
};

export default TableHauling;
