import React, { Fragment } from "react";
import GoogleMapReact from "google-map-react";
import { Box, Tooltip } from "@material-ui/core";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetAllDeliveryQuery,
  useGetAllTripsHaulingQuery,
  useGetAllTripsQuery,
} from "../api/metroApi";
import { Stack } from "@mui/system";
import { ObjectID } from "bson";
import useToast from "../hook/useToast";
import { theme } from "../theme";
import dayjs from "dayjs";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import image from "../assets/images/guide.png";
import Lottie from "lottie-react";
import searchLoading from "../assets/images/lottie/search-file.json";
import error from "../assets/images/lottie/error.json";
import { Button, Divider, Typography } from "@mui/material";
import "../style/map/map.scss";

const Map = () => {
  let { id, category } = useParams();

  const navigate = useNavigate();

  const opt1 = {
    search: id,
    searchBy: "_id",
  };
  const opt2 = { refetchOnMountOrArgChange: true };

  // RTK QUERY
  const { data, isLoading, isError, isFetching } =
    category.toLocaleLowerCase() === "office"
      ? useGetAllTripsQuery(opt1, opt2)
      : category.toLocaleLowerCase() === "hauling"
      ? useGetAllTripsHaulingQuery(opt1, opt2)
      : category.toLocaleLowerCase() === "delivery" &&
        useGetAllDeliveryQuery(opt1, opt2);

  if (isLoading || isFetching) {
    return (
      <Box
        sx={{
          width: "400px",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Lottie animationData={searchLoading} loop={true} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box
        sx={{
          width: "600px",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Lottie animationData={error} loop={false} />
      </Box>
    );
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
    <Box sx={{ width: "100%", marginBottom: "10px" }}>
      <Button
        variant="contained"
        sx={{ margin: "10px" }}
        onClick={() => {
          category.toLocaleLowerCase() === "office"
            ? navigate("/reports/trips-sg")
            : category.toLocaleLowerCase() === "hauling"
            ? navigate("/reports/trips-depot", { state: "hauling" })
            : category.toLocaleLowerCase() === "delivery" &&
              navigate("/reports/trips-depot", { state: "delivery" });
        }}
      >
        Back
      </Button>
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
              {data.data.length > 0 && (
                <Stack className="map__first__trip-details">
                  <Box className="map__first-label">
                    Trip Date:
                    <Box className="map__first-data">
                      {dayjs(data.data[0].trip_date).format(
                        "MMM-DD-YY hh:mm a"
                      )}
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
                      {`${data.data[0].vehicle_id.plate_no}`}
                    </Box>
                  </Box>

                  {/* HAULING */}
                  {category.toLocaleLowerCase() === "hauling" && (
                    <>
                      <Box className="map__first-label">
                        Destination:
                        <Box className="map__first-data">
                          {`${data.data[0]?.destination}`}
                        </Box>
                      </Box>

                      <Box className="map__first-label">
                        Tare Weight:
                        <Box className="map__first-data">
                          {`${data.data[0]?.tare_weight}`}
                        </Box>
                      </Box>

                      <Box className="map__first-label">
                        Net Weight:
                        <Box className="map__first-data">
                          {`${data.data[0]?.net_weight}`}
                        </Box>
                      </Box>

                      <Box className="map__first-label">
                        Gross Weight:
                        <Box className="map__first-data">
                          {`${data.data[0]?.gross_weight}`}
                        </Box>
                      </Box>

                      <Box className="map__first-label">
                        Item Count:
                        <Box className="map__first-data">
                          {`${data.data[0]?.item_count}`}
                        </Box>
                      </Box>

                      <Box className="map__first-label">
                        DOA Count:
                        <Box className="map__first-data">
                          {`${data.data[0]?.doa_count}`}
                        </Box>
                      </Box>
                    </>
                  )}

                  {/* DELIVERY */}
                  {category.toLocaleLowerCase() === "delivery" && (
                    <>
                      <Box className="map__first-label">
                        Destination:
                        <Box className="map__first-data">
                          {`${data.data[0]?.destination}`}
                        </Box>
                      </Box>
                    </>
                  )}

                  <Box className="map__first-label">
                    Locations:
                    <Box className="map__first-data">
                      {[...data.data[0]?.locations]
                        .sort((a, b) => {
                          return new Date(a.date) - new Date(b.date);
                        })
                        .map((item, i) => {
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
                              >
                                {`${item.status} ${
                                  category.toLocaleLowerCase() === "delivery" &&
                                  (i == 0 ||
                                    [...data.data[0]?.locations].length - 1 ===
                                      i)
                                    ? "Depot"
                                    : category.toLocaleLowerCase() ===
                                      "delivery"
                                    ? "Store"
                                    : ""
                                } ${
                                  category.toLocaleLowerCase() === "hauling" &&
                                  (i == 0 ||
                                    [...data.data[0]?.locations].length - 1 ===
                                      i)
                                    ? "Depot"
                                    : category.toLocaleLowerCase() === "hauling"
                                    ? "Farm"
                                    : ""
                                }:`}
                              </Box>
                              <Typography sx={{ fontWeight: "600" }}>
                                {`${item?.address[0]?.name || "(No Name)"}  ${
                                  item?.address[0]?.district || "(No District)"
                                } ${item?.address[0]?.city || "(No City)"}  ${
                                  item?.address[0]?.subregion ||
                                  "(No Subregion)"
                                }`}
                                <br />

                                {dayjs(item.date).format("MMM-DD-YY hh:mm a")}
                                <br />
                                {`${item?.lat}° N  ${item?.long}° E`}
                                {item?.destination && (
                                  <>
                                    <br />
                                    {item.destination}
                                  </>
                                )}
                                {category.toLocaleLowerCase() === "delivery" &&
                                  item?.status === "arrived" &&
                                  data.data[0]?.locations.length !== i + 1 && (
                                    <Box
                                      sx={{
                                        display: "grid",
                                        gridTemplateColumns: "105px 1fr",
                                      }}
                                    >
                                      Dropped:
                                      <Box>
                                        {
                                          data.data[0]?.crates_transaction[
                                            Math.floor(i / 2)
                                          ]?.crates_dropped
                                        }
                                      </Box>
                                      Collected:{" "}
                                      <Box>
                                        {
                                          data.data[0]?.crates_transaction[
                                            Math.floor(i / 2)
                                          ]?.crates_collected
                                        }
                                      </Box>
                                      Borrowed:{" "}
                                      <Box>
                                        {
                                          data.data[0]?.crates_transaction[
                                            Math.floor(i / 2)
                                          ]?.crates_borrowed
                                        }
                                      </Box>
                                    </Box>
                                  )}
                                <br />
                                <br />
                              </Typography>
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
                    Charging:
                    <Box className="map__first-data">
                      {`${data.data[0].charging}`}
                    </Box>
                  </Box>

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
                      {dayjs(data.data[0].createdAt).format(
                        "MMM-DD-YY hh:mm a"
                      )}
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
                ObjectID.isValid(id) &&
                data.data.length <= 0 && (
                  <Box className="map__second-error">No Transaction Found</Box>
                )
              )}
            </Box>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default Map;
