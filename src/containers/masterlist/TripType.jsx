import React from "react";
import useRefresh from "../../hook/useRefresh";
import useDisclosure from "../../hook/useDisclosure";
import useExcel from "../../hook/useExcel";
import useToast from "../../hook/useToast";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetAllTripTypeQuery,
  useImportTripTypeMutation,
} from "../../api/metroApi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { searchNoDateSchema } from "../../utility/schema";
import { useEffect } from "react";
import {
  setSearch,
  setSearchBy,
} from "../../redux-toolkit/counter/featuresCounter";
import TableSkeleton from "../../components/skeleton/TableSkeleton";
import TableWrapper from "../../components/table/TableWrapper";
import { Stack } from "@mui/material";
import SearchField from "../../components/table/SearchField";
import { columns, dropData } from "../../utility/table-columns/TripType";
import {
  onToggle as onToggleCreate,
  setDrawerState,
} from "../../redux-toolkit/counter/drawerDisclosure";
import ButtonField from "../../components/table/ButtonField";
import TableUI from "../../components/table/TableUI";
import TableTripType from "../../components/masterlist/trip-type/TableTripType";
import TripTypeDrawer from "../../components/masterlist/trip-type/TripTypeDrawer";
import ExportModal from "../../components/features/ExportModal";
import ImportModal from "../../components/features/ImportModal";
import TableError from "../../components/error/TableError";

const TripType = () => {
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
  const dispatch = useDispatch();

  // RTK
  const { page, limit, search, saerchBy } = useSelector(
    (state) => state.features.table
  );

  const dipatch = useDispatch();

  // RTK QUERY
  const { data, isLoading, isError, isFetching } = useGetAllTripTypeQuery(
    { page, limit, search, saerchBy },
    { refetchOnMountOrArgChange: true }
  );
  const [importTripType, { isLoading: isImporting }] =
    useImportTripTypeMutation();

  // REACT HOOK FORM
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    control,
  } = useForm({
    defaultValues: {
      search_by: { id: "type", label: "Type" },
    },
    resolver: yupResolver(searchNoDateSchema),
    mode: "onChange",
  });

  useEffect(() => {
    return () => {
      refresh();
    };
  }, []);

  // FUNCTION
  const handleSearch = (data) => {
    dipatch(setSearch(data.search));
    dipatch(setSearchBy(data.search_by?.id || null));
  };

  const handleToggleExport = async () => {
    onToggleExport();

    const newObj = await data?.data?.map((item) => {
      return {
        Type: item?.type,
        "Trip Category": item?.trip_category,
        "Trip Template": item?.trip_template,
      };
    });

    await excelExport(newObj, "METRO-TRIP-TYPE-MASTERLIST");

    onCloseExport();
  };
  const handleImport = async (data) => {
    const filteredData = await excelImport(data);

    if ("type" in filteredData[0]) {
      const res = await importTripType(filteredData);
      res?.error &&
        toast({ severity: "error", message: "Error importing trip type" });
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
            <TableTripType key={i} item={item} columns={columns} />
          ))}
        />

        {/* CREATE DRAWER */}
        <TripTypeDrawer />

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

export default TripType;
