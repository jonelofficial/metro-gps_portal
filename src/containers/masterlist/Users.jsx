import { Drawer, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  useGetAllUsersQuery,
  useImportUsersMutation,
} from "../../api/metroApi";
import TableSkeleton from "../../components/skeleton/TableSkeleton";
import TableError from "../../components/error/TableError";
import { memo } from "react";
import { useForm } from "react-hook-form";
import TableWrapper from "../../components/table/TableWrapper";
import SearchField from "../../components/table/SearchField";
import ButtonField from "../../components/table/ButtonField";
import UserDrawer from "../../components/masterlist/users/UserDrawer";
import dayjs from "dayjs";
import useExcel from "../../hook/useExcel";
import { useDispatch, useSelector } from "react-redux";
import {
  setSearch,
  setSearchBy,
} from "../../redux-toolkit/counter/featuresCounter";
import ImportModal from "../../components/features/ImportModal";
import ExportModal from "../../components/features/ExportModal";
import TableUI from "../../components/table/TableUI";
import { columns, dropData } from "../../utility/table-columns/userColumns";
import useRefresh from "../../hook/useRefresh";
import useDisclosure from "../../hook/useDisclosure";
import TableUsers from "../../components/masterlist/users/TableUsers";
import { yupResolver } from "@hookform/resolvers/yup";
import { searchSchema } from "../../utility/schema";
import "../../style/outlet/users/users.scss";
import useToast from "../../hook/useToast";

const Users = () => {
  const [date, setDate] = useState();
  // RTK
  const { page, limit, search, searchBy } = useSelector(
    (state) => state.features.table
  );
  const dispatch = useDispatch();

  // HOOKS
  const { excelExport, excelImport } = useExcel();
  const { refresh } = useRefresh();
  const { toast } = useToast();
  const { isOpen, onClose, onToggle } = useDisclosure();
  const {
    isOpen: isOpenExport,
    onClose: onCloseExport,
    onToggle: onToggleExport,
  } = useDisclosure();
  const {
    isOpen: isOpenImport,
    onClose: onCloseImport,
    onToggle: onToggleImport,
  } = useDisclosure();

  // RTK QUERY
  const { data, isLoading, isError, isFetching } = useGetAllUsersQuery(
    {
      page: page,
      limit: limit,
      search: search,
      searchBy: searchBy,
      date: date,
    },
    { refetchOnMountOrArgChange: true }
  );
  const [importUsers, { isLoading: isImporting }] = useImportUsersMutation();

  //  REACT HOOK FORM
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    control,
    watch,
  } = useForm({
    defaultValues: {
      search_by: {
        id: "employee_id",
        label: "Employee Id",
      },
      date: dayjs(),
    },
    resolver: yupResolver(searchSchema),
    mode: "onChange",
  });

  useEffect(() => {
    refresh();

    return () => {
      null;
    };
  }, []);

  // FUNCTION
  const handleSearch = async (data) => {
    setDate(dayjs(data.date).format("YYYY-MM-DD"));
    dispatch(setSearch(data.search));
    dispatch(setSearchBy(data.search_by?.id || null));
  };

  const handleToggleExport = async () => {
    onToggleExport();
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

    await excelExport(newObj, "METRO-USER-MASTERLIST");
    onCloseExport();
  };

  const handleImport = async (data) => {
    const filteredData = await excelImport(data);

    if ("username" in filteredData[0]) {
      const res = await importUsers(filteredData);
      res?.error &&
        toast({
          severity: "error",
          message: "Error importing user",
        });
    } else {
      toast({
        severity: "error",
        message:
          "Missing fields. Please make sure your importing the correct file",
      });
    }

    onCloseImport();
  };

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (isError) {
    return <TableError />;
  }

  return (
    <>
      <TableWrapper>
        {/* TABLE HEADER */}

        <Stack direction="row" className="table__header">
          {data && (
            <>
              <SearchField
                onSubmit={handleSubmit(handleSearch)}
                control={control}
                errors={errors}
                register={register}
                options={dropData}
                watch={watch}
              />

              <ButtonField
                handleRefresh={() => refresh(reset)}
                handleToggleExport={handleToggleExport}
                handleToggleImport={onToggleImport}
                handleCreate={onToggle}
              />
            </>
          )}
        </Stack>

        {/* TABLE */}
        <TableUI
          isFetching={isFetching}
          data={data}
          columns={columns}
          rows={data.data.map((item, i) => {
            return <TableUsers key={i} item={item} columns={columns} />;
          })}
        />

        {/* CREATE DRAWER */}
        <Drawer
          className="main-drawer"
          anchor="right"
          open={isOpen}
          onClose={onClose}
        >
          <UserDrawer onClose={onClose} />
        </Drawer>

        {/* EXPORT LOADING */}
        <ExportModal isOpenExport={isOpenExport} />

        {/* IMPORT MODAL */}
        <ImportModal
          isOpenImport={isOpenImport}
          onCloseImport={onCloseImport}
          func={handleImport}
          isImporting={isImporting}
        />
      </TableWrapper>
    </>
  );
};

export default memo(Users);
