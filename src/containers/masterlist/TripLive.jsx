import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useExcel from "../../hook/useExcel";
import { useGetAllLiveQuery } from "../../api/metroApi";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import { yupResolver } from "@hookform/resolvers/yup";
import { searchSchema } from "../../utility/schema";
import {
  setSearch,
  setSearchBy,
} from "../../redux-toolkit/counter/featuresCounter";
import TableSkeleton from "../../components/skeleton/TableSkeleton";
import TableError from "../../components/error/TableError";
import TableWrapper from "../../components/table/TableWrapper";
import { Box, IconButton, Stack, Tooltip } from "@mui/material";
import SearchField from "../../components/table/SearchField";
import { columns, dropData } from "../../utility/table-columns/TripLive";
import { FileDownload, Refresh } from "@mui/icons-material";
import useDisclosure from "../../hook/useDisclosure";
import TableLive from "../../components/masterlist/live/TableLive";
import TableUI from "../../components/table/TableUI";
import ExportModal from "../../components/features/ExportModal";
import { getPathLength } from "geolib";
import LiveDrawer from "../../components/masterlist/live/LiveDrawer";

const TripLive = () => {
  // STATE
  const [date, setDate] = useState();
  const [obj, setObj] = useState([]);

  //   RTK
  const { page, limit, search, searchBy } = useSelector(
    (state) => state.features.table
  );
  const dispatch = useDispatch();

  const { data, isLoading, isError, isFetching } = useGetAllLiveQuery(
    { page, limit, search, searchBy, date },
    { refetchOnMountOrArgChange: true }
  );

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
    resolver: yupResolver(searchSchema),
    mode: "onChange",
  });

  //   COMPUTE ALL DURATION
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

  //   HOOKS
  const {
    isOpen: isOpenExport,
    onClose: onCloseExport,
    onToggle: onToggleExport,
  } = useDisclosure();
  const { excelExport } = useExcel();

  const handleSearch = (data) => {
    setDate(dayjs(data.date).format("YYYY-MM-DD"));
    dispatch(setSearch(data.search));
    dispatch(setSearchBy(data.search_by?.id || null));
  };

  const handleToggleExport = async () => {
    onToggleExport();

    let newReports = [];

    await data?.data?.map((item) => {
      const newLocations = item?.locations
        ?.filter(
          (location) =>
            location.status == "left" || location.status == "arrived"
        )
        .sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        });

      let counter = 1;

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

      const totalKm = item?.odometer_done - item?.odometer;
      const estimatedTotalKm = getPathLength(item.points) / 1000;

      newLocations.map((location, i) => {
        if (i % 2 == 0) {
          newReports.push({
            "Trip Date": dayjs(item?.trip_date).format("MMM-DD-YYYY h:mm a"),
            "Sync Date": dayjs(item?.createdAt).format("MMM-DD-YYYY  h:mm a"),
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
            "Estimated Total KM": Math.round(estimatedTotalKm),
            "Total KM": Math.round(totalKm),
            Odmeter: item?.odometer,
            "Odmeter Done": item?.odometer_done,
            Companion: companion.join("\n"),
            Others: item?.others !== "null" ? item?.others : "",
            Charging: item?.charging,
            Diesels: gas.join("\n"),
            "Total Bags": item?.total_bags,
            "Total Bags Delivered": item?.total_bags_delivered,
            Origin:
              i === 0
                ? "Depot"
                : newLocations[i - 1]?.destination ||
                  `${location?.address[0]?.name || "(No Name)"}  ${
                    location?.address[0]?.district || "(No District)"
                  } ${location?.address[0]?.city || "(No City)"}  ${
                    location?.address[0]?.subregion || "(No Subregion)"
                  }`,
            Destination:
              newLocations.length - 1 === i + 1
                ? "Depot"
                : newLocations[i + 1]?.destination ||
                  `${newLocations[i + 1].address[0]?.name || "(No Name)"}  ${
                    newLocations[i + 1].address[0]?.district || "(No District)"
                  } ${newLocations[i + 1].address[0]?.city || "(No City)"}  ${
                    newLocations[i + 1].address[0]?.subregion ||
                    "(No Subregion)"
                  }`,
          });
        }
      });
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

    await excelExport(newReports, "METRO-LIVE-REPORT");
    await excelExport(dailyDuration, "METRO-LIVE-USER-DURATION-REPORT");

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
                <Refresh />
              </IconButton>
            </Tooltip>

            <Tooltip title="Export">
              <IconButton
                sx={{ marginRight: "15px" }}
                onClick={handleToggleExport}
              >
                <FileDownload />
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
            return <TableLive key={i} item={item} columns={columns} />;
          })}
        />

        {/* EXPORT LOADING */}
        <ExportModal isOpenExport={isOpenExport} />

        {/* DRAWER */}
        <LiveDrawer />
      </TableWrapper>
    </>
  );
};

export default TripLive;
