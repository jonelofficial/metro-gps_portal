import React, { Fragment } from "react";
import GoogleMapReact from "google-map-react";
import { Box, Tooltip, Typography } from "@material-ui/core";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useParams } from "react-router-dom";
import { useGetAllTripsQuery } from "../api/metroApi";
import { useState } from "react";
import InputField from "../components/form/InputField";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import SearchIcon from "@mui/icons-material/Search";
import { Stack } from "@mui/system";
import { ObjectID } from "bson";
import useToast from "../hook/useToast";
import { theme } from "../theme";
import { useEffect } from "react";
import dayjs from "dayjs";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import image from "../assets/images/guide.png";

import "../style/map/map.scss";
import { Divider } from "@mui/material";

const Map = () => {
  let { id } = useParams();
  const [newID, setNewID] = useState();
  // HOOKS
  const { toast } = useToast();

  // RTK QUERY
  const { data, isLoading, isError, isFetching } = useGetAllTripsQuery(
    {
      search: newID,
      searchBy: "_id",
    },
    { refetchOnMountOrArgChange: true }
  );

  // RTK QUERY FORM
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  useEffect(() => {
    id && setNewID(id);
  }, []);

  const onSubmit = (data) => {
    if (ObjectID.isValid(data.id)) {
      setNewID(data.id);
    } else {
      toast({ severity: "error", message: "Not valid Trip ID" });
    }
  };

  if (isLoading || isFetching) {
    return <Box>Loading</Box>;
  }

  if (isError) {
    return <Box>Error</Box>;
  }

  const Marker = ({ item, queue }) => (
    <Tooltip
      title={
        <>
          <Box
            sx={{ textTransform: "capitalize" }}
          >{`${item.status}: ${queue}`}</Box>
          {item.address[0]?.city} {item.address[0]?.subregion}
          <br />
          Date: {dayjs(item.date).format("MMM-DD-YY hh:mm a")}
        </>
      }
    >
      <LocationOnIcon
        sx={{
          fontSize: 40,
          color:
            item.status === "left"
              ? "custom.danger"
              : item.status === "arrived"
              ? "custom.success"
              : "customBlue.main",
        }}
      />
    </Tooltip>
  );

  const DieselMarker = ({ item, queue }) => (
    <Tooltip
      title={
        <>
          Diesel: {queue}
          <br />
          Gas Station: {item.gas_station_name}
          <br />
          Odometer: {item.odometer}
          <br />
          Liter: {item.liter}
          <br />
          Amount: {item.amount}
          <br />
        </>
      }
    >
      <LocationOnIcon
        sx={{
          fontSize: 40,
          color: "primary.main",
        }}
      />
    </Tooltip>
  );

  // // FIT MAP FROM COORDINATES
  // const bounds = new window.google.maps.LatLngBounds();
  // data.data[0]?.locations.forEach((marker) => {
  //   bounds.extend({ lat: marker.lat, lng: marker.lng });
  // });
  return (
    <Stack className="map" flexDirection={{ xs: "column", lg: "row" }}>
      {!id ? (
        <Box
          component="img"
          sx={{
            height: "auto",
            width: "100%",
            maxWidth: 1200,
            display: "block",
            margin: "0 auto",
          }}
          alt="Map Guide"
          src={image}
        />
      ) : (
        <>
          <Stack className="map__first">
            {/* <Box className="map__first__search-wrapper">
        <Box className="map__first__search-wrapper--label">
          Input complete Trip ID:
        </Box>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="map__first__search-wrapper--form"
        >
          <InputField
            {...register("id")}
            id="id"
            label="ID"
            errors={errors}
            sx={{ marginBottom: "unset" }}
          />
          <LoadingButton
            variant="contained"
            type="submit"
            startIcon={<SearchIcon />}
            loading={isFetching}
          >
            Search
          </LoadingButton>
        </form>
      </Box> */}
            {data.data.length > 0 && (
              <Stack className="map__first__trip-details">
                <Box className="map__first-label">
                  Trip Date:
                  <Box className="map__first-data">
                    {dayjs(data.data[0].trip_date).format("MMM-DD-YY hh:mm a")}
                  </Box>
                </Box>

                <Box className="map__first-label">
                  User:
                  <Box className="map__first-data">
                    {`${data.data[0].user_id?.employee_id} - ${data.data[0].user_id?.first_name} ${data.data[0].user_id?.last_name}`}
                  </Box>
                </Box>

                <Box className="map__first-label">
                  Vehicle:
                  <Box className="map__first-data">
                    {`${data.data[0].vehicle_id.plate_no} - ${data.data[0].vehicle_id.name}`}
                  </Box>
                </Box>

                <Box className="map__first-label">
                  Locations:
                  <Box className="map__first-data">
                    {data.data[0]?.locations.map((item, i) => {
                      // if (item.status == "left" || item.status == "arrived") {
                      //   return (
                      //     <Fragment key={i}>
                      //       <Box
                      //         sx={{
                      //           color:
                      //             item.status == "left"
                      //               ? theme.palette.custom.danger
                      //               : item.status == "arrived" &&
                      //                 theme.palette.custom.success,

                      //           textTransform: "capitalize",
                      //         }}
                      //       >{`${item.status} :`}</Box>
                      //       {item.address[0].city} {item.address[0].subregion}
                      //       <br />
                      //       Date: {dayjs(item.date).format("MMM-DD-YY hh:mm a")}
                      //       <br />
                      //       <br />
                      //     </Fragment>
                      //   );
                      // }
                      return (
                        <Fragment key={i}>
                          <Box
                            sx={{
                              color:
                                item.status == "left"
                                  ? theme.palette.custom.danger
                                  : item.status == "arrived"
                                  ? theme.palette.custom.success
                                  : theme.palette.customBlue.main,
                              textTransform: "capitalize",
                            }}
                          >{`${item.status} :`}</Box>
                          {`${item?.address[0]?.name || "(No Name)"}  ${
                            item?.address[0]?.district || "(No District)"
                          } ${item?.address[0]?.city || "(No City)"}  ${
                            item?.address[0]?.subregion || "(No Subregion)"
                          }`}
                          <br />
                          Date: {dayjs(item.date).format("MMM-DD-YY hh:mm a")}
                          <br />
                          <br />
                          {data.data[0]?.locations.length - 1 !== i && (
                            <Divider sx={{ width: "40px" }} />
                          )}
                          <br />
                        </Fragment>
                      );
                    })}
                  </Box>
                </Box>

                {data.data[0]?.diesels.length > 0 && (
                  <Box className="map__first-label">
                    Diesels:
                    <Box className="map__first-data">
                      {data.data[0]?.diesels.map((item, i) => {
                        return (
                          <Fragment key={i}>
                            <Box
                              sx={{
                                display: "grid",
                                gridTemplateColumns: "105px 1fr",
                              }}
                            >
                              Name:<Box>{item.gas_station_name}</Box>
                              Odometer: <Box>{item.odometer}</Box>
                              Liter: <Box>{item.liter}</Box>
                              Amount: <Box>{item.amount}</Box>
                            </Box>
                            <br />
                            <br />
                            {data.data[0]?.diesels.length - 1 !== i && (
                              <Divider sx={{ width: "40px" }} />
                            )}
                            <br />
                          </Fragment>
                        );
                      })}
                    </Box>
                  </Box>
                )}

                <Box className="map__first-label">
                  Odo:
                  <Box className="map__first-data">
                    {`${data.data[0].odometer}`}
                  </Box>
                </Box>

                <Box className="map__first-label">
                  Odo Done:
                  <Box className="map__first-data">
                    {`${data.data[0].odometer_done}`}
                  </Box>
                </Box>

                {data.data[0]?.companion.length > 0 && (
                  <Box className="map__first-label">
                    Companion:
                    <Box className="map__first-data">
                      {data.data[0]?.companion.map((item, i) => {
                        return (
                          <Fragment key={i}>
                            {item?.firstName || item?.first_name}
                            <br />
                          </Fragment>
                        );
                      })}
                    </Box>
                  </Box>
                )}

                {data.data[0]?.others != "null" && (
                  <Box className="map__first-label">
                    Others:
                    <Box className="map__first-data">{`${data.data[0].others}`}</Box>
                  </Box>
                )}

                <Box className="map__first-label">
                  Created:
                  <Box className="map__first-data">
                    {dayjs(data.data[0].createdAt).format("MMM-DD-YY hh:mm a")}
                  </Box>
                </Box>
              </Stack>
            )}
          </Stack>

          {/* MAP */}
          <Box className="map__second">
            {data.data.length > 0 && (
              <Box className="map__second-legend">
                Legend:
                <Box className="map__second-legend__label">
                  Left
                  <CheckBoxOutlineBlankIcon className="map__second-legend__left" />
                </Box>
                <Box className="map__second-legend__label">
                  Arrived
                  <CheckBoxOutlineBlankIcon className="map__second-legend__arrived" />
                </Box>
                <Box className="map__second-legend__label">
                  Interval
                  <CheckBoxOutlineBlankIcon className="map__second-legend__interval" />
                </Box>
                <Box className="map__second-legend__label">
                  Diesel
                  <CheckBoxOutlineBlankIcon className="map__second-legend__diesel" />
                </Box>
                <Box className="map__second-legend__label">
                  Path
                  <CheckBoxOutlineBlankIcon className="map__second-legend__path" />
                </Box>
              </Box>
            )}
            {data.data.length > 0 ? (
              <Box className="map__second-google">
                <GoogleMapReact
                  bootstrapURLKeys={{
                    key: process.env.GOOGLEAPIKEY,
                  }}
                  center={{
                    lat: data.data[0]?.locations[0].lat,
                    lng: data.data[0]?.locations[0].long,
                  }}
                  zoom={14}
                >
                  {data.data[0]?.locations.map((item, i) => (
                    <Marker
                      lat={item.lat}
                      lng={item.long}
                      item={item}
                      key={i}
                      queue={i + 1}
                    />
                  ))}
                  {data.data[0]?.diesels.map((item, i) => (
                    <DieselMarker
                      lat={item.lat}
                      lng={item.long}
                      item={item}
                      key={i}
                      queue={i + 1}
                    />
                  ))}
                </GoogleMapReact>
              </Box>
            ) : (
              ObjectID.isValid(newID) &&
              data.data.length <= 0 && (
                <Box className="map__second-error">No Transaction Found</Box>
              )
            )}
          </Box>
        </>
      )}
    </Stack>
  );
};

export default Map;
