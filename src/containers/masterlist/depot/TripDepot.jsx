import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import React, { useState } from "react";
import TripDepotHauling from "./TripDepotHauling";
import { useParams, useLocation } from "react-router-dom";
import TripDepotDelivery from "./TripDepotDelivery";

const TripDepot = () => {
  const { state } = useLocation();

  const [value, setValue] = useState(state || "hauling");

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
        <TabPanel value="hauling" sx={{ height: "100%" }}>
          <TripDepotHauling />
        </TabPanel>
        <TabPanel value="delivery" sx={{ height: "100%" }}>
          <TripDepotDelivery />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default TripDepot;
