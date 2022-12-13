import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseURL = process.env.BASEURL;

export const metroApi = createApi({
  reducerPath: "metroApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    mode: "cors",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Trip", "User"],
  endpoints: (builder) => ({
    getAllTrips: builder.query({
      query: (params) => `/office/trips?page=${params.page}`,
      providesTags: ["Trip"],
    }),
    getAllUsers: builder.query({
      query: (params) =>
        `/auth/users?page=${params.page}&limit=${params.limit}&search=${params.search}&searchBy=${params.searchBy}`,
      providesTags: ["User"],
    }),
    createUser: builder.mutation({
      query: (payload) => ({
        url: "/auth/create-user",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetAllTripsQuery,
  useGetAllUsersQuery,
  useCreateUserMutation,
} = metroApi;
