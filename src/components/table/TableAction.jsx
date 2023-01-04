import { Drawer, IconButton, Menu, MenuItem } from "@mui/material";
import React, { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import useDisclosure from "../../hook/useDisclosure";

const TableAction = ({ drawer, handleOpen, drawerDisclosure }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const { isOpen, onClose, onToggle } = drawerDisclosure;

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
            onToggle();
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
        open={isOpen}
        onClose={onClose}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default TableAction;
