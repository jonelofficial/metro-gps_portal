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
import { dropData } from "../../../utility/table-columns/TripDepotColumns";
import dayjs from "dayjs";
import useExcel from "../../../hook/useExcel";
import useDisclosure from "../../../hook/useDisclosure";
import ExportModal from "../../../components/features/ExportModal";

const TripDepot = () => {
  // STATE
  const [date, setDate] = useState();

  //   RTK
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

  const { page, limit, search, searchBy } = useSelector(
    (state) => state.features.table
  );
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

        <ExportModal isOpenExport={isOpenExport} />
      </TableWrapper>
    </>
  );
};

export default TripDepot;
