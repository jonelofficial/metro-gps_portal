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
        <Box className="dashboard__column-one">
          <Typography className="dashboard__column-label">
            Daily Service Vehicle Kilometer Run
          </Typography>
          {vehicleData && tripData && (
            <DailyTravelDuration
              vehicleData={vehicleData}
              tripData={tripData}
            />
          )}
        </Box>
        <Box className="dashboard__column-two">
          <Typography className="dashboard__column-label">
            Daily Service Vehicle Travel Duration
          </Typography>
          {vehicleData && tripData && (
            <DailyTravelDuration
              vehicleData={vehicleData}
              tripData={tripData}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
