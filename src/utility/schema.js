import * as Yup from "yup";

export const loginSchema = Yup.object().shape({
  username: Yup.string().required().label("Username"),
  password: Yup.string().required().label("Password"),
});

export const searchSchema = Yup.object().shape({
  search_by: Yup.object().required().label("Search"),
  // .required()
  search: Yup.string().label("Search"),
  date: Yup.date().required().label("Date"),
});

export const searchNoDateSchema = Yup.object().shape({
  search_by: Yup.object().required().label("Search"),
  // .required()
  search: Yup.string().label("Search"),
});

export const userSchema = Yup.object().shape({
  division: Yup.string().required().label("Division"),
  company: Yup.string().required().label("Company"),
  division_category: Yup.string().required().label("Division Category"),
  location: Yup.string().required().label("Location"),
  sub_unit: Yup.string().required().label("Sub Unit"),
  department: Yup.string().required().label("Department"),
  employee_id: Yup.string()
    .transform((e) => e?.general_info?.full_id_number)
    .required()
    .label("Employee Id"),
  first_name: Yup.string().required().label("First name"),
  last_name: Yup.string().required().label("Last name"),
  username: Yup.string().required().label("Username"),
  password: Yup.string().required().label("Password"),
  license_exp: Yup.date()
    .required()
    .typeError("License Expiration is a required field")
    .label("License Expiration"),
  trip_template: Yup.string()
    .transform((e) => e?.template)
    .required()
    .label("Trip template"),
  role: Yup.string().required().label("Role"),
  status: Yup.string().required().label("Status"),
});

export const userUpdateSchema = Yup.object().shape({
  division: Yup.string().required().label("Division"),
  company: Yup.string().required().label("Company"),
  division_category: Yup.string().required().label("Division Category"),
  location: Yup.string().required().label("Location"),
  sub_unit: Yup.string().required().label("Sub Unit"),
  department: Yup.string().required().label("Department"),
  employee_id: Yup.string()
    .transform((e) => e?.general_info?.full_id_number)
    .required()
    .label("Employee Id"),
  first_name: Yup.string().required().label("First name"),
  last_name: Yup.string().required().label("Last name"),
  username: Yup.string().required().label("Username"),
  license_exp: Yup.date()
    .required()
    .typeError("License Expiration is a required field")
    .label("License Expiration"),
  trip_template: Yup.string()
    .transform((e) => e?.template)
    .required()
    .label("Trip template"),
  role: Yup.string().required().label("Role"),
  status: Yup.string().required().label("Status"),
});

export const vehicleSchema = Yup.object().shape({
  department: Yup.object().required().label("Department"),
  plate_no: Yup.string()
    .matches(/^\S*$/, "No space allowed")
    .required()
    .label("Plate Number"),
  vehicle_type: Yup.string().required().label("Vehicle Type"),
  name: Yup.string().required().label("Name"),
  brand: Yup.string().required().label("Brand"),
  fuel_type: Yup.string().required().label("Fuel Type"),
  km_per_liter: Yup.string()
    .matches(/^\d+\.?\d*$/, "Must be only digits")
    .required()
    .label("KMPL"),
});

export const gasStationSchema = Yup.object().shape({
  label: Yup.string().required().label("Label"),
});

export const tripDrawerSchema = Yup.object().shape({
  odometer: Yup.number()
    .required("Odometer is required field")
    .typeError("Text/Special character are not allowed")
    .label("Odometer"),
  odometer_done: Yup.number()
    .required("Odometer done is required field")
    .typeError("Text/Special character are not allowed")
    .label("Odometer Done")
    .test(
      "is-greater",
      "Odometer Done must be greater than or equal to Odometer",
      function (value) {
        const { odometer } = this.parent;
        return value >= odometer;
      }
    ),
});

export const haulingDrawerSchema = Yup.object().shape({
  odometer: Yup.number()
    .required("Odometer is required field")
    .typeError("Text/Special character are not allowed")
    .label("Odometer"),
  odometer_done: Yup.number()
    .required("Odometer done is required field")
    .typeError("Text/Special character are not allowed")
    .label("Odometer Done"),

  tare_weight: Yup.number()
    .required("Tare Weight is required field")
    .typeError("Text/Special character are not allowed")
    .label("Tare Weight"),
  net_weight: Yup.number()
    .nullable()
    .typeError("Text/Special character are not allowed")
    .label("Tare Weight"),
  gross_weight: Yup.number()
    .required("Gross Weight is required field")
    .typeError("Text/Special character are not allowed")
    .label("Tare Weight"),
  item_count: Yup.number()
    .required("Item Count is required field")
    .typeError("Text/Special character are not allowed")
    .label("Item Count"),
  doa_count: Yup.number()
    .required("DOA Count is required field")
    .typeError("Text/Special character are not allowed")
    .label("DOA Count"),
});

// TRIP TEMPLATE

export const tripTemplateSchema = Yup.object().shape({
  template: Yup.string()
    .required("Category is required field")
    .label("Category"),
});

// TRIP CATEGORY

export const tripCategorySchema = Yup.object().shape({
  category: Yup.string()
    .required("Category is required field")
    .label("Category"),
  trip_template: Yup.string()
    .transform((e) => e?.template)
    .required("Trip Template is required field")
    .label("Trip Template"),
});

// TRIP TYPE

export const tripTypeSchema = Yup.object().shape({
  type: Yup.string().required("Type is required field").label("Type"),
  trip_category: Yup.string()
    .transform((e) => e?.category)
    .required("Trip Category is required field")
    .label("Trip Category"),
  trip_template: Yup.string()
    .transform((e) => e?.template)
    .required("Trip Template is required field")
    .label("Trip Template"),
});

// DESTINATION

export const destinationSchema = Yup.object().shape({
  destination: Yup.string().required("Type is required field").label("Type"),
  trip_type: Yup.string()
    .transform((e) => e?.type)
    .required("Type is required field")
    .label("Type"),
  trip_category: Yup.string()
    .transform((e) => e?.category)
    .required("Trip Category is required field")
    .label("Trip Category"),
  trip_template: Yup.string()
    .transform((e) => e?.template)
    .required("Trip Template is required field")
    .label("Trip Template"),
});

// LIVE

export const liveDrawerSchema = Yup.object().shape({
  odometer: Yup.number()
    .required("Odometer is required field")
    .typeError("Text/Special character are not allowed")
    .label("Odometer"),
  odometer_done: Yup.number()
    .required("Odometer done is required field")
    .typeError("Text/Special character are not allowed")
    .label("Odometer Done"),
  total_bags: Yup.number()
    .nullable()
    .typeError("Text/Special character are not allowed")
    .label("Total Bags"),
  total_bags_delivered: Yup.number()
    .required("Gross Weight is required field")
    .typeError("Text/Special character are not allowed")
    .label("Total Bags Delivered"),
});
