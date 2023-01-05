import { yupResolver } from "@hookform/resolvers/yup";
import { Drawer } from "@mui/material";
import { Stack } from "@mui/system";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetAllGasStationsQuery,
  useImportGasStationsMutation,
} from "../../api/metroApi";
import TableError from "../../components/error/TableError";
import ExportModal from "../../components/features/ExportModal";
import ImportModal from "../../components/features/ImportModal";
import GasStationsDrawer from "../../components/masterlist/gas-stations/GasStationsDrawer";
import TableGasStation from "../../components/masterlist/gas-stations/TableGasStation";
import TableSkeleton from "../../components/skeleton/TableSkeleton";
import ButtonField from "../../components/table/ButtonField";
import SearchField from "../../components/table/SearchField";
import TableUI from "../../components/table/TableUI";
import TableWrapper from "../../components/table/TableWrapper";
import useDisclosure from "../../hook/useDisclosure";
import useExcel from "../../hook/useExcel";
import useRefresh from "../../hook/useRefresh";
import useToast from "../../hook/useToast";
import {
  setSearch,
  setSearchBy,
} from "../../redux-toolkit/counter/featuresCounter";
import { searchSchema } from "../../utility/schema";
import {
  columns,
  dropData,
} from "../../utility/table-columns/gasStationColumns";

const GasStations = () => {
  // HOOKS
  const { refresh } = useRefresh();
  const { isOpen, onClose, onToggle } = useDisclosure();
  const {
    isOpen: isOpenImport,
    onClose: onCloseImport,
    onToggle: onToggleImport,
  } = useDisclosure();
  const {
    isOpen: isOpenExport,
    onClose: onCloseExport,
    onToggle: onToggleExport,
  } = useDisclosure();

  const { excelExport, excelImport } = useExcel();
  const { toast } = useToast();

  // RTK
  const { page, limit, search, searchBy } = useSelector(
    (state) => state.features.table
  );

  const dispatch = useDispatch();

  // RTK QUERY
  const { data, isLoading, isError, isFetching } = useGetAllGasStationsQuery(
    {
      page: page,
      limit: limit,
      search: search,
      searchBy: searchBy,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [importGasStations, { isLoading: isImporting }] =
    useImportGasStationsMutation();

  // REACT HOOK FORM
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    control,
  } = useForm({
    defaultValues: {
      search_by: { id: "label", label: "Label" },
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

  const handleSearch = (data) => {
    dispatch(setSearch(data.search));
    dispatch(setSearchBy(data.search_by?.id || null));
  };

  const handleToggleExport = async () => {
    onToggleExport();
    let newObj = [];

    await data.data.map((item) => {
      newObj.push({
        label: item.label,
      });
    });

    await excelExport(newObj, "METRO-GAS-STATION-MASTERLIST");

    onCloseExport();
  };

  const handleImport = async (data) => {
    const filteredData = await excelImport(data);

    if ("label" in filteredData[0]) {
      const res = await importGasStations(filteredData);
      res?.error &&
        toast({ severity: "error", message: "Error importing gas station" });
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
            return <TableGasStation key={i} item={item} columns={columns} />;
          })}
        />

        {/* CREATE DRAWER */}
        <Drawer
          className="main-drawer"
          anchor="right"
          open={isOpen}
          onClose={onClose}
        >
          <GasStationsDrawer onClose={onClose} />
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

export default GasStations;
