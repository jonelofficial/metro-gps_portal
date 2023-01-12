import DashboardIcon from "@mui/icons-material/Dashboard";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import LocalGasStationOutlinedIcon from "@mui/icons-material/LocalGasStationOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import LocalActivityOutlinedIcon from "@mui/icons-material/LocalActivityOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { permission } from "./permission";

// const filteredAcc = accordion.filter((accordionItem) => {
//   return permission.find((dataItem) => {
//     return dataItem.id === accordionItem.name.toLowerCase().replace(/ /g, "_");
//   });
// });

export const navlink = [
  {
    id: 1,
    name: "Dashboard",
    icon: DashboardIcon,
    accordion: [],
    path: "/",
    show: true,
  },
  {
    id: 2,
    name: "Masterlist",
    icon: ContentCopyIcon,
    accordion: [
      {
        name: "Users",
        icon: PersonOutlineOutlinedIcon,
        path: "/masterlist/users",
      },
      {
        name: "Vehicles",
        icon: DirectionsCarOutlinedIcon,
        path: "/masterlist/vehicles",
      },
      {
        name: "Gas Stations",
        icon: LocalGasStationOutlinedIcon,
        path: "/masterlist/gas-stations",
      },
      {
        name: "Trips SG",
        icon: MapOutlinedIcon,
        path: "/masterlist/trips",
      },
    ],
    path: "/masterlist",
    show: false,
  },
  // {
  //   id: 3,
  //   name: "Trip",
  //   icon: LocalActivityOutlinedIcon,
  //   accordion: [],
  //   path: "/user-trip",
  //   show: true,
  // },
  {
    id: 4,
    name: "Map",
    icon: PlaceOutlinedIcon,
    accordion: [],
    path: "/map",
    show: true,
  },
];
