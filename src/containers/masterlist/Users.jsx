import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  createFilterOptions,
  Drawer,
  IconButton,
  Modal,
  Paper,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { tableCellClasses } from "@mui/material";
import React, { useState } from "react";
import { useGetAllUsersQuery } from "../../api/metroApi";
import TableUsers from "../../components/masterlist/users/TableUsers.jsx";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import TableSkeleton from "../../components/skeleton/TableSkeleton";
import TableError from "../../components/error/TableError";
import SearchIcon from "@mui/icons-material/Search";
import UserDrawer from "../../components/masterlist/users/UserDrawer";
import "../../style/outlet/users/users.scss";
import { memo } from "react";
import InputField from "../../components/form/InputField";
import { useForm } from "react-hook-form";
import RefreshIcon from "@mui/icons-material/Refresh";
import PublishIcon from "@mui/icons-material/Publish";
import AddIcon from "@mui/icons-material/Add";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import { LoadingButton } from "@mui/lab";

const Users = () => {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [drawer, setDrawer] = useState(false);

  const [searchVal, setSearchVal] = useState({ item: "", filter: null });
  const [filterVal, setFilterVal] = useState({
    id: "employee_id",
    label: "Employee Id",
  });

  const [excelFile, setExcelFile] = useState({});
  const [excelJson, setExcelJson] = useState([]);
  const [openImport, setOpenImport] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    control,
  } = useForm();

  const { data, isLoading, isError, isFetching } = useGetAllUsersQuery({
    page: page,
    limit: rowsPerPage,
    search: searchVal.item,
    searchBy: searchVal.filter,
  });
  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(1);
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
      id: "department",
      label: "Department",
    },
    {
      id: "license_exp",
      label: "License Exp",
    },
    {
      id: "status",
      label: "Status",
    },
    {
      id: "createdAt",
      label: "Created",
    },
    {
      id: "action",
      label: "Action",
    },
  ];

  const dropData = [
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
      id: "department",
      label: "Deparment",
    },
    {
      id: "role",
      label: "Role",
    },
    {
      id: "status",
      label: "Status",
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

  const handleSearch = async (data) => {
    setSearchVal({ item: data.search, filter: filterVal.id });
  };

  const handleRefresh = () => {
    setFilterVal({
      id: "employee_id",
      label: "Employee Id",
    });
    setSearchVal({ item: "", filter: null });
    setPage(1);
    setRowsPerPage(10);
    reset();
  };

  const handleToggleExport = async () => {
    setOpen(true);

    let newObj = [];

    await data.data.map((item) => {
      newObj.push({
        "EMPLOYEE ID": item.employee_id,
        "FIRST NAME": item.first_name,
        "LAST NAME": item.last_name,
        USERNAME: item.username,
        "TRIP TEMPLATE": item.trip_template,
        ROLE: item.role,
        "LICENSE EXP": dayjs(item.license_exp).format("MMM-DD-YYYY"),
        STATUS: item.status,
        "CREATED AT": dayjs(item.createdAt).format("MMM-DD-YYYY"),
      });
    });

    const workbook = XLSX.utils.book_new(),
      worksheet = XLSX.utils.json_to_sheet(newObj);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(
      workbook,
      `METRO-USER-MASTERLIST ${dayjs().format("MMM-DD-YYYY")}.xlsx`
    );

    setOpen(false);
  };

  const handleToggleImport = async () => {
    setOpenImport(true);
  };

  const filterHeader = async (jsonData) => {
    await jsonData.map((row) => {
      Object.keys(row).map((key) => {
        let newKey = key.trim().toLowerCase().replace(/ /g, "_");
        if (key !== newKey) {
          row[newKey] = row[key];
          delete row[key];
        }
      });
    });

    return jsonData;
  };

  const handleImport = async (data) => {
    setExcelFile(data);
    const excelFile = await data.arrayBuffer();
    const workbook = XLSX.readFile(excelFile);

    const initialWorkSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(initialWorkSheet);
    console.log(await filterHeader(jsonData));

    setOpenImport(false);
    setExcelFile();
  };

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (isError) {
    return <TableError />;
  }

  return (
    <Box className="table">
      {/* TABLE HEADER */}

      <Stack direction="row" className="table__header">
        <Box className="table__filter-wrapper">
          <Autocomplete
            className="filter"
            size="small"
            options={dropData}
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
          <form
            onSubmit={handleSubmit(handleSearch)}
            style={{ display: "flex", alignItems: "center" }}
          >
            <InputField
              {...register("search")}
              id="search"
              label="Search"
              autoComplete="off"
              errors={errors}
              className="filter-textfield"
              size="small"
              sx={{ width: "180px" }}
            />
            <Button
              className="filter-button"
              variant="contained"
              startIcon={<SearchIcon />}
              sx={{ marginLeft: "10px" }}
              type="submit"
            >
              Search
            </Button>
          </form>
        </Box>

        <Box className="table__button-wrapper">
          <Tooltip title="Refresh">
            <IconButton sx={{ marginRight: "15px" }} onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Import">
            <IconButton
              sx={{ marginRight: "15px" }}
              onClick={handleToggleImport}
            >
              <PublishIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export">
            <IconButton
              sx={{ marginRight: "15px" }}
              onClick={handleToggleExport}
            >
              <FileDownloadIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            color="customSuccess"
            onClick={() => setDrawer(true)}
            endIcon={<AddIcon />}
          >
            Create
          </Button>
        </Box>
      </Stack>

      {/* TABLE */}

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440, minHeight: "10px" }}>
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
          rowsPerPage={rowsPerPage}
          page={page - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* CREATE & UPDATE DRAWER */}

      <Drawer
        className="main-drawer"
        anchor="right"
        open={drawer}
        onClose={() => setDrawer(false)}
      >
        <UserDrawer open={setDrawer} item={null} />
      </Drawer>

      {/* EXPORT LOADING */}

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={() => setOpen(false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* IMPORT MODAL */}
      <Modal open={openImport}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: 620,
            bgcolor: "white",
            boxShadow: 24,
            borderRadius: 3,
            p: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Typography>{excelFile?.name}</Typography>
            <LoadingButton
              component="label"
              loading={excelFile?.name && excelJson.length <= 0}
            >
              Upload Excel File
              <input
                type="file"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={(e) => handleImport(e.target.files[0])}
                hidden
              />
            </LoadingButton>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default memo(Users);
