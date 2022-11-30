import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SvgIcon,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import {
  closeSidebar,
  openSidebar,
} from "../../redux-toolkit/counter/sidebarCounter";

const AccordionSidebar = ({ item }) => {
  const isOpen = useSelector((state) => state.sidebar.value);
  const user = useSelector((state) => state.token.userDetails);
  const small = useMediaQuery("(max-width: 480px)");
  const dispatch = useDispatch();

  useEffect(() => {
    !isOpen && setOpen(false);
  }, [isOpen]);

  const [open, setOpen] = useState(false);

  const handleClick = () => {
    isOpen ? setOpen(!open) : dispatch(openSidebar());
  };

  const handleClose = () => {
    small && dispatch(closeSidebar());
  };

  if (!item.show && user?.role !== "admin") {
    return null;
  }
  return (
    <>
      <ListItemButton onClick={handleClick} className="nav__button">
        <ListItemIcon className="nav__icon">
          <SvgIcon component={item.icon} />
        </ListItemIcon>
        <ListItemText primary={item.name} sx={{ display: !isOpen && "none" }} />
        {open && isOpen ? <ExpandLess /> : !open && isOpen && <ExpandMore />}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" className="dropdown-list" disablePadding>
          {item.accordion.map((accordion, index) => (
            <NavLink to={accordion.path} key={index} onClick={handleClose}>
              <ListItemButton className="dropdown-list__button">
                <ListItemIcon className="nav__icon">
                  <SvgIcon component={accordion.icon} />
                </ListItemIcon>
                <ListItemText primary={accordion.name} />
              </ListItemButton>
            </NavLink>
          ))}
        </List>
      </Collapse>
    </>
  );
};

export default AccordionSidebar;
