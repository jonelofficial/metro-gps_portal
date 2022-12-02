import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SvgIcon,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { closeSidebar } from "../../redux-toolkit/counter/sidebarCounter";

const SingleSidebar = ({ item }) => {
  const isOpen = useSelector((state) => state.sidebar.value);
  const user = useSelector((state) => state.token.userDetails);
  const small = useMediaQuery("(max-width: 480px)");
  const dispatch = useDispatch();

  if (!item.show && user?.role !== "admin") {
    return null;
  }

  const handleClose = () => {
    small && dispatch(closeSidebar());
  };

  return (
    <NavLink to={item.path} onClick={handleClose}>
      <ListItemButton className="nav__button">
        {isOpen ? (
          <ListItemIcon className="nav__icon">
            <SvgIcon component={item.icon} />
          </ListItemIcon>
        ) : (
          <Tooltip title={item.name}>
            <ListItemIcon className="nav__icon">
              <SvgIcon component={item.icon} />
            </ListItemIcon>
          </Tooltip>
        )}
        <ListItemText primary={item.name} sx={{ display: !isOpen && "none" }} />{" "}
      </ListItemButton>
    </NavLink>
  );
};

export default SingleSidebar;
