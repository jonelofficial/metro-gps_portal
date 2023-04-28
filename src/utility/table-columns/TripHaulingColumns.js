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
  { id: "farm", label: "Farm" },
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
  // { id: "trip_type", label: "Trip Type", minWidth: 100 },
  // { id: "diesels", label: "Diesels" },
  // { id: "locations", label: "Locations" },
  // { id: "temperature", label: "Temperature" },
  // { id: "estimated_odo", label: "Estimated Odometer", minWidth: 160 },
  // { id: "tare_weight", label: "Tare Weight", minWidth: 100 },
  // { id: "gross_weight", label: "Gross Weight", minWidth: 110 },
  // { id: "doa_count", label: "DOA Count", minWidth: 100 },
];

export const dropData = [
  { id: "_id", label: "Id" },
  { id: "user_id.employee_id", label: "User Id" },
  { id: "user_id.department", label: "Department", minWidth: 80 },
  { id: "vehicle_id.plate_no", label: "Plate #" },
  { id: "destination", label: "Destination" },
  { id: "farm", label: "Farm" },
  { id: "diesels.gas_station_name", label: "Diesels Gas Station" },
  { id: "odometer", label: "Odometer" },
  { id: "odometer_done", label: "Odometer Done" },
  { id: "companion.first_name", label: "Companion" },
  { id: "others", label: "Others" },
  { id: "trip_date", label: "Trip Date" },
  { id: "createdAt", label: "Sync Date" },
  // { id: "trip_type", label: "Trip Type" },
  // { id: "companion.firstName", label: "Companion" },
  // { id: "locations.address.city", label: "Locations" },
  // { id: "user_id.department.label", label: "Department", minWidth: 80 },
];
