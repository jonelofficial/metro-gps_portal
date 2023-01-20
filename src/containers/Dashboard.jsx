import React, { useEffect, useState } from "react";
import {
  useGetAllGasStationsQuery,
  useGetAllTripsQuery,
  useGetAllUsersQuery,
  useGetAllVehiclesQuery,
} from "../api/metroApi";
import { Box, Typography } from "@mui/material";
import "../style/dashboard/dashboard.scss";
import DailyTravelDuration from "../components/dashboard/DailyTravelDuration";
import DailyTravelKilometerRun from "../components/dashboard/DailyTravelKilometerRun";
import TVDTdeparment from "../components/dashboard/TVDTdeparment";
import HighestKMrun from "../components/dashboard/HighestKMrun";
import LongestTravelDuration from "../components/dashboard/LongestTravelDuration";
import TotalTripDriver from "../components/dashboard/TotalTripDriver";

const Dashboard = () => {
  const [drivers, setDrivers] = useState();
  const {
    data: tripData,
    isLoading: tripIsLoading,
    isError: tripIsError,
  } = useGetAllTripsQuery({ search: "", searchBy: "" });
  const {
    data: userData,
    isLoading: userIsLoading,
    isError: userIsError,
  } = useGetAllUsersQuery({ search: "", searchBy: "", limit: 0, page: 0 });
  const {
    data: vehicleData,
    isLoading: vehicleIsLoading,
    isError: vehicleIsError,
  } = useGetAllVehiclesQuery({ search: "", searchBy: "", limit: 0, page: 0 });
  const {
    data: gasStationData,
    isLoading: gasStationIsLoading,
    isError: gasStationIsError,
  } = useGetAllGasStationsQuery({
    search: "",
    searchBy: "",
    limit: 0,
    page: 0,
  });

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
    return <Box>isLoading</Box>;
  }

  if (tripIsError || userIsError || vehicleIsError || gasStationIsError) {
    return <Box>isError</Box>;
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

      <Box className="dashboard__column">
        {/* 1st COLUMN */}
        <Box className="dashboard__column-wrapper">
          <Typography className="dashboard__column-label">
            Daily Service Vehicle Kilometer Run
          </Typography>
          {tripData && <DailyTravelKilometerRun tripData={tripData} />}
        </Box>

        {/* 2nd COLUMN */}
        <Box className="dashboard__column-wrapper">
          <Typography className="dashboard__column-label">
            Daily Service Vehicle Travel Duration
          </Typography>
          {tripData && <DailyTravelDuration tripData={tripData} />}
        </Box>

        {/* 3rd COLUMN */}
        <Box className="dashboard__column-wrapper">
          <Typography className="dashboard__column-label">
            Highest KM Run
          </Typography>
          <HighestKMrun />
        </Box>

        {/* 4th COLUMN */}
        <Box className="dashboard__column-wrapper">
          <Typography className="dashboard__column-label">
            Total Vehicles , Drivers & Trips per Department
          </Typography>
          <TVDTdeparment userData={userData} vehicleData={vehicleData} />
        </Box>

        {/* 5th COLUMN */}
        <Box className="dashboard__column-wrapper">
          <Typography className="dashboard__column-label">
            Longest Travel Duration
          </Typography>
          <LongestTravelDuration />
        </Box>

        {/* 6th COLUMN */}
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
