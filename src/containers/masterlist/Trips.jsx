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

const Trips = () => {
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
  });

  // REACT HOOK FORM
  const {
    register,
    control,
    formState: { errors },
    reset,
    handleSubmit,
    setValue: setFormValue,
  } = useForm({
    defaultValues: {
      search_by: {
        id: "_id",
        label: "Id",
      },
    },
  });

  useEffect(() => {
    refresh();

    return () => {
      null;
    };
  }, []);

  // FUNCTION

  const handleSearch = () => {};

  const handleToggleExport = async () => {
    onToggleExport();

    const newObj = await data.data.map((item) => {
      const destination = item.locations.map((loc, i) => {
        return `${i % 2 === 0 ? "LEFT =>" : " ARRIVED => "} ${
          loc.address[0].city
        }`;
      });

      return {
        Id: item._id,
        User: `${item.user_id.first_name} ${item.user_id.last_name}`,
        Vehicle: item.vehicle_id.plate_no,
        Locations: destination.join(""),
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
          />

          <Box>
            <Tooltip title="Refresh">
              <IconButton
                sx={{ marginRight: "15px" }}
                onClick={() => refresh(reset)}
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
