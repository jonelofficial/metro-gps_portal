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
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLimit, setPage } from "../../redux-toolkit/counter/featuresCounter";

const TableUI = ({
  columns,
  isFetching,
  data,
  rows,
  state,
  setState,
  ...etc
}) => {
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
    state && setState((prevState) => ({ ...prevState, page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch(setLimit(event.target.value));
    dispatch(setPage(1));
    state &&
      setState((prevState) => ({
        ...prevState,
        page: 1,
        limit: event.target.value,
      }));
  };
  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440, minHeight: "10px" }} {...etc}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <StyledTableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, ...column?.style }}
                >
                  {column.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>{rows}</TableBody>
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
      {data?.pagination && (
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100, data?.pagination.totalItems]}
          component="div"
          count={data?.pagination.totalItems}
          rowsPerPage={state ? state.limit : limit}
          page={state ? state.page - 1 : page - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Paper>
  );
};

export default TableUI;
