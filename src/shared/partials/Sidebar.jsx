import {
  Box,
  Button,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SvgIcon,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../style/sidebar/sidebar.scss";
import logo from "../../assets/images/logo-metro.png";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import LocalGasStationOutlinedIcon from "@mui/icons-material/LocalGasStationOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import LocalActivityOutlinedIcon from "@mui/icons-material/LocalActivityOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";

import {
  closeSidebar,
  openSidebar,
} from "../../redux-toolkit/counter/sidebarCounter";
import { navlink } from "../../utility/navlink";

const Sidebar = () => {
  const isOpen = useSelector((state) => state.sidebar.value);
  const dispatch = useDispatch();

  const small = useMediaQuery("(max-width: 480px)");

  useEffect(() => {
    !isOpen && setOpen(false);
  }, [isOpen]);

  const [open, setOpen] = useState(false);

  const handleClick = () => {
    isOpen ? setOpen(!open) : dispatch(openSidebar());
  };

  return (
    <Box
      component="aside"
      className="sidebar-wrapper"
      sx={{
        maxWidth: isOpen ? "250px" : "80px",
        left: isOpen && small ? "0" : "-110%",
      }}
    >
      <Box className="sidebar">
        <Box className="sidebar__image">
          <Box className="image" component="img" alt="Metro GPS" src={logo} />
          <Typography variant="h5" className="sidebar__title">
            Metro GPS
          </Typography>
          {small && (
            <Button
              sx={{
                display: !isOpen ? "none" : "block",
              }}
              onClick={() => dispatch(closeSidebar())}
            >
              close
            </Button>
          )}
        </Box>
        <Box className="sidebar__menu">
          <List component="nav" className="nav">
            {/* {navlink.map((item, index) => {
              return (
                <React.Fragment key={index}>
                  <ListItemButton className="nav__button">
                    <ListItemIcon className="nav__icon">
                      <SvgIcon component={item.icon} />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.name}
                      sx={{
                        display: !isOpen && "none",
                      }}
                    />
                  </ListItemButton>
                </React.Fragment>
              );
            })} */}
            <ListItemButton className="nav__button">
              <ListItemIcon className="nav__icon">
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText
                primary="Dashboard"
                sx={{
                  display: !isOpen && "none",
                }}
              />
            </ListItemButton>
            <ListItemButton onClick={handleClick} className="nav__button">
              <ListItemIcon className="nav__icon">
                <ContentCopyIcon />
              </ListItemIcon>
              <ListItemText
                primary="Masterlist"
                sx={{ display: !isOpen && "none" }}
              />
              {open && isOpen ? (
                <ExpandLess />
              ) : (
                !open && isOpen && <ExpandMore />
              )}
            </ListItemButton>

            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" className="dropdown-list" disablePadding>
                <ListItemButton className="dropdown-list__button">
                  <ListItemIcon className="nav__icon">
                    <PersonOutlineOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="User" />
                </ListItemButton>
                <ListItemButton className="dropdown-list__button">
                  <ListItemIcon className="nav__icon">
                    <DirectionsCarOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Vehicles" />
                </ListItemButton>
                <ListItemButton className="dropdown-list__button">
                  <ListItemIcon className="nav__icon">
                    <LocalGasStationOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Gas Station" />
                </ListItemButton>
                <ListItemButton className="dropdown-list__button">
                  <ListItemIcon className="nav__icon">
                    <MapOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Trip" />
                </ListItemButton>
              </List>
            </Collapse>

            <ListItemButton className="nav__button">
              <ListItemIcon className="nav__icon">
                <LocalActivityOutlinedIcon />
              </ListItemIcon>
              <ListItemText
                primary="Trip"
                sx={{ display: !isOpen && "none" }}
              />
            </ListItemButton>

            <ListItemButton className="nav__button">
              <ListItemIcon className="nav__icon">
                <PlaceOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Map" sx={{ display: !isOpen && "none" }} />
            </ListItemButton>
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
