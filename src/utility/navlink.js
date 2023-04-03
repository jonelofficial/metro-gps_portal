import {
  DashboardOutlined,
  ContentCopyOutlined,
  PersonOutlineOutlined,
  DirectionsCarOutlined,
  LocalGasStationOutlined,
  MapOutlined,
  SummarizeOutlined,
  FactoryOutlined,
  AgricultureOutlined,
} from "@mui/icons-material";

export const navlink = [
  {
    id: 1,
    name: "Dashboard",
    icon: DashboardOutlined,
    accordion: [],
    path: "/",
    show: true,
  },
  {
    id: 2,
    name: "Masterlist",
    icon: ContentCopyOutlined,
    accordion: [
      {
        name: "Users",
        icon: PersonOutlineOutlined,
        path: "/masterlist/users",
      },
      {
        name: "Vehicles",
        icon: DirectionsCarOutlined,
        path: "/masterlist/vehicles",
      },
      {
        name: "Gas Stations",
        icon: LocalGasStationOutlined,
        path: "/masterlist/gas-stations",
      },
    ],
    path: "/masterlist",
    show: false,
  },
  {
    id: 2,
    name: "Reports",
    icon: MapOutlined,
    accordion: [
      {
        name: "Trips SG",
        icon: SummarizeOutlined,
        path: "/reports/trips-sg",
      },
      {
        name: "Trips Depot",
        icon: FactoryOutlined,
        path: "/reports/trips-depot",
      },
      {
        name: "Trips Live",
        icon: AgricultureOutlined,
        path: "/reports/trips-live",
      },
    ],
    path: "/reports",
    show: false,
  },
];
