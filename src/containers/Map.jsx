import React, { useEffect } from "react";
import GoogleMapReact from "google-map-react";
import { Box, IconButton } from "@material-ui/core";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useParams } from "react-router-dom";
import { useGetAllTripsQuery } from "../api/metroApi";
import { useState } from "react";
const Map = () => {
  let { id } = useParams();
  const [newID, setNewID] = useState("63bd023fb272e4f0848ae0b3");

  // RTK QUERY
  const { data, isLoading, isError, isFetching } = useGetAllTripsQuery({
    search: id || newID,
    searchBy: "_id",
  });

  useEffect(() => {
    if (!id) {
      // alert("SHOW MODAL");
    }

    return () => {
      null;
    };
  }, []);

  if (isLoading || isFetching) {
    return <Box>Loading</Box>;
  }

  if (isError) {
    return <Box>Error</Box>;
  }

  const Marker = ({ status }) => (
    <LocationOnIcon
      sx={{
        fontSize: 40,
        color: status === "left" ? "custom.danger" : "custom.success",
      }}
    />
  );

  // // FIT MAP FROM COORDINATES
  // const bounds = new window.google.maps.LatLngBounds();
  // data.data[0]?.locations.forEach((marker) => {
  //   bounds.extend({ lat: marker.lat, lng: marker.lng });
  // });

  return (
    <Box sx={{ width: "100%" }}>
      {data.data.length > 0 ? (
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
              status={item.status}
              key={i}
            />
          ))}
        </GoogleMapReact>
      ) : (
        <Box>No ID SPECIFIED</Box>
      )}
    </Box>
  );
};

export default Map;
