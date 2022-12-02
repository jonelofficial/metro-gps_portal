import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseURL = process.env.BASEURL;

export const metroApi = createApi({
  reducerPath: "metroApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),

  endpoints: (builder) => ({
    getAllTrips: builder.query({
      query: (params) => `/office/trips?page=${params.page}`,
    }),
    getAllUsers: builder.query({
      query: (params) => `/auth/users?page=${params.page}`,
    }),
  }),
});

export const { useGetAllTripsQuery, useGetAllUsersQuery } = metroApi;

// builder.mutation
