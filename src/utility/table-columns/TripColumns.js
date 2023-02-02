export const columns = [
  { id: "_id", label: "Id" },
  { id: "user_id", label: "User Id", minWidth: 80 },
  { id: "vehicle_id", label: "Plate #", minWidth: 80 },
  { id: "duration", label: "Duration", minWidth: 80 },
  { id: "start", label: "Start", minWidth: 80 },
  { id: "end", label: "End", minWidth: 80 },
  // { id: "left_time", label: "Left Time", minWidth: 80 },

  { id: "locations", label: "Locations" },
  { id: "diesels", label: "Diesels" },
  { id: "odometer", label: "Odometer" },
  { id: "odometer_done", label: "Odometer Done", minWidth: 120 },
  {
    id: "odometer_image_path",
    label: "Odometer Image",
    minWidth: 130,
  },
  { id: "companion", label: "Companion" },
  { id: "others", label: "Others" },
  { id: "trip_date", label: "Trip Date", minWidth: 80 },

  {
    id: "createdAt",
    label: "Created",
    minWidth: 90,
  },
  {
    id: "action",
    label: "Action",
  },
];

export const dropData = [
  { id: "_id", label: "Id" },
  { id: "user_id.employee_id", label: "User Id" },
  { id: "vehicle_id.plate_no", label: "Plate #" },
  { id: "locations.address.city", label: "Locations" },
  { id: "diesels.gas_station_name", label: "Diesels Gas Station" },
  { id: "odometer", label: "Odometer" },
  { id: "odometer_done", label: "Odometer Done" },
  { id: "companion.firstName", label: "Companion" },
  { id: "others", label: "Others" },
  { id: "trip_date", label: "Trip Date" },
  { id: "createdAt", label: "Created At" },
];
