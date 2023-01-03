import * as Yup from "yup";

export const loginSchema = Yup.object().shape({
  username: Yup.string().required().label("Username"),
  password: Yup.string().required().label("Password"),
});

export const searchSchema = Yup.object().shape({
  search_by: Yup.object().required().label("Search"),
  search: Yup.string().required().label("Search"),
});

export const userSchema = Yup.object().shape({
  department: Yup.object().required().label("Department"),
  employee_id: Yup.string().required().label("Employee Id"),
  first_name: Yup.string().required().label("First name"),
  last_name: Yup.string().required().label("Last name"),
  username: Yup.string().required().label("Username"),
  password: Yup.string().required().label("Password"),
  license_exp: Yup.date().required().label("License expiration"),
  trip_template: Yup.string().required().label("Trip template"),
  role: Yup.string().required().label("Role"),
  status: Yup.string().required().label("Status"),
});

export const userUpdateSchema = Yup.object().shape({
  employee_id: Yup.string().required().label("Employee Id"),
  first_name: Yup.string().required().label("First name"),
  last_name: Yup.string().required().label("Last name"),
  username: Yup.string().required().label("Username"),
  license_exp: Yup.date().required().label("License expiration"),
  trip_template: Yup.string().required().label("Trip template"),
  role: Yup.string().required().label("Role"),
  status: Yup.string().required().label("Status"),
  department: Yup.object().required().label("Department"),
});
