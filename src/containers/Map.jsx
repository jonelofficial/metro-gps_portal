import React from "react";
import GoogleMapReact from "google-map-react";
import { Box, Typography } from "@material-ui/core";
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
import { Grid } from "@mui/material";
import { theme } from "../theme";
import { useEffect } from "react";

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

  if (isLoading) {
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

  console.log(data.data[0]);

  return (
    <Stack
      width="100%"
      flexDirection={{ xs: "column", lg: "row" }}
      sx={{ marginBottom: "25px" }}
      gap={1.5}
    >
      <Stack width="100%" gap={1.5}>
        <Box>
          <Box sx={{ marginBottom: "10px" }}>Input complete Trip ID:</Box>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: "flex", alignItems: "center", gap: 10 }}
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
        </Box>
        {data.data.length > 0 && (
          <Box
            sx={{
              border: "1.5px solid",
              borderColor: theme.palette.custom.success,
              borderRadius: "10px",

              padding: "16px",
            }}
          >
            Test
          </Box>
        )}
      </Stack>

      {/* MAP */}
      <Box sx={{ width: "100%", height: "100%" }}>
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
          ObjectID.isValid(newID) &&
          data.data.length <= 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: theme.palette.custom.danger,
              }}
            >
              No Transaction Found
            </Box>
          )
        )}
      </Box>
    </Stack>
  );
};

export default Map;
