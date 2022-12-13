import {
  Button,
  Modal,
  styled,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import dayjs from "dayjs";
import React, { memo, useState } from "react";
import UserAction from "./UserAction";

const TableUsers = ({ item, columns }) => {
  const [open, setOpen] = useState(false);
  const [showImg, setShowImg] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setShowImg(false);
  };

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
                // <a href={`${process.env.BASEURL}/${value}`} target="_blank">
                <Button
                  onClick={() => {
                    setOpen(true);
                    setShowImg(true);
                  }}
                >
                  View
                </Button>
              ) : column.id === "profile" &&
                value == null ? null : column.id === "createdAt" ? (
                dayjs(value).format("MMM-DD-YYYY")
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
            maxWidth: 620,
            bgcolor: "white",
            boxShadow: 24,
            borderRadius: 3,
            p: 4,
          }}
        >
          {open && showImg ? (
            <>
              <Box
                component="img"
                sx={{
                  height: "auto",
                  maxWidth: 620,
                  display: "block",
                  margin: "0 auto",
                }}
                alt="Profile"
                src={`${process.env.BASEURL}/${item.profile}`}
              />
              <Button
                sx={{ marginRight: 2, float: "right", marginTop: "20px" }}
                onClick={handleClose}
              >
                Cancel
              </Button>
            </>
          ) : (
            open &&
            !showImg && (
              <>
                <Typography id="modal-modal-title" variant="h6">
                  {` Are you sure you want to delete " ${item.first_name} " record ?`}
                </Typography>
                <Box
                  sx={{
                    marginTop: 2,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    sx={{ marginRight: 2 }}
                    onClick={handleClose}
                    color="customDanger"
                  >
                    Cancel
                  </Button>
                  <Button variant="contained" color="customDanger">
                    Delete
                  </Button>
                </Box>
              </>
            )
          )}
        </Box>
      </Modal>
    </>
  );
};

export default memo(TableUsers);
