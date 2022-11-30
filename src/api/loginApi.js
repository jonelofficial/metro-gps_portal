import apiClient from "../services/apiClient";

export const loginUser = async (data) => {
  try {
    return await apiClient.post("auth/login", data);
  } catch (error) {
    return error.response;
  }
};
