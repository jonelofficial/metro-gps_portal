export const columns = [
  { id: "icon", label: "", minWidth: 60 },
  { id: "trip_date", label: "Trip Date", minWidth: 80 },
  {
    id: "createdAt",
    label: "Sync Date",
    minWidth: 90,
  },
  { id: "_id", label: "Id", align: "center" },
  { id: "user_id", label: "User Id", minWidth: 80 },
  { id: "department", label: "Department", minWidth: 80 },
  { id: "vehicle_id", label: "Plate #", minWidth: 80 },
  { id: "duration", label: "Duration", minWidth: 80 },
  { id: "start", label: "Start", minWidth: 80 },
  { id: "end", label: "End", minWidth: 80 },
  { id: "estimated_total_km", label: "Estimated Total KM", minWidth: 150 },
  { id: "total_km", label: "Total KM", minWidth: 70 },
  { id: "odometer", label: "Odometer" },
  { id: "odometer_done", label: "Odometer Done", minWidth: 120 },
  { id: "destination", label: "Destination" },
  { id: "charging", label: "Charging" },
  { id: "companion", label: "Companion" },
  { id: "others", label: "Others" },
  {
    id: "odometer_image_path",
    label: "Odometer Image",
    minWidth: 130,
  },
  {
    id: "action",
    label: "Action",
  },
];

export const dropData = [
  { id: "_id", label: "Id" },
  { id: "user_id.employee_id", label: "User Id" },
  { id: "user_id.department", label: "Department" },
  { id: "vehicle_id.plate_no", label: "Plate #" },
  { id: "destination", label: "Destination" },
  { id: "diesels.gas_station_name", label: "Diesels Gas Station" },
  { id: "odometer", label: "Odometer" },
  { id: "odometer_done", label: "Odometer Done" },
  { id: "companion.first_name", label: "Companion" },
  { id: "others", label: "Others" },
  { id: "trip_date", label: "Trip Date" },
  { id: "createdAt", label: "Sync Date" },
];