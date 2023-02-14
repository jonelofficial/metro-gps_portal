import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseURL = process.env.SEDAR_API;
const token = process.env.SEDAR_KEY;

export const sedarApi = createApi({
  reducerPath: "sedarApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    mode: "cors",
    prepareHeaders: (headers) => {
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Trip", "User", "Vehicles", "GasStation"],
  endpoints: (builder) => ({
    // SEDAR
    getEmployees: builder.query({
      transformResponse: (response) => response.data,
      query: (params) => ({
        url: `/data/employees`,
      }),
    }),
    getEmployee: builder.query({
      transformResponse: (response) => response.data,
      query: (params) => ({
        url: `/data/employee/filter/idnumber?prefix_id=${params?.prefix}&id_number=${params?.id_number}`,
      }),
    }),
  }),
});

export const {
  // SEDAR
  useGetEmployeesQuery,
  useGetEmployeeQuery,
} = sedarApi;
