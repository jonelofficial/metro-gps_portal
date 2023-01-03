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
  tagTypes: ["Trip", "User", "Vehicles", "GasStation"],
  endpoints: (builder) => ({
    // T R I P S
    getAllTrips: builder.query({
      query: (params) => `/office/trips?page=${params.page}`,
      providesTags: ["Trip"],
    }),
    // U S E R S
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
    deleteUser: builder.mutation({
      query: (payload) => ({
        url: `/auth/delete-user/${payload}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: (payload) => ({
        url: `/auth/update-user/${payload.id}`,
        method: "PUT",
        body: payload.obj,
      }),
      invalidatesTags: ["User"],
    }),
    importUser: builder.mutation({
      query: (payload) => ({
        url: "/auth/import-user",
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
  useDeleteUserMutation,
  useUpdateUserMutation,
  useImportUserMutation,
} = metroApi;
