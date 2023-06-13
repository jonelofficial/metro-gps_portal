import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetAllDeliveryQuery } from "../../../api/metroApi";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import { useEffect } from "react";
import useDisclosure from "../../../hook/useDisclosure";
import {
  setSearch,
  setSearchBy,
} from "../../../redux-toolkit/counter/featuresCounter";
import TableSkeleton from "../../../components/skeleton/TableSkeleton";
import TableError from "../../../components/error/TableError";
import { Box, IconButton, Stack, Tooltip } from "@mui/material";
import TableWrapper from "../../../components/table/TableWrapper";
import SearchField from "../../../components/table/SearchField";
import {
  columns,
  dropData,
} from "../../../utility/table-columns/TripDeliveryColumns";
import RefreshIcon from "@mui/icons-material/Refresh";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ExportModal from "../../../components/features/ExportModal";
import TableUI from "../../../components/table/TableUI";
import TableDelivery from "../../../components/masterlist/depot/TableDelivery";
import { getPathLength } from "geolib";
import useExcel from "../../../hook/useExcel";

const TripDepotDelivery = () => {
  // STATE
  const [date, setDate] = useState();
  const [obj, setObj] = useState([]);

  const { page, limit, search, searchBy } = useSelector(
    (state) => state.features.table
  );

  // RTK QUERY

  const { data, isLoading, isError, isFetching } = useGetAllDeliveryQuery(
    { page, limit, search, searchBy },
    { refetchOnMountOrArgChange: true }
  );

  const { excelExport } = useExcel();

  // REACT HOOK FORM
  const {
    register,
    control,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm({
    defaultValues: {
      search_by: {
        id: "_id",
        label: "Id",
      },
      date: dayjs(),
    },
    resolver: null,
    mode: "onChange",
  });

  //   COMPUTE ALL DURATION
  useEffect(() => {
    let users = {};

    data?.data.forEach((trip, i) => {
      const newLocations = trip?.locations.filter(
        (location) => location.status == "left" || location.status == "arrived"
      );

      let user = trip.user_id.id;

      if (!users[user]) {
        users[user] = {
          totalDuration: 0,
          user_id: user,
          department: trip?.user_id?.department,
          name: trip?.user_id?.first_name,
          employee_id: trip?.user_id?.employee_id,
        };
      }

      const startDate = dayjs(newLocations[0].date);
      const endDate = dayjs(newLocations[newLocations.length - 1].date);
      const duration = endDate.diff(startDate);
      users[user].totalDuration += duration;
    });

    setObj(Object.values(users));

    return () => {
      null;
    };
  }, [data?.data]);

  //   HOOKS
  const dispatch = useDispatch();
  const {
    isOpen: isOpenExport,
    onClose: onCloseExport,
    onToggle: onToggleExport,
  } = useDisclosure();

  const handleSearch = (data) => {
    setDate(dayjs(data.date).format("YYYY-MM-DD"));
    dispatch(setSearch(data.search));
    dispatch(setSearchBy(data.search_by?.id || null));
  };

  const handleToggleExport = async () => {
    onToggleExport();

    const newObj = await data?.data?.map((item) => {
      const newLocations = item?.locations?.filter(
        (location) => location.status == "left" || location.status == "arrived"
      );

      const destination = item?.locations?.map((loc, i) => {
        if (loc.status == "left") {
          return `Left → ${loc?.address[0]?.name || "(No Name)"}  ${
            loc?.address[0]?.district || "(No District)"
          } ${loc?.address[0]?.city || "(No City)"}  ${
            loc?.address[0]?.subregion || "(No Subregion)"
          } | `;
        } else if (loc.status == "arrived") {
          return `Arrived → ${loc?.address[0]?.name || "(No Name)"}  ${
            loc?.address[0]?.district || "(No District)"
          } ${loc?.address[0]?.city || "(No City)"}  ${
            loc?.address[0]?.subregion || "(No Subregion)"
          } | `;
        } else {
          return `Interval → ${loc?.address[0]?.name || "(No Name)"}  ${
            loc?.address[0]?.district || "(No District)"
          } ${loc?.address[0]?.city || "(No City)"}  ${
            loc?.address[0]?.subregion || "(No Subregion)"
          } | `;
        }
      });

      const cratesTransaction = item?.crates_transaction?.map((crates) => {
        return `Crates Dropped: ${crates.crates_dropped} | Crates Collected: ${crates.crates_collected} | Crates Borrowed: ${crates.crates_borrowed} `;
      });

      const gas = item?.diesels?.map((diesel, i) => {
        return `Gas Station: ${diesel?.gas_station_name} Odometer: ${diesel?.odometer} Liter: ${diesel?.liter} Amount: ${diesel?.amount}`;
      });

      const companion = item?.companion?.map((com, i) => {
        return `${Object.values(com)[0]}`;
      });

      const startDate = dayjs(newLocations.at(0).date);
      const endDate = dayjs(newLocations.at(-1).date);
      const duration = endDate.diff(startDate);
      const totalMinutes = Math.floor(duration / (1000 * 60));
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      const totalKm = item?.odometer_done - item?.odometer;
      const estimatedTotalKm = getPathLength(item.points) / 1000;

      return {
        "Trip Date": dayjs(item?.trip_date).format("MMM-DD-YYYY h:mm a"),
        "Sync Date": dayjs(item?.createdAt).format("MMM-DD-YYYY h:mm a"),
        Id: item._id.slice(20),
        User: `${item?.user_id?.first_name} ${item?.user_id?.last_name}`,
        Department: item?.user_id.department,
        Vehicle: item?.vehicle_id?.plate_no,
        Duration: `${
          hours > 0 && hours != 1
            ? hours + " hours"
            : hours == 1
            ? hours + " hour"
            : ""
        } ${minutes > 0 ? minutes + " minutes" : ""}${
          hours <= 0 && minutes <= 0 ? "0" : ""
        }`,
        Start: dayjs(startDate).format("MMM-DD-YY hh:mm a"),
        End: dayjs(endDate).format("MMM-DD-YY hh:mm a"),
        Locations: destination.join("\n"),
        Crates: cratesTransaction.join("\n"),
        Diesels: gas.join("\n"),
        "Estimated Total KM": Math.round(estimatedTotalKm),
        "Total KM": Math.round(totalKm),
        Destination: item?.destination,
        Odometer: item?.odometer,
        "Odometer Done": item?.odometer_done,
        Companion: companion.join("\n"),
        Others: item?.others !== "null" ? item?.others : "",
        Charging: item?.charging,
      };
    });

    const dailyDuration = obj.map((item) => {
      const totalMinutes = Math.floor(item.totalDuration / (1000 * 60));
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return {
        "Employee Id": item.employee_id,
        Name: item.name,
        Department: item?.department,
        "Total Duration": `${
          hours > 0 && hours != 1
            ? hours + " hours"
            : hours == 1
            ? hours + " hour"
            : ""
        } ${minutes > 0 ? minutes + " minutes" : ""}${
          hours <= 0 && minutes <= 0 ? "0" : ""
        }`,
      };
    });

    await excelExport(newObj, "METRO-DELIVERY-REPORT");
    await excelExport(dailyDuration, "METRO-DELIVERY-USER-DURATION-REPORT");

    onCloseExport();
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

        {/* TABLE */}
        <TableUI
          isFetching={isFetching}
          data={data}
          columns={columns}
          rows={data.data.map((item, i) => {
            return <TableDelivery key={i} item={item} columns={columns} />;
          })}
        />

        {/* EXPORT LOADING */}
        <ExportModal isOpenExport={isOpenExport} />
      </TableWrapper>
    </Box>
  );
};

export default TripDepotDelivery;
