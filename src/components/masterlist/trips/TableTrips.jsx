import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Collapse,
  IconButton,
  Modal,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import dayjs from "dayjs";
import { getPathLength } from "geolib";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteTripMutation } from "../../../api/metroApi";
import useDisclosure from "../../../hook/useDisclosure";
import useToast from "../../../hook/useToast";
import { theme } from "../../../theme";
import ImageViewer from "../../table/ImageViewer";
import TableAction from "../../table/TableAction";
import TripDrawer from "./TripDrawer";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useState } from "react";

const TableTrips = ({ item, columns }) => {
  // const [duration, setDuration] = useState(0);
  // REACT ROUTER DOM
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
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

  // COMPUTE DURATION
  const newLocations = item.locations.filter(
    (location) => location.status == "left" || location.status == "arrived"
  );

  const startDate = dayjs(newLocations[0]?.date);
  const endDate = dayjs(newLocations[newLocations.length - 1]?.date);
  const duration = endDate.diff(startDate);
  const totalMinutes = Math.floor(duration / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const hour = `${hours.toFixed(0)}.${minutes == 0 ? "00" : minutes}`;

  const leftTime = 480 - totalMinutes;
  const leftHours = Math.floor(leftTime / 60);
  const leftMinutes = leftTime % 60;
  const leftHour = `${leftHours.toFixed(0)}.${
    leftMinutes == 0 ? "00" : leftMinutes
  }`;

  //COMPUTE ESTIMATED ODO
  const totalKm = item?.odometer_done - item?.odometer;
  const estimatedTotalKm = getPathLength(item.points) / 1000;
  const km = item.points?.length > 0 && getPathLength(item.points) / 1000;
  const odo = item?.odometer;
  const estimatedOdo = odo + km;

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

  const tripLocations = [...item?.locations].sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  return (
    <>
      <StyledTableRow
        hover
        role="checkbox"
        tabIndex={-1}
        sx={{ "& > *": { borderBottom: "unset" } }}
      >
        {columns.map((column) => {
          const value = item[column.id];
          if (column.id === "icon") {
            return (
              <TableCell
                key={column.id}
                size="small"
                style={{ whiteSpace: "nowrap" }}
                align="center"
              >
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => setOpen(!open)}
                >
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </TableCell>
            );
          }
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
                      <Box
                        sx={{
                          minWidth: "90px",
                          color:
                            loc.status === "left"
                              ? theme.palette.custom.danger
                              : loc.status === "arrived"
                              ? theme.palette.custom.success
                              : theme.palette.customBlue.main,
                        }}
                      >{`${loc.status
                        .toLowerCase()
                        .replace(/\b\w/g, (l) => l.toUpperCase())} →`}</Box>
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
                      >{`Gas Station: ${loc?.gas_station_name} `}</Box>
                      <Box
                        sx={{ minWidth: "100px" }}
                      >{`Odometer: ${loc?.odometer} `}</Box>
                      <Box
                        sx={{ minWidth: "60px" }}
                      >{`Liter: ${loc?.liter} `}</Box>
                      <Box>{`Amount: ${loc?.amount} `}</Box>
                    </Stack>
                  );
                })
              ) : column.id === "companion" ? (
                value.map((el, i) => {
                  return (
                    <Stack direction="row" gap={1} key={i}>
                      <Box>{el?.firstName || el?.first_name}</Box>
                    </Stack>
                  );
                })
              ) : column.id === "points" ? null : column.id === "createdAt" ? (
                value !== null && dayjs(value).format("MMM-DD-YYYY  h:mm a")
              ) : column.id === "trip_date" ? (
                value !== null && dayjs(value).format("MMM-DD-YYYY h:mm a")
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
                <Button
                  variant="outlined"
                  sx={{ textTransform: "none" }}
                  onClick={() => navigate(`/map/${item._id}`)}
                >
                  {`${value.slice(20)}`}
                </Button>
              ) : column.id === "duration" ? (
                <Stack flexDirection="row">
                  {`${hours > 0 ? hours + " hours " : ""} 
                ${minutes > 0 ? minutes + " minutes " : ""}`}
                  {hours <= 0 && minutes <= 0 && "0"}
                  {/* <Box>
                    {hours == 0 ? `${minutes}` : `${hour}`}
                    &nbsp;
                  </Box>
                  <Box>
                    {hours >= 2 ? "hours." : hours == 0 ? "" : "hour."}
                    {minutes > 1 ? "minutes" : minutes == 0 ? "" : "minute"}
                  </Box> */}
                </Stack>
              ) : column.id === "start" ? (
                dayjs(startDate).format("MMM-DD-YY hh:mm:ss a")
              ) : column.id === "end" ? (
                dayjs(endDate).format("MMM-DD-YY hh:mm:ss a")
              ) : column.id === "left_time" ? (
                <Stack flexDirection="row">
                  <Box>
                    {leftHours == 0 ? `${leftMinutes}` : `${leftHour}`}
                    &nbsp;
                  </Box>
                  <Box>
                    {leftHours >= 2 ? "hours." : leftHours == 0 ? "" : "hour."}
                    {leftMinutes > 1
                      ? "minutes"
                      : leftMinutes == 0
                      ? ""
                      : "minute"}
                  </Box>
                </Stack>
              ) : column.id === "department" ? (
                <Box>
                  {item?.user_id?.department?.label ||
                    item?.user_id?.department}
                </Box>
              ) : column.id === "estimated_odo" ? (
                <Box>{estimatedOdo}</Box>
              ) : column.id === "estimated_total_km" ? (
                <Box>{estimatedTotalKm}</Box>
              ) : column.id === "total_km" ? (
                <Box>{totalKm}</Box>
              ) : (
                value
              )}
            </TableCell>
          );
        })}
      </StyledTableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Locations
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tripLocations?.map((loc, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell
                          sx={{
                            minWidth: "90px",
                            color:
                              loc.status === "left"
                                ? theme.palette.custom.danger
                                : loc.status === "arrived"
                                ? theme.palette.custom.success
                                : theme.palette.customBlue.main,
                          }}
                        >
                          {`${loc.status
                            .toLowerCase()
                            .replace(/\b\w/g, (l) => l.toUpperCase())}`}
                        </TableCell>

                        <TableCell>
                          {`${loc?.address[0]?.name || "(No Name)"}  ${
                            loc?.address[0]?.district || "(No District)"
                          } ${loc?.address[0]?.city || "(No City)"}  ${
                            loc?.address[0]?.subregion || "(No Subregion)"
                          }`}
                        </TableCell>

                        <TableCell>
                          {dayjs(loc?.date).format("MMM-DD-YY h:mm a")}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <Modal open={isOpen || isOpenAction} onClose={onClose}>
        <Box className="table__modal">
          {isOpen ? (
            <ImageViewer
              alt="Odometer Image"
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
