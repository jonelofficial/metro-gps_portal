import React, { memo, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Button, Drawer } from "@mui/material";
import UserDrawer from "./UserDrawer";

const UserAction = ({ item, handleOpen }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawer, setDrawer] = useState(false);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleOpen} sx={{ color: "custom.danger" }}>
          Delete
        </MenuItem>
        <MenuItem
          onClick={() => {
            setDrawer(true);
            setAnchorEl(null);
          }}
          sx={{ color: "custom.warning" }}
        >
          Edit
        </MenuItem>
      </Menu>

      <Drawer
        className="main-drawer"
        anchor="right"
        open={drawer}
        onClose={() => setDrawer(false)}
      >
        <UserDrawer open={setDrawer} item={item} />
      </Drawer>
    </>
  );
};

export default memo(UserAction);
