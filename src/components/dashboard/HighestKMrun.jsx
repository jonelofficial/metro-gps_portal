import { Box, Stack } from "@mui/material";
import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useGetHighestKmQuery } from "../../api/metroApi";

import SearchField from "../table/SearchField";
import TableUI from "../table/TableUI";
import TableWrapper from "../table/TableWrapper";
import TableHighestKmrun from "./table/TableHighestKmrun";

const HighestKMrun = () => {
  const [state, setState] = useState({
    page: 1,
    limit: 10,
    search: "",
    searchBy: null,
  });

  const { data, isLoading, isError, isFetching } = useGetHighestKmQuery({
    page: state.page,
    limit: state.limit,
    search: state.search,
    searchBy: state.searchBy,
  });

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
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
              <SearchField
                onSubmit={handleSubmit(handleSearch)}
                control={control}
                errors={errors}
                register={register}
                options={[
                  { id: "_id", label: "Id" },
                  { id: "km", label: "KM" },
                  { id: "plate_no", label: "Plate #" },
                  { id: "driver", label: "Driver" },
                  { id: "locations", label: "Locations" },
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
            { id: "km", label: "KM" },
            { id: "plate_no", label: "Plate #" },
            { id: "driver", label: "Driver" },
            { id: "locations", label: "Locations" },
          ]}
          rows={data.data.map((item, i) => (
            <TableHighestKmrun
              key={i}
              item={item}
              columns={[
                { id: "_id", label: "Id" },
                { id: "km", label: "KM" },
                { id: "plate_no", label: "Plate #" },
                { id: "driver", label: "Driver" },
                { id: "locations", label: "Locations" },
              ]}
            />
          ))}
          sx={{ maxHeight: "300px" }}
        />
      </TableWrapper>
    </>
  );
};

export default HighestKMrun;
