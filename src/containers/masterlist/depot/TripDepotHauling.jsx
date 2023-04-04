import React, { useState } from "react";
import TableWrapper from "../../../components/table/TableWrapper";
import { Box, IconButton, Stack, Tooltip } from "@mui/material";
import SearchField from "../../../components/table/SearchField";
import { useForm } from "react-hook-form";
import RefreshIcon from "@mui/icons-material/Refresh";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {
  setSearch,
  setSearchBy,
} from "../../../redux-toolkit/counter/featuresCounter";
import { useDispatch, useSelector } from "react-redux";
import {
  columns,
  dropData,
} from "../../../utility/table-columns/TripDepotColumns";
import dayjs from "dayjs";
import useExcel from "../../../hook/useExcel";
import useDisclosure from "../../../hook/useDisclosure";
import ExportModal from "../../../components/features/ExportModal";
import { useGetAllTripsHaulingQuery } from "../../../api/metroApi";
import TableSkeleton from "../../../components/skeleton/TableSkeleton";
import TableError from "../../../components/error/TableError";
import TableUI from "../../../components/table/TableUI";
import TableHauling from "../../../components/masterlist/depot/TableHauling";

const TripDepot = () => {
  // STATE
  const [date, setDate] = useState();

  const { page, limit, search, searchBy } = useSelector(
    (state) => state.features.table
  );

  // RTK QUERY
  const { data, isLoading, isError, isFetching } = useGetAllTripsHaulingQuery(
    {
      page: page,
      limit: limit,
      search: search,
      searchBy: searchBy,
      date: date,
    },
    { refetchOnMountOrArgChange: true }
  );

  console.log(data);

  // REACT HOOK FORM
  const {
    register,
    control,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm();

  //   HOOKS
  const dispatch = useDispatch();

  const { excelExport } = useExcel();
  const {
    isOpen: isOpenExport,
    onClose: onCloseExport,
    onToggle: onToggleExport,
  } = useDisclosure();

  const handleSearch = (data) => {
    setDate(dayjs(date.date).format("YYYY-MM-DD"));
    dispatch(setSearch(data.search));
    dispatch(setSearchBy(date.search_by?.id || null));
  };

  const handleToggleExport = async () => {
    onToggleExport();

    setTimeout(() => {
      onCloseExport();
    }, 1000);
  };

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (isError) {
    return <TableError />;
  }
  return (
    <Box>
      <TableWrapper sx={{ margin: "0 auto" }}>
        <Stack direction="row" className="table__header">
          <SearchField
            onSubmit={handleSubmit(handleSearch)}
            control={control}
            errors={errors}
            register={register}
            options={dropData}
            watch={watch}
            isFetching={null}
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

        {/* TABLE  */}
        <TableUI
          isFetching={isFetching}
          data={data}
          columns={columns}
          rows={data.data.map((item, i) => {
            return <TableHauling key={i} item={item} columns={columns} />;
          })}
        />

        <ExportModal isOpenExport={isOpenExport} />
      </TableWrapper>
    </Box>
  );
};

export default TripDepot;
