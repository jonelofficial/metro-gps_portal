import React, { useEffect } from "react";
import GoogleMapReact from "google-map-react";
import { Box, IconButton } from "@material-ui/core";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useParams } from "react-router-dom";
const Map = () => {
  let { id } = useParams();

  useEffect(() => {
    if (!id) {
      alert("SHOW MODAL");
    }

    return () => {
      null;
    };
  }, []);

  const Marker = ({ status }) => (
    <LocationOnIcon
      sx={{
        fontSize: 40,
        color: status === "left" ? "custom.danger" : "custom.success",
      }}
    />
  );

  const data = {
    _id: "63bd0291b272e4f0848ae0f1",
    trip_date: "2023-01-10T06:15:33.384Z",
    user_id: {
      _id: "63bd0198b272e4f0848ae08a",
      employee_id: "RDFFLFI-10861",
      first_name: "Jonel",
      last_name: "Ignacio",
      username: "admin",
      password: "$2a$12$B9V3yOSJArilLVox.iCUDutnTmsULUzH8g0HVAVX0wOeZK/h6Q77y",
      trip_template: "office",
      role: "admin",
      license_exp: "2023-01-11T16:00:00.000Z",
      status: "active",
      department: {
        id: 700,
        label: "Management Information System",
      },
      createdAt: "2023-01-10T06:11:36.775Z",
      updatedAt: "2023-01-12T01:45:45.657Z",
      __v: 17,
      permission: [
        {
          id: "users",
          label: "Users",
        },
        {
          id: "vehicles",
          label: "Vehicles",
        },
        {
          id: "trips_sg",
          label: "Trips SG",
        },
        {
          id: "gas_stations",
          label: "Gas Stations",
        },
      ],
      profile: "images/3485ec2b-540f-4d66-bfd2-f2d6ce49decb",
    },
    vehicle_id: {
      _id: "63b665f22452d13701ea2e8a",
      plate_no: "AAL4975",
      vehicle_type: "Service Vehicle",
      name: "Innova (Gray)",
      brand: "Innova",
      fuel_type: "Diesel",
      km_per_liter: 11,
      department: {
        id: 40,
        label: "Office Administration",
      },
      createdAt: "2023-01-05T05:53:54.720Z",
      updatedAt: "2023-01-05T05:53:54.720Z",
      __v: 0,
    },
    locations: [
      {
        _id: "63bd0291b272e4f0848ae0f3",
        trip_id: "63bd0291b272e4f0848ae0f1",
        date: "2023-01-10T06:15:33.935Z",
        lat: 15.0950717,
        long: 120.608225,
        status: "left",
        address: [
          {
            postalCode: null,
            country: "Philippines",
            isoCountryCode: "PH",
            subregion: "Pampanga",
            city: "San Fernando",
            street: null,
            district: null,
            name: "3JW5+3MM",
            streetNumber: null,
            region: "Central Luzon",
            timezone: null,
          },
        ],
        odometer: null,
        __v: 0,
      },
      {
        _id: "63bd0291b272e4f0848ae0f5",
        trip_id: "63bd0291b272e4f0848ae0f1",
        date: "2023-01-10T06:15:38.142Z",
        lat: 15.1210055,
        long: 120.60126,
        status: "arrived",
        address: [
          {
            postalCode: null,
            country: "Philippines",
            isoCountryCode: "PH",
            subregion: "Pampanga",
            city: "San Fernando",
            street: null,
            district: null,
            name: "San Fernando",
            streetNumber: null,
            region: "Central Luzon",
            timezone: null,
          },
        ],
        odometer: null,
        __v: 0,
      },
    ],
    diesels: [],
    odometer: 1,
    odometer_done: 4,
    odometer_image_path: null,
    others: "null",
    companion: [],
    points: [
      {
        latitude: 15.0950717,
        longitude: 120.608225,
      },
      {
        latitude: 15.12103,
        longitude: 120.60124,
      },
      {
        latitude: 15.1210055,
        longitude: 120.60126,
      },
      {
        latitude: 15.1209785,
        longitude: 120.6012824,
      },
      {
        latitude: 15.1209648,
        longitude: 120.6012939,
      },
      {
        latitude: 15.1209302,
        longitude: 120.6013232,
      },
      {
        latitude: 15.1209139,
        longitude: 120.6013367,
      },
      {
        latitude: 15.1209054,
        longitude: 120.6013437,
      },
    ],
    createdAt: "2023-01-10T06:15:45.613Z",
    updatedAt: "2023-01-10T06:15:45.646Z",
    __v: 1,
  };

  // // FIT MAP FROM COORDINATES
  // const bounds = new window.google.maps.LatLngBounds();
  // data.locations.forEach((marker) => {
  //   bounds.extend({ lat: marker.lat, lng: marker.lng });
  // });

  return (
    <Box sx={{ width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: process.env.GOOGLEAPIKEY,
        }}
        center={{
          lat: data.locations[0].lat,
          lng: data.locations[0].long,
        }}
        zoom={10}
      >
        {data.locations.map((item, i) => (
          <Marker lat={item.lat} lng={item.long} status={item.status} key={i} />
        ))}
      </GoogleMapReact>
    </Box>
  );
};

export default Map;
