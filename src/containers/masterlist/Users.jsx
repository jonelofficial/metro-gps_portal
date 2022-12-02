import {
  Autocomplete,
  Box,
  Button,
  createFilterOptions,
  Drawer,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  styled,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
} from "@mui/material";
import { tableCellClasses } from "@mui/material";
import React, { useState } from "react";
import { useGetAllUsersQuery } from "../../api/metroApi";
import TableUsers from "./users/TableUsers.jsx";
import "../../style/outlet/users/users.scss";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import TableSkeleton from "../../components/skeleton/TableSkeleton";
import TableError from "../../components/error/TableError";
import SearchIcon from "@mui/icons-material/Search";
import UserDrawer from "../../components/drawer/UserDrawer";

const Users = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [drawer, setDrawer] = useState(false);
  const [filterVal, setFilterVal] = useState({
    id: "employee_id",
    label: "Employee Id",
  });

  const { data, isLoading, isError } = useGetAllUsersQuery({ page: 1 });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const columns = [
    { id: "employee_id", label: "Employee Id" },
    {
      id: "first_name",
      label: "First Name",
    },
    {
      id: "last_name",
      label: "Last Name",
    },
    {
      id: "username",
      label: "Username",
    },
    {
      id: "trip_template",
      label: "Trip Template",
    },
    {
      id: "role",
      label: "Role",
    },
    {
      id: "profile",
      label: "Profile",
    },
    {
      id: "createdAt",
      label: "Created",
      format: (value) =>
        new Date(value).toLocaleDateString("en-us", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      id: "status",
      label: "Status",
    },
    {
      id: "action",
      label: "Action",
    },
  ];

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.custom.mediumDark,
      color: theme.palette.common.white,
      textTransform: "uppercase",
    },
  }));

  const filterOptions = createFilterOptions({
    matchFrom: "start",
    stringify: (option) => option.label,
  });

  const handleFilter = (data) => {
    data == null
      ? setFilterVal({
          id: "employee_id",
          label: "Employee Id",
        })
      : setFilterVal(data);
  };

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (isError) {
    return <TableError />;
  }

  return (
    <Box className="table">
      <Box className="table__header">
        <Box className="table__filter-wrapper">
          <Autocomplete
            size="small"
            options={columns}
            value={filterVal}
            isOptionEqualToValue={(option, value) =>
              option.label === option.label
            }
            getOptionLabel={(option) => option.label}
            filterOptions={filterOptions}
            sx={{ width: 200, paddingRight: "10px" }}
            renderInput={(params) => (
              <TextField {...params} label="Search By" />
            )}
            onChange={(event, value) => handleFilter(value)}
          />
          <TextField size="small" sx={{ width: "180px" }} />
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            sx={{ marginLeft: "10px" }}
          >
            Search
          </Button>
        </Box>
        <Box className="table__button-wrapper">
          <Tooltip title="Export">
            <IconButton sx={{ marginRight: "15px" }}>
              <FileDownloadIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            color="customSuccess"
            onClick={() => setDrawer(true)}
          >
            Create
          </Button>
        </Box>
      </Box>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <StyledTableCell key={column.id} align={column.align}>
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
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={data.data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Drawer anchor="right" open={drawer} onClose={() => setDrawer(false)}>
        <UserDrawer />
      </Drawer>
    </Box>
  );
};

export default Users;
