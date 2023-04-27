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
import dayjs from "dayjs";
import { useState } from "react";
import {
  setSearch,
  setSearchBy,
} from "../../redux-toolkit/counter/featuresCounter";
import { yupResolver } from "@hookform/resolvers/yup";
import { searchSchema } from "../../utility/schema";
import { getPathLength } from "geolib";

const Trips = () => {
  // STATE
  const [date, setDate] = useState();
  const [obj, setObj] = useState([]);
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
  const { data, isLoading, isError, isFetching } = useGetAllTripsQuery(
    {
      page: page,
      limit: limit,
      search: search,
      searchBy: searchBy,
      date: date,
    },
    { refetchOnMountOrArgChange: true }
  );

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
    // dispatch(setSearch(""));
    // dispatch(setSearchBy("_id"));

    return () => {
      refresh();
    };
  }, []);

  // FUNCTION

  // COMPUTE ALL DURATION
  useEffect(() => {
    let users = {};

    data?.data.forEach((trip, index) => {
      const newLocations = trip?.locations.filter(
        (location) => location.status == "left" || location.status == "arrived"
      );
      let user = trip.user_id._id;
      if (!users[user]) {
        users[user] = {
          totalDuration: 0,
          user_id: user,
          department: trip?.user_id?.department,
          name: trip.user_id.first_name,
          employee_id: trip.user_id.employee_id,
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

  // ENDS

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

      const gas = item?.diesels?.map((diesel, i) => {
        return `Gas Station: ${diesel?.gas_station_name} Odometer: ${diesel?.odometer} Liter: ${diesel?.liter} Amount: ${diesel?.amount}`;
      });

      const companion = item?.companion?.map((com, i) => {
        return `${Object.values(com)[0]}`;
      });

      const startDate = dayjs(newLocations[0].date);
      const endDate = dayjs(newLocations[newLocations.length - 1].date);
      const duration = endDate.diff(startDate);
      const totalMinutes = Math.floor(duration / (1000 * 60));
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const hour = `${hours.toFixed(0)}.${minutes == 0 ? "00" : minutes}`;

      // const km = item.points?.length > 0 && getPathLength(item.points) / 1000;
      // const odo = item?.odometer;
      // const estimatedOdo = odo + km;
      const totalKm = item?.odometer_done - item?.odometer;
      const estimatedTotalKm = getPathLength(item.points) / 1000;

      return {
        "Trip Date": dayjs(item?.trip_date).format("MMM-DD-YYYY h:mm a"),
        "Sync Date": dayjs(item?.createdAt).format("MMM-DD-YYYY  h:mm a"),
        Id: item._id.slice(20),
        User: `${item?.user_id?.first_name} ${item?.user_id?.last_name}`,
        Vehicle: item?.vehicle_id?.plate_no,
        Duration: `${hours > 0 ? hours + " hours" : ""} ${
          minutes > 0 ? minutes + " minutes" : ""
        }${hours <= 0 && minutes <= 0 ? "0" : ""}`,
        Start: dayjs(startDate).format("MMM-DD-YY hh:mm a"),
        End: dayjs(endDate).format("MMM-DD-YY hh:mm a"),
        Locations: destination.join("\n"),
        Diesels: gas.join("\n"),
        "Estimated Total KM": estimatedTotalKm,
        "Total KM": totalKm,
        Odmeter: item?.odometer,
        "Odmeter Done": item?.odometer_done,
        Companion: companion.join("\n"),
        Others: item?.others !== "null" ? item?.others : "",
        Charging: item?.charging,
      };
    });

    const dailyDuration = obj.map((item) => {
      const totalMinutes = Math.floor(item.totalDuration / (1000 * 60));
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const hour = `${hours.toFixed(0)}.${minutes == 0 ? "00" : minutes}`;
      return {
        "Employee Id": item.employee_id,
        Name: item.name,
        Department: item?.department,
        "Total Duration": `${hours > 0 ? hours + " hours" : ""} ${
          minutes > 0 ? minutes + " minutes" : ""
        }${hours <= 0 && minutes <= 0 ? "0" : ""}`,
      };
    });

    await excelExport(newObj, "METRO-TRIP-REPORT");
    await excelExport(dailyDuration, "METRO-USER-DURATION-REPORT");

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
            isFetching={isFetching}
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
