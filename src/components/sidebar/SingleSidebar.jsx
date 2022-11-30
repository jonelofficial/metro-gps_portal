import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SvgIcon,
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const SingleSidebar = ({ item }) => {
  const isOpen = useSelector((state) => state.sidebar.value);
  const user = useSelector((state) => state.token.userDetails);
  if (!item.show && user?.role !== "admin") {
    return null;
  }
  return (
    <NavLink to={item.path}>
      <ListItemButton className="nav__button">
        <ListItemIcon className="nav__icon">
          <SvgIcon component={item.icon} />
        </ListItemIcon>
        <ListItemText primary={item.name} sx={{ display: !isOpen && "none" }} />{" "}
      </ListItemButton>
    </NavLink>
  );
};

export default SingleSidebar;
