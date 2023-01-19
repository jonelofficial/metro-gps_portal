import { Box, Stack } from "@mui/material";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useGetTVDTdeparmentQuery } from "../../api/metroApi";
import useRefresh from "../../hook/useRefresh";
import {
  setSearch,
  setSearchBy,
} from "../../redux-toolkit/counter/featuresCounter";
import SearchField from "../table/SearchField";
import TableUI from "../table/TableUI";
import TableWrapper from "../table/TableWrapper";
import TableTVDTdepartment from "./table/TableTVDTdepartment";

const TVDTdeparment = () => {
  const { page, limit, search, searchBy } = useSelector(
    (state) => state.features.table
  );

  const dispatch = useDispatch();
  const { refresh } = useRefresh();

  const { data, isLoading, isError, isFetching } = useGetTVDTdeparmentQuery({
    page: page,
    limit: limit,
    search: search,
    searchBy: searchBy,
  });

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      search_by: {
        id: "department",
        label: "Department",
      },
    },
  });

  useEffect(() => {
    refresh();

    return () => {
      null;
    };
  }, []);

  const handleSearch = (data) => {
    dispatch(setSearch(data.search));
    dispatch(setSearchBy(data.search_by?.id || null));
  };

  if (isLoading) {
    return <Box>isLoading</Box>;
  }

  if (isError) {
    return <Box>isError</Box>;
  }

  return (
    <>
      <TableWrapper sx={{ width: "100%" }}>
        <Stack direction="row" className="table__header">
          {data && (
            <>
              <SearchField
                onSubmit={handleSubmit(handleSearch)}
                control={control}
                errors={errors}
                register={register}
                options={[
                  { id: "department", label: "Department" },
                  { id: "vehiclesCount", label: "Vehicles" },
                  { id: "driversCount", label: "Drivers" },
                ]}
              />
            </>
          )}
        </Stack>
        <TableUI
          isFetching={isFetching}
          data={data}
          columns={[
            { id: "department", label: "Department" },
            { id: "vehiclesCount", label: "Vehicles" },
            { id: "driversCount", label: "Drivers" },
          ]}
          rows={data.data.map((item, i) => (
            <TableTVDTdepartment
              key={i}
              item={item}
              columns={[
                { id: "department", label: "Department" },
                { id: "vehiclesCount", label: "Vehicles" },
                { id: "driversCount", label: "Drivers" },
              ]}
            />
          ))}
          //   rows={null}
          sx={{ maxHeight: "300px" }}
        />
      </TableWrapper>
    </>
  );
};

export default TVDTdeparment;
