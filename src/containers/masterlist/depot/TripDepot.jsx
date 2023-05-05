import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import React, { useState } from "react";
import TripDepotHauling from "./TripDepotHauling";
import { useParams, useLocation } from "react-router-dom";

const TripDepot = () => {
  const { state } = useLocation();

  const [value, setValue] = useState("hauling");

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange}>
            <Tab
              label="Hauling"
              value="hauling"
              sx={{ fontWeight: "600", fontSize: "15px" }}
            />
            <Tab
              label="Delivery"
              value="delivery"
              sx={{ fontWeight: "600", fontSize: "15px" }}
            />
          </TabList>
        </Box>
        <TabPanel value="hauling">
          <TripDepotHauling />
        </TabPanel>
        <TabPanel value="delivery"></TabPanel>
      </TabContext>
    </Box>
  );
};

export default TripDepot;
