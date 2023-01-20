import { Box, Stack } from "@mui/material";
import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useGetTotalTripDriverQuery } from "../../api/metroApi";
import SearchField from "../table/SearchField";
import TableUI from "../table/TableUI";
import TableWrapper from "../table/TableWrapper";
import TableTotalTripDriver from "./table/TableTotalTripDriver";

const TotalTripDriver = () => {
  const [state, setState] = useState({
    page: 1,
    limit: 10,
    search: "",
    searchBy: null,
  });

  const { data, isLoading, isError, isFetching } = useGetTotalTripDriverQuery({
    page: state.page,
    limit: state.limit,
    search: state.search,
    searchBy: state.searchBy,
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      search_by: {
        id: "employee_id",
        label: "Employee Id",
      },
    },
  });

  const handleSearch = (data) => {
    setState((prevState) => ({
      ...prevState,
      search: data.search,
      searchBy: data.search_by?.id || null,
    }));
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
                  { id: "employee_id", label: "Employee Id" },
                  { id: "driver", label: "Driver" },
                  { id: "trip", label: "Trip" },
                  { id: "department.label", label: "Department" },
                ]}
              />
            </>
          )}
        </Stack>
        <TableUI
          state={state}
          setState={setState}
          isFetching={isFetching}
          data={data}
          columns={[
            { id: "employee_id", label: "Employee Id" },
            { id: "driver", label: "Driver" },
            { id: "trip", label: "Trip" },
            { id: "department", label: "Department" },
          ]}
          rows={data.data.map((item, i) => (
            <TableTotalTripDriver
              key={i}
              item={item}
              columns={[
                { id: "employee_id", label: "Employee Id" },
                { id: "driver", label: "Driver" },
                { id: "trip", label: "Trip" },
                { id: "department", label: "Department" },
              ]}
            />
          ))}
          sx={{ maxHeight: "300px" }}
        />
      </TableWrapper>
    </>
  );
};

export default TotalTripDriver;
