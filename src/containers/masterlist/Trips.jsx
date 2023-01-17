import { Box, IconButton, Stack, Tooltip } from "@mui/material";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useGetAllTripsQuery } from "../../api/metroApi";
import TableError from "../../components/error/TableError";
import TableSkeleton from "../../components/skeleton/TableSkeleton";
import SearchField from "../../components/table/SearchField";
import TableUI from "../../components/table/TableUI";
import TableWrapper from "../../components/table/TableWrapper";
import { columns, dropData } from "../../utility/table-columns/TripColumns";
import RefreshIcon from "@mui/icons-material/Refresh";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useDispatch, useSelector } from "react-redux";
import useRefresh from "../../hook/useRefresh";
import TableTrips from "../../components/masterlist/trips/TableTrips";
import useExcel from "../../hook/useExcel";
import ExportModal from "../../components/features/ExportModal";
import useDisclosure from "../../hook/useDisclosure";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import { useRef } from "react";
import { useState } from "react";
import {
  setSearch,
  setSearchBy,
} from "../../redux-toolkit/counter/featuresCounter";
import { yupResolver } from "@hookform/resolvers/yup";
import { searchSchema } from "../../utility/schema";

const Trips = () => {
  // STATE
  const [date, setDate] = useState();
  // RTK

  const { page, limit, search, searchBy } = useSelector(
    (state) => state.features.table
  );
  const dispatch = useDispatch();

  // HOOKS
  const { refresh } = useRefresh();
  const { excelExport } = useExcel();
  const { isOpen, onClose, onToggle } = useDisclosure();
  const {
    isOpen: isOpenExport,
    onClose: onCloseExport,
    onToggle: onToggleExport,
  } = useDisclosure();

  // RTK QUERY
  const { data, isLoading, isError, isFetching } = useGetAllTripsQuery({
    page: page,
    limit: limit,
    search: search,
    searchBy: searchBy,
    date: date,
  });

  // REACT HOOK FORM
  const {
    register,
    control,
    formState: { errors },
    reset,
    handleSubmit,
    setValue: setFormValue,
    watch,
  } = useForm({
    defaultValues: {
      search_by: {
        id: "_id",
        label: "Id",
      },
      date: dayjs(),
    },
    resolver: yupResolver(searchSchema),
    mode: "onChanges",
  });

  useEffect(() => {
    // refresh();
    dispatch(setSearch(""));
    dispatch(setSearchBy("_id"));

    return () => {
      null;
    };
  }, []);

  // FUNCTION

  const handleSearch = (data) => {
    setDate(dayjs(data.date).format("YYYY-MM-DD"));
    dispatch(setSearch(data.search));
    dispatch(setSearchBy(data.search_by?.id || null));
  };

  const handleToggleExport = async () => {
    onToggleExport();

    const newObj = await data.data.map((item) => {
      const destination = item.locations.map((loc, i) => {
        if (loc.status == "left") {
          return `Left => ${loc.address[0].city} | `;
        } else if (loc.status == "arrived") {
          return `Arrived => ${loc.address[0].city}`;
        }
      });

      const gas = item.diesels.map((diesel, i) => {
        return `Gas Station: ${diesel.gas_station_name} Odometer: ${diesel.odometer} Liter: ${diesel.liter} Amount: ${diesel.amount}`;
      });

      const companion = item.companion.map((com, i) => {
        return `${Object.values(com)[0]}`;
      });

      return {
        Id: item._id,
        User: `${item.user_id.first_name} ${item.user_id.last_name}`,
        Vehicle: item.vehicle_id.plate_no,
        Locations: destination.join("\n"),
        Diesels: gas.join("\n"),
        Odmeter: item.odometer,
        "Odmeter Done": item.odometer_done,
        Companion: companion.join("\n"),
        Others: item.others !== "null" ? item.others : "",
        "Trip Date": dayjs(item.trip_date).format("MMM-DD-YYYY"),
      };
    });

    await excelExport(newObj, "METRO-USER-MASTERLIST");

    onCloseExport();
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
        <Stack direction="row" className="table__header">
          <SearchField
            onSubmit={handleSubmit(handleSearch)}
            control={control}
            errors={errors}
            register={register}
            options={dropData}
            watch={watch}
          />

          <Box>
            <Tooltip title="Refresh">
              <IconButton
                sx={{ marginRight: "15px" }}
                onClick={() => {
                  dispatch(setSearch(""));
                  dispatch(setSearchBy("_id"));
                  reset();
                }}
              >
                <RefreshIcon />
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
          </Box>
        </Stack>

        {/* TABLE */}
        <TableUI
          isFetching={isFetching}
          data={data}
          columns={columns}
          rows={data.data.map((item, i) => {
            return <TableTrips key={i} item={item} columns={columns} />;
          })}
        />

        {/* EXPORT LOADING */}
        <ExportModal isOpenExport={isOpenExport} />
      </TableWrapper>
    </>
  );
};

export default Trips;
