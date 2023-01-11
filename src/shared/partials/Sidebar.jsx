import { Box, Button, List, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../style/sidebar/sidebar.scss";
import logo from "../../assets/images/logo-metro.png";

import { closeSidebar } from "../../redux-toolkit/counter/sidebarCounter";
import { navlink } from "../../utility/navlink";
import AccordionSidebar from "../../components/sidebar/AccordionSidebar";
import SingleSidebar from "../../components/sidebar/SingleSidebar";

const Sidebar = () => {
  const isOpen = useSelector((state) => state.sidebar.value);
  const user = useSelector((state) => state.token.userDetails);

  const dispatch = useDispatch();

  const small = useMediaQuery("(max-width: 480px)");

  const filteredNavlink = navlink.map((item) => {
    if (item.name === "Masterlist") {
      return {
        ...item,
        accordion: item.accordion.filter((accordionItem) =>
          user.permission.some((p) => p.label === accordionItem.name)
        ),
      };
    }
    return item;
  });

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
            {filteredNavlink.map((item, index) =>
              item.accordion.length > 0 ? (
                <AccordionSidebar key={index} item={item} />
              ) : (
                <SingleSidebar key={index} item={item} />
              )
            )}
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
