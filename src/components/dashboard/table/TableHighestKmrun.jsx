import { Box, styled, TableCell, TableRow } from "@mui/material";
import React from "react";

const TableHighestKmrun = ({ item, columns }) => {
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
              {column.id === "locations"
                ? value.map((loc, i) => {
                    return (
                      <Box
                        key={i}
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "90px 1fr",
                        }}
                      >
                        <Box>{`${loc.status
                          .toLowerCase()
                          .replace(/\b\w/g, (l) => l.toUpperCase())} =>`}</Box>
                        <Box>{`${loc.address[0].city}`}</Box>
                      </Box>
                    );
                  })
                : value}
            </TableCell>
          );
        })}
      </StyledTableRow>
    </>
  );
};

export default TableHighestKmrun;
