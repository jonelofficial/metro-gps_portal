import { Box } from "@mui/material";
import { Stack } from "@mui/system";
import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useGetLongestDurationQuery } from "../../api/metroApi";
import SearchField from "../table/SearchField";
import TableUI from "../table/TableUI";
import TableWrapper from "../table/TableWrapper";
import TableLongestDuration from "./table/TableLongestDuration";

const LongestTravelDuration = () => {
  const [state, setState] = useState({
    page: 1,
    limit: 10,
    search: "",
    searchBy: null,
  });
  const { data, isLoading, isError, isFetching } = useGetLongestDurationQuery({
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
        id: "_id",
        label: "Id",
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
              {" "}
              <SearchField
                onSubmit={handleSubmit(handleSearch)}
                control={control}
                errors={errors}
                register={register}
                options={[
                  { id: "_id", label: "Id" },
                  { id: "plate_no", label: "Plate #" },
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
            { id: "_id", label: "Id" },
            { id: "duration", label: "Duration" },
            { id: "plate_no", label: "Plate #" },
            { id: "departure", label: "Departure" },
            { id: "arrival", label: "Arrival" },
          ]}
          rows={data.data.map((item, i) => (
            <TableLongestDuration
              key={i}
              item={item}
              columns={[
                { id: "_id", label: "Id" },
                { id: "duration", label: "Duration" },
                { id: "plate_no", label: "Plate #" },
                { id: "departure", label: "Departure" },
                { id: "arrival", label: "Arrival" },
              ]}
            />
          ))}
          sx={{ maxHeight: "300px" }}
        />
      </TableWrapper>
    </>
  );
};

export default LongestTravelDuration;
