import {
  CircularProgress,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLimit, setPage } from "../../redux-toolkit/counter/featuresCounter";
import TableUsers from "../masterlist/users/TableUsers";

const TableUI = ({ columns, isFetching, data }) => {
  //   const [page, setPage] = useState(1);
  //   const [rowsPerPage, setRowsPerPage] = useState(10);
  const { page, limit } = useSelector((state) => state.features.table);
  const dispatch = useDispatch();

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.custom.mediumDark,
      color: theme.palette.common.white,
      textTransform: "uppercase",
    },
  }));

  const handleChangePage = (event, newPage) => {
    dispatch(setPage(newPage + 1));
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch(setLimit(event.target.value));
    dispatch(setPage(1));
  };
  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440, minHeight: "10px" }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <StyledTableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.data.map((item, i) => {
              return <TableUsers key={i} item={item} columns={columns} />;
            })}
          </TableBody>
        </Table>
        {isFetching && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              padding: "10px 0",
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100, data?.pagination.totalItems]}
        component="div"
        count={data.pagination.totalItems}
        rowsPerPage={limit}
        page={page - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default TableUI;
