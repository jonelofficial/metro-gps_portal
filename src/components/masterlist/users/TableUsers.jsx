import {
  Button,
  Drawer,
  Modal,
  styled,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { memo, useState } from "react";
import UserAction from "./UserAction";
import UserDrawer from "./UserDrawer";

const TableUsers = ({ item, columns }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },

    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  return (
    <>
      <StyledTableRow
        hover
        role="checkbox"
        tabIndex={-1}
        sx={{ height: "10px" }}
      >
        {columns.map((column) => {
          const value = item[column.id];
          return (
            <TableCell key={column.id} size="small">
              {column.id === "profile" && value != null ? (
                <a href={`${process.env.BASEURL}/${value}`} target="_blank">
                  View
                </a>
              ) : column.id === "profile" &&
                value == null ? null : column.id === "createdAt" ? (
                column.format(value)
              ) : column.id === "action" ? (
                <UserAction item={item} handleOpen={handleOpen} />
              ) : (
                value
              )}
            </TableCell>
          );
        })}
      </StyledTableRow>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 420,
            bgcolor: "white",
            boxShadow: 24,
            borderRadius: 3,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6">
            Are you sure you want to delete this record ?
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {item.first_name}
          </Typography>
          <Box
            sx={{ marginTop: 2, display: "flex", justifyContent: "flex-end" }}
          >
            <Button sx={{ marginRight: 2 }} onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" color="customDanger">
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default memo(TableUsers);
