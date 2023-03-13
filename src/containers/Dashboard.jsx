import React, { useEffect, useState } from "react";
import {
  useGetAllGasStationsQuery,
  useGetAllTripsQuery,
  useGetAllUsersQuery,
  useGetAllVehiclesQuery,
} from "../api/metroApi";
import { Box, Stack, Typography } from "@mui/material";
import "../style/dashboard/dashboard.scss";
import DailyTravelDuration from "../components/dashboard/DailyTravelDuration";
import DailyTravelKilometerRun from "../components/dashboard/DailyTravelKilometerRun";
import TVDTdeparment from "../components/dashboard/TVDTdeparment";
import HighestKMrun from "../components/dashboard/HighestKMrun";
import LongestTravelDuration from "../components/dashboard/LongestTravelDuration";
import TotalTripDriver from "../components/dashboard/TotalTripDriver";
import Consumption from "../components/dashboard/Consumption";
import DailyUserDuration from "../components/dashboard/DailyUserDuration";
import dashboardLoading from "../assets/images/lottie/bored-hand.json";
import pleaseWait from "../assets/images/lottie/please-wait.json";
import error from "../assets/images/lottie/error.json";
import Lottie from "lottie-react";
import { useForm } from "react-hook-form";
import DateFormPicker from "../components/form/DateFormPicker";
import { LoadingButton } from "@mui/lab";
import SearchIcon from "@mui/icons-material/Search";
import dayjs from "dayjs";
import TableWrapper from "../components/table/TableWrapper";

const Dashboard = () => {
  const [drivers, setDrivers] = useState();
  const [date, setDate] = useState(dayjs(new Date()).format("MMM-DD-YY"));
  const {
    data: tripData,
    isLoading: tripIsLoading,
    isFetching: tripIsFetching,
    isError: tripIsError,
  } = useGetAllTripsQuery(
    { search: "", searchBy: "_id", limit: 0, page: 0 },
    { refetchOnMountOrArgChange: true }
  );
  const {
    data: userData,
    isLoading: userIsLoading,
    isError: userIsError,
  } = useGetAllUsersQuery(
    { search: "", searchBy: "_id", limit: 0, page: 0 },
    { refetchOnMountOrArgChange: true }
  );
  const {
    data: vehicleData,
    isLoading: vehicleIsLoading,
    isError: vehicleIsError,
  } = useGetAllVehiclesQuery(
    {
      search: "",
      searchBy: "_id",
      limit: 0,
      page: 0,
    },
    { refetchOnMountOrArgChange: true }
  );
  const {
    data: gasStationData,
    isLoading: gasStationIsLoading,
    isError: gasStationIsError,
  } = useGetAllGasStationsQuery(
    {
      search: "",
      searchBy: "",
      limit: 0,
      page: 0,
    },
    { refetchOnMountOrArgChange: true }
  );

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm();

  useEffect(() => {
    userData?.data &&
      setDrivers(userData?.data.filter((user) => user.role === "driver"));
    return () => {
      null;
    };
  }, [userData]);

  if (
    tripIsLoading ||
    userIsLoading ||
    vehicleIsLoading ||
    gasStationIsLoading
  ) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",

          position: "relative",
        }}
      >
        <Lottie animationData={dashboardLoading} loop={true} />
        <Box
          sx={{
            position: "absolute",
            top: "45%",
            width: "100%",
          }}
        >
          <Lottie animationData={pleaseWait} loop={true} />
        </Box>
      </Box>
    );
  }

  if (tripIsError || userIsError || vehicleIsError || gasStationIsError) {
    return (
      <Box
        sx={{
          width: "600px",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Lottie animationData={error} loop={false} />
      </Box>
    );
  }
  return (
    <Box className="dashboard">
      <Box className="dashboard__total">
        <Box className="dashboard__total-wrapper">
          <Typography className="dashboard__total-label">
            Total Drivers
          </Typography>
          <Box className="dashboard__total-data">{drivers?.length}</Box>
        </Box>

        <Box className="dashboard__total-wrapper">
          <Typography className="dashboard__total-label">
            Total Vehicles
          </Typography>
          <Box className="dashboard__total-data">
            {vehicleData?.data.length}
          </Box>
        </Box>

        <Box className="dashboard__total-wrapper">
          <Typography className="dashboard__total-label">
            Total Gas Stations
          </Typography>
          <Box className="dashboard__total-data">
            {gasStationData?.data.length}
          </Box>
        </Box>

        <Box className="dashboard__total-wrapper">
          <Typography className="dashboard__total-label">
            Total Trips
          </Typography>
          <Box className="dashboard__total-data">{tripData?.data.length}</Box>
        </Box>
      </Box>
      <TableWrapper sx={{ width: "100%" }}>
        <Stack
          direction="row"
          sx={{ marginBottom: "20px", justifyContent: "flex-end" }}
          className="table__header"
        >
          <form
            onSubmit={handleSubmit((e) => {
              setDate(dayjs(e.date).format("MMM-DD-YY"));
            })}
            className="table__filter-wrapper"
          >
            <DateFormPicker
              views={["month", "year", "day"]}
              name="date"
              control={control}
              label={"Date"}
              errors={errors}
              className="filter-textfield"
            />
            <LoadingButton
              className="filter-button"
              variant="contained"
              startIcon={<SearchIcon />}
              type="submit"
              loading={tripIsFetching || tripIsLoading}
              sx={{ marginLeft: "10px" }}
            >
              Search
            </LoadingButton>
          </form>
        </Stack>
      </TableWrapper>
      <Box className="dashboard__column">
        {/* 1st COLUMN */}
        <Box className="dashboard__column-wrapper">
          <Typography className="dashboard__column-label">
            Daily Service Vehicle Kilometer Run
          </Typography>
          {tripData && (
            <DailyTravelKilometerRun tripData={tripData} date={date} />
          )}
        </Box>

        {/* 2nd COLUMN */}
        <Box className="dashboard__column-wrapper">
          <Typography className="dashboard__column-label">
            Daily Service Vehicle Travel Duration
          </Typography>
          {tripData && <DailyTravelDuration tripData={tripData} date={date} />}
        </Box>

        {/* 3rd COLUMN */}
        <Box className="dashboard__column-wrapper">
          <Typography className="dashboard__column-label">
            Daily Service User Travel Duration
          </Typography>
          {tripData && <DailyUserDuration tripData={tripData} date={date} />}
        </Box>

        {/* 4th COLUMN */}
        <Box className="dashboard__column-wrapper">
          <Typography className="dashboard__column-label">
            Daily Trip Estimated Fuel Consumption
          </Typography>
          {tripData && <Consumption tripData={tripData} date={date} />}
        </Box>

        {/* 5th COLUMN */}
        <Box className="dashboard__column-wrapper">
          <Typography className="dashboard__column-label">
            Highest KM Run
          </Typography>
          <HighestKMrun />
        </Box>

        {/* 6th COLUMN */}
        <Box className="dashboard__column-wrapper">
          <Typography className="dashboard__column-label">
            Total Vehicles , Drivers & Trips per Department
          </Typography>
          <TVDTdeparment userData={userData} vehicleData={vehicleData} />
        </Box>

        {/* 7th COLUMN */}
        <Box className="dashboard__column-wrapper">
          <Typography className="dashboard__column-label">
            Longest Travel Duration
          </Typography>
          <LongestTravelDuration />
        </Box>

        {/* 8th COLUMN */}
        <Box className="dashboard__column-wrapper">
          <Typography className="dashboard__column-label">
            Total Trip per Driver
          </Typography>
          <TotalTripDriver />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
