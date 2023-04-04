import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import React, { useState } from "react";
import TripDepotHauling from "./TripDepotHauling";

const TripDepot = () => {
  const [value, setValue] = useState("1");

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
              value="1"
              sx={{ fontWeight: "600", fontSize: "15px" }}
            />
            <Tab
              label="Delivery"
              value="2"
              sx={{ fontWeight: "600", fontSize: "15px" }}
            />
          </TabList>
        </Box>
        <TabPanel value="1">
          <TripDepotHauling />
        </TabPanel>
        <TabPanel value="2">Item Two</TabPanel>
      </TabContext>
    </Box>
  );
};

export default TripDepot;
