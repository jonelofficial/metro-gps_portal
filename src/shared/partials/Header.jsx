import {
  Avatar,
  Box,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import useAuth from "../../auth/useAuth";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Logout from "@mui/icons-material/Logout";
import "../../style/header/header.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  closeSidebar,
  openSidebar,
} from "../../redux-toolkit/counter/sidebarCounter";

const Header = () => {
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const isOpen = useSelector((state) => state.sidebar.value);
  const user = useSelector((state) => state.token.userDetails);
  const profile = `${process.env.BASEURL}/${user?.profile}`;

  const dispatch = useDispatch();

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSidebar = () => {
    isOpen ? dispatch(closeSidebar()) : dispatch(openSidebar());
  };

  return (
    <>
      <Box component="header" className="header">
        <Box>
          <IconButton onClick={handleSidebar}>
            {isOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              color: "custom.dark",
              textTransform: "capitalize",
              fontWeight: "bold",
            }}
          >
            Hello {user?.first_name}
          </Typography>
          <IconButton
            onClick={handleClick}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar
              alt="Profile"
              src={user?.profile && profile}
              sx={{ width: 45, height: 45 }}
            />
          </IconButton>
        </Box>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 23,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={logout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default Header;
