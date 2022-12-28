import axios from "axios";
import apiClient from "../services/apiClient";

const baseURL = process.env.BASEURL;
const token = localStorage.getItem("token");

export const loginUser = async (data) => {
  try {
    return await apiClient.post("auth/login", data);
  } catch (error) {
    return error.response;
  }
};
