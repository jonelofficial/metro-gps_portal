import DashboardIcon from "@mui/icons-material/Dashboard";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import LocalGasStationOutlinedIcon from "@mui/icons-material/LocalGasStationOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import SummarizeIcon from "@mui/icons-material/Summarize";

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
    ],
    path: "/masterlist",
    show: false,
  },
  {
    id: 2,
    name: "Reports",
    icon: SummarizeIcon,
    accordion: [
      {
        name: "Trips SG",
        icon: MapOutlinedIcon,
        path: "/reports/trips",
      },
    ],
    path: "/masterlist",
    show: false,
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
