import {
  Box,
  Collapse,
  IconButton,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { theme } from "../../../theme";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import dayjs from "dayjs";

const TableHighestKmrun = ({ item, columns }) => {
  const [open, setOpen] = useState(false);

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
          return (
            <TableCell
              key={column.id}
              size="small"
              style={{ whiteSpace: "nowrap" }}
            >
              {column.id === "_id" ? `${value.slice(20)}` : value}
            </TableCell>
          );
        })}
      </StyledTableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Locations
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {item?.locations?.map((loc, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell
                          sx={{
                            minWidth: "90px",
                            color:
                              loc.status === "left"
                                ? theme.palette.custom.danger
                                : loc.status === "arrived"
                                ? theme.palette.custom.success
                                : theme.palette.customBlue.main,
                          }}
                        >
                          {`${loc.status
                            .toLowerCase()
                            .replace(/\b\w/g, (l) => l.toUpperCase())}`}
                        </TableCell>

                        <TableCell>
                          {`${loc?.address[0]?.name || "(No Name)"}  ${
                            loc?.address[0]?.district || "(No District)"
                          } ${loc?.address[0]?.city || "(No City)"}  ${
                            loc?.address[0]?.subregion || "(No Subregion)"
                          }`}
                        </TableCell>

                        <TableCell>
                          {dayjs(loc?.date).format("MMM-DD-YY h:mm a")}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default TableHighestKmrun;
