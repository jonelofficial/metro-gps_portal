import { Box } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { useGetTVDTdeparmentQuery } from "../../api/metroApi";
import TableUI from "../table/TableUI";
import TableWrapper from "../table/TableWrapper";
import TableHighestKmRun from "./table/TableHighestKmRun";

const TVDTdeparment = () => {
  const { page, limit, search, searchBy } = useSelector(
    (state) => state.features.table
  );

  const { data, isLoading, isError, isFetching } = useGetTVDTdeparmentQuery({
    page: page,
    limit: limit,
    search: search,
    searchBy: searchBy,
  });

  if (isLoading) {
    return <Box>isLoading</Box>;
  }

  if (isError) {
    return <Box>isError</Box>;
  }

  return (
    <>
      <TableWrapper sx={{ width: "100%" }}>
        <TableUI
          isFetching={isFetching}
          data={data}
          columns={[
            { id: "department", label: "Department" },
            { id: "vehiclesCount", label: "Vehicles" },
            { id: "driversCount", label: "Drivers" },
          ]}
          rows={data.data.map((item, i) => (
            <TableHighestKmRun
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
        />
      </TableWrapper>
    </>
  );
};

export default TVDTdeparment;
