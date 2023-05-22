import React, { useEffect } from "react";
import useRefresh from "../../hook/useRefresh";
import useDisclosure from "../../hook/useDisclosure";
import useExcel from "../../hook/useExcel";
import useToast from "../../hook/useToast";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetAllTripTemplateQuery,
  useImportTripTemplateMutation,
} from "../../api/metroApi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { searchNoDateSchema } from "../../utility/schema";
import {
  setSearch,
  setSearchBy,
} from "../../redux-toolkit/counter/featuresCounter";
import TableSkeleton from "../../components/skeleton/TableSkeleton";
import TableError from "../../components/error/TableError";
import TableWrapper from "../../components/table/TableWrapper";
import { Stack } from "@mui/material";
import SearchField from "../../components/table/SearchField";
import { columns, dropData } from "../../utility/table-columns/TripTemplate";
import ButtonField from "../../components/table/ButtonField";
import {
  onToggle as onToggleCreate,
  setDrawerState,
} from "../../redux-toolkit/counter/drawerDisclosure";
import TableUI from "../../components/table/TableUI";
import TableTripTemplate from "../../components/masterlist/trip-template/TableTripTemplate";
import ExportModal from "../../components/features/ExportModal";
import ImportModal from "../../components/features/ImportModal";
import TripTemplateDrawer from "../../components/masterlist/trip-template/TripTemplateDrawer";

const TripTemplate = () => {
  // HOOKS
  const { refresh } = useRefresh();
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
  const { data, isLoading, isError, isFetching } = useGetAllTripTemplateQuery(
    { page, limit, search, searchBy },
    { refetchOnMountOrArgChange: true }
  );

  const [importTripTemplate, { isLoading: isImporting }] =
    useImportTripTemplateMutation();

  // REACT HOOK FORM
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    control,
  } = useForm({
    defaultValues: {
      search_by: { id: "template", label: "Template" },
    },
    resolver: yupResolver(searchNoDateSchema),
  });

  useEffect(() => {
    return () => {
      refresh();
    };
  }, []);

  const handleSearch = (data) => {
    dispatch(setSearch(data.search));
    dispatch(setSearchBy(data.search_by?.id || null));
  };

  const handleToggleExport = async () => {
    onToggleExport();

    const newObj = await data?.data?.map((item) => {
      return { Template: item?.template };
    });

    await excelExport(newObj, "METRO-TRIP-TEMPLATE-MASTERLIST");

    onCloseExport();
  };

  const handleImport = async () => {
    const filteredData = await excelImport(data);

    if ("template" in filteredData[0]) {
      const res = await importTripCategory(filteredData);
      res?.error &&
        toast({ severity: "error", message: "Error importing trip template" });
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
        <Stack direction="row" className="table__header">
          {data && (
            <>
              <SearchField
                onSubmit={handleSubmit(handleSearch)}
                control={control}
                errors={errors}
                register={register}
                options={dropData}
                isFetching={isFetching}
              />

              <ButtonField
                handleRefresh={() => refresh(reset)}
                handleToggleExport={handleToggleExport}
                handleToggleImport={onToggleImport}
                handleCreate={() => {
                  dispatch(onToggleCreate());
                  dispatch(setDrawerState(null));
                }}
              />
            </>
          )}
        </Stack>

        {/* TABLE */}
        <TableUI
          isFetching={isFetching}
          data={data}
          columns={columns}
          rows={data.data.map((item, i) => (
            <TableTripTemplate key={i} item={item} columns={columns} />
          ))}
        />

        {/* CREATE DRAWER */}
        <TripTemplateDrawer />

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

export default TripTemplate;
