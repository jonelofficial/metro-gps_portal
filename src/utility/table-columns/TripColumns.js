export const columns = [
  { id: "_id", label: "Id" },
  { id: "trip_date", label: "Trip Date", minWidth: 80 },
  { id: "user_id", label: "User Id", minWidth: 80 },
  { id: "vehicle_id", label: "Plate #", minWidth: 80 },
  { id: "locations", label: "Locations" },
  { id: "diesels", label: "Diesels" },
  { id: "odometer", label: "Odometer" },
  { id: "odometer_done", label: "Odometer Done", minWidth: 120 },
  {
    id: "odometer_image_path",
    label: "Odometer Image",
    minWidth: 130,
  },
  { id: "others", label: "Others" },
  { id: "companion", label: "Companion" },

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

export const dropData = [{ id: "_id", label: "Id" }];
