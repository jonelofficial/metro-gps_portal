import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Modal,
  styled,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import dayjs from "dayjs";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDeleteTripMutation } from "../../../api/metroApi";
import useDisclosure from "../../../hook/useDisclosure";
import useToast from "../../../hook/useToast";
import ImageViewer from "../../table/ImageViewer";
import TableAction from "../../table/TableAction";
import TripDrawer from "./TripDrawer";

const TableTrips = ({ item, columns }) => {
  // REACT ROUTER DOM
  const navigate = useNavigate();

  // RTK QUERY
  const [deleteTrip, { isLoading }] = useDeleteTripMutation();

  //   HOOKS
  const drawerDisclosure = useDisclosure();
  const { isOpen, onClose, onToggle } = useDisclosure();
  const {
    isOpen: isOpenAction,
    onClose: onCloseAction,
    onToggle: onToggleAction,
  } = useDisclosure();

  const { toast } = useToast();

  //   FUNCTION

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
      <StyledTableRow hover role="checkbox" tabIndex={-1}>
        {columns.map((column) => {
          const value = item[column.id];
          return (
            <TableCell
              key={column.id}
              size="small"
              style={{ whiteSpace: "nowrap" }}
            >
              {column.id === "user_id" ? (
                <Tooltip
                  title={`NAME: ${value?.first_name} ${value?.last_name}`}
                >
                  <Box>{value?.employee_id}</Box>
                </Tooltip>
              ) : column.id === "vehicle_id" ? (
                value?.plate_no
              ) : column.id === "locations" ? (
                value.map((loc, i) => {
                  return (
                    <Stack direction="row" gap={1} key={i}>
                      <Box sx={{ minWidth: "90px" }}>{`${loc.status
                        .toLowerCase()
                        .replace(/\b\w/g, (l) => l.toUpperCase())} =>`}</Box>
                      <Box>
                        {loc.address[0]?.city
                          ? `${loc.address[0]?.city}`
                          : "No Address Detected"}
                      </Box>
                      {/* <Box>{`${loc.address[0].subregion} ${loc.address[0].city} ${loc.address[0].street}`}</Box> */}
                    </Stack>
                  );
                })
              ) : column.id === "diesels" ? (
                value.map((loc, i) => {
                  return (
                    <Stack direction="row" gap={1} key={i}>
                      <Box
                        sx={{ minWidth: "140px" }}
                      >{`Gas Station: ${loc.gas_station_name} `}</Box>
                      <Box
                        sx={{ minWidth: "100px" }}
                      >{`Odometer: ${loc.odometer} `}</Box>
                      <Box
                        sx={{ minWidth: "60px" }}
                      >{`Liter: ${loc.liter} `}</Box>
                      <Box>{`Amount: ${loc.amount} `}</Box>
                    </Stack>
                  );
                })
              ) : column.id === "companion" ? (
                value.map((el, i) => {
                  return (
                    <Stack direction="row" gap={1} key={i}>
                      <Box>{el?.firstName}</Box>
                    </Stack>
                  );
                })
              ) : column.id === "points" ? null : column.id === "createdAt" ? (
                value !== null && dayjs(value).format("MMM-DD-YYYY")
              ) : column.id === "trip_date" ? (
                value !== null && dayjs(value).format("MMM-DD-YYYY")
              ) : column.id === "odometer_image_path" && value != null ? (
                <Button onClick={onToggle}>View</Button>
              ) : column.id === "action" ? (
                <TableAction
                  handleOpen={onToggleAction}
                  drawerDisclosure={drawerDisclosure}
                  hideDelete={true}
                  drawer={
                    <TripDrawer
                      onClose={drawerDisclosure.onClose}
                      item={item}
                    />
                  }
                />
              ) : column.id === "others" ? (
                value !== "null" && value
              ) : column.id === "_id" ? (
                <Box
                  sx={{ cursor: "pointer" }}
                  onClick={() => navigate(`/map/${item._id}`)}
                >
                  {value}
                </Box>
              ) : (
                value
              )}
            </TableCell>
          );
        })}
      </StyledTableRow>

      <Modal open={isOpen || isOpenAction} onClose={onClose}>
        <Box className="table__modal">
          {isOpen ? (
            <ImageViewer
              onClose={onClose}
              img={`${process.env.BASEURL}/${item.odometer_image_path}`}
            />
          ) : (
            <>
              <Typography id="modal-modal-title" variant="h6">
                {` Are you sure you want to delete the " ${item._id} " record ? This action cannot be undone.`}
              </Typography>
              <Box
                sx={{
                  marginTop: 2,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                }}
              >
                <Button onClick={onCloseAction} color="customDanger">
                  Cancel
                </Button>
                <LoadingButton
                  onClick={() => {
                    deleteTrip(item._id);
                    onCloseAction();
                    toast({
                      severity: "success",
                      message: `Success deleting user  ${item._id}`,
                    });
                  }}
                  variant="contained"
                  color="customDanger"
                  loading={isLoading}
                >
                  Delete
                </LoadingButton>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default TableTrips;
