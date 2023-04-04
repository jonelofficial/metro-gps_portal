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
      query: (params) =>
        `/office/trips?page=${params?.page}&limit=${params?.limit}&search=${params?.search}&searchBy=${params?.searchBy}&date=${params?.date}`,
      providesTags: ["Trip"],
    }),
    createTrip: builder.mutation({
      query: (payload) => ({
        url: "/office/trip",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Trip"],
    }),
    updateTrip: builder.mutation({
      query: (payload) => ({
        url: `/office/trip/${payload.id}`,
        method: "PUT",
        body: payload.obj,
      }),
      invalidatesTags: ["Trip"],
    }),
    deleteTrip: builder.mutation({
      query: (payload) => ({
        url: `/office/trip/${payload.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Trip"],
    }),
    // U S E R S
    getAllUsers: builder.query({
      query: (params) =>
        `/auth/users?page=${params?.page}&limit=${params?.limit}&search=${params?.search}&searchBy=${params?.searchBy}&date=${params?.date}`,
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
    importUsers: builder.mutation({
      query: (payload) => ({
        url: "/auth/import-users",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),
    // VEHICLES
    getAllVehicles: builder.query({
      query: (params) =>
        `/vehicle/cars?page=${params?.page}&limit=${params?.limit}&search=${params?.search}&searchBy=${params?.searchBy}`,
      providesTags: ["Vehicles"],
    }),
    createVehicle: builder.mutation({
      query: (payload) => ({
        url: "/vehicle/car",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Vehicles"],
    }),
    updateVehicle: builder.mutation({
      query: (payload) => ({
        url: `/vehicle/car/${payload.id}`,
        method: "PUT",
        body: payload.obj,
      }),
      invalidatesTags: ["Vehicles"],
    }),
    deleteVehicle: builder.mutation({
      query: (payload) => ({
        url: `/vehicle/car/${payload}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Vehicles"],
    }),
    importVehicles: builder.mutation({
      query: (payload) => ({
        url: "/vehicle/import-vehicles",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Vehicles"],
    }),
    // GAS STATION
    getAllGasStations: builder.query({
      query: (params) =>
        `/gas-station/stations?page=${params?.page}&limit=${params?.limit}&search=${params?.search}&searchBy=${params?.searchBy}`,
      providesTags: ["GasStation"],
    }),
    createGasStation: builder.mutation({
      query: (payload) => ({
        url: "/gas-station/station",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["GasStation"],
    }),
    updateGasStation: builder.mutation({
      query: (payload) => ({
        url: `/gas-station/station/${payload.id}`,
        method: "PUT",
        body: payload.obj,
      }),
      invalidatesTags: ["GasStation"],
    }),
    deleteGasStation: builder.mutation({
      query: (payload) => ({
        url: `/gas-station/station/${payload}`,
        method: "DELETE",
      }),
      invalidatesTags: ["GasStation"],
    }),
    importGasStations: builder.mutation({
      query: (payload) => ({
        url: "/gas-station/import-stations",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["GasStation"],
    }),
    // DASHBOARD
    getTVDTdeparment: builder.query({
      query: (params) => ({
        url: `/dashboard/tvdt-department?page=${params?.page}&limit=${params?.limit}&search=${params?.search}&searchBy=${params?.searchBy}`,
      }),
    }),
    getHighestKm: builder.query({
      query: (params) => ({
        url: `/dashboard/highest-km?page=${params?.page}&limit=${params?.limit}&search=${params?.search}&searchBy=${params?.searchBy}`,
      }),
    }),
    getLongestDuration: builder.query({
      query: (params) => ({
        url: `/dashboard/longest-duration?page=${params?.page}&limit=${params?.limit}&search=${params?.search}&searchBy=${params?.searchBy}`,
      }),
    }),
    getTotalTripDriver: builder.query({
      query: (params) => ({
        url: `/dashboard/total-trip-driver?page=${params?.page}&limit=${params?.limit}&search=${params?.search}&searchBy=${params?.searchBy}`,
      }),
    }),
    // DEPOT HAULING
    getAllTripsHauling: builder.query({
      query: (params) =>
        `/depot/trips-hauling?page=${params?.page}&limit=${params?.limit}&search=${params?.search}&searchBy=${params?.searchBy}&date=${params?.date}`,
      providesTags: ["Trip Hauling"],
    }),
  }),
});

export const {
  // TRIPS
  useGetAllTripsQuery,
  useCreateTripMutation,
  useUpdateTripMutation,
  useDeleteTripMutation,
  // USERS
  useGetAllUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useImportUsersMutation,
  // VEHICLES
  useGetAllVehiclesQuery,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
  useImportVehiclesMutation,
  // GAS STATION
  useGetAllGasStationsQuery,
  useCreateGasStationMutation,
  useUpdateGasStationMutation,
  useDeleteGasStationMutation,
  useImportGasStationsMutation,
  // DASHBOARD
  useGetTVDTdeparmentQuery,
  useGetHighestKmQuery,
  useGetLongestDurationQuery,
  useGetTotalTripDriverQuery,
  // DEPOT HAULING
  useGetAllTripsHaulingQuery,
} = metroApi;
