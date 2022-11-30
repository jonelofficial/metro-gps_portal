import React from "react";
import { useSelector } from "react-redux";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import Dashboard from "../containers/Dashboard";
import Login from "../containers/Login";
import NotFound from "../containers/NotFound";
import RootLayout from "../shared/layouts/RootLayout";

const Routing = () => {
  const token = useSelector((state) => state.token.value);
  // console.log("T O K E N : ", token);

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
