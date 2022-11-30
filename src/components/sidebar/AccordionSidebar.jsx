import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SvgIcon,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const AccordionSidebar = ({ item }) => {
  const isOpen = useSelector((state) => state.sidebar.value);
  const user = useSelector((state) => state.token.userDetails);

  useEffect(() => {
    !isOpen && setOpen(false);
  }, [isOpen]);

  const [open, setOpen] = useState(false);

  const handleClick = () => {
    isOpen ? setOpen(!open) : dispatch(openSidebar());
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
            <NavLink to={accordion.path} key={index}>
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
