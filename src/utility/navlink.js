import DashboardIcon from "@mui/icons-material/Dashboard";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import LocalGasStationOutlinedIcon from "@mui/icons-material/LocalGasStationOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import LocalActivityOutlinedIcon from "@mui/icons-material/LocalActivityOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";

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
        name: "User",
        icon: PersonOutlineOutlinedIcon,
        path: "/master-list/user",
      },
      {
        name: "Vehicles",
        icon: DirectionsCarOutlinedIcon,
        path: "/master-list/vehicles",
      },
      {
        name: "Gas Station",
        icon: LocalGasStationOutlinedIcon,
        path: "/master-list/gas-station",
      },
      {
        name: "Trip",
        icon: MapOutlinedIcon,
        path: "/master-list/trip",
      },
    ],
    path: "/master-list",
    show: false,
  },
  {
    id: 3,
    name: "Trip",
    icon: LocalActivityOutlinedIcon,
    accordion: [],
    path: "/trip",
    show: true,
  },
  {
    id: 4,
    name: "Map",
    icon: PlaceOutlinedIcon,
    accordion: [],
    path: "/map",
    show: true,
  },
];
