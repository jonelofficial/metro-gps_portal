import { IconButton, Menu, MenuItem } from "@mui/material";
import React, { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Fragment } from "react";
import { useDispatch } from "react-redux";
import {
  onToggle,
  setDrawerState,
} from "../../redux-toolkit/counter/drawerDisclosure";

const TableAction = ({ item }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const dispatch = useDispatch();

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Fragment key={item?._id}>
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
        <MenuItem
          onClick={() => {
            dispatch(onToggle());
            dispatch(setDrawerState(item));
            setAnchorEl(null);
          }}
          sx={{ color: "custom.warning" }}
        >
          Edit
        </MenuItem>
      </Menu>
    </Fragment>
  );
};

export default TableAction;
