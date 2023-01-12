import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import Dashboard from "../containers/Dashboard";
import Login from "../containers/Login";
import Map from "../containers/Map";
import NotFound from "../containers/NotFound";
import UserTrip from "../containers/UserTrip";
import Users from "../containers/masterlist/Users";
import Vehicles from "../containers/masterlist/Vehicles";
import GasStations from "../containers/masterlist/GasStations";
import Trips from "../containers/masterlist/Trips";
import RootLayout from "../shared/layouts/RootLayout";

const Routing = () => {
  const token = useSelector((state) => state.token.value);
  const user = useSelector((state) => state.token.userDetails);

  const [validUser, setValideUser] = useState();

  useEffect(() => {
    setValideUser(user?.role === "admin");
  }, [user]);

  const AuthenticatedRoutes = () => {
    return token ? <RootLayout /> : <Navigate to="/login" />;
  };

  const ValidateLogin = () => {
    return token ? <Navigate to="/" /> : <Login />;
  };

  const router = createBrowserRouter([
    {
      path: "*",
      element: <NotFound />,
    },
    {
      path: "/",
      element: <AuthenticatedRoutes />,
      children: [
        {
          path: "/",
          element: <Dashboard />,
        },

        {
          path: "/masterlist/users",
          element:
            validUser && user.permission?.some((el) => el?.id === "users") ? (
              <Users />
            ) : (
              <NotFound />
            ),
        },
        {
          path: "/masterlist/vehicles",
          element:
            validUser &&
            user.permission?.some((el) => el?.id === "vehicles") ? (
              <Vehicles />
            ) : (
              <NotFound />
            ),
        },
        {
          path: "/masterlist/gas-stations",
          element:
            validUser &&
            user.permission?.some((el) => el?.id === "gas_stations") ? (
              <GasStations />
            ) : (
              <NotFound />
            ),
        },
        {
          path: "/masterlist/trips",
          element:
            validUser &&
            user.permission?.some((el) => el?.id === "trips_sg") ? (
              <Trips />
            ) : (
              <NotFound />
            ),
        },

        {
          path: "/user-trip",
          element: <UserTrip />,
        },
        {
          path: "/map/:id",
          element: <Map />,
        },
        {
          path: "/map",
          element: <Map />,
        },
      ],
    },
    {
      path: "/login",
      element: <ValidateLogin />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Routing;
