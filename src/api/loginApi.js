import apiClient from "../services/apiClient";

export const loginUser = async (data) => {
  try {
    return await apiClient.post("auth/login", data);
  } catch (error) {
    alert("Login API: No server response");
    // console.log("LOGIN API ERROR: ", error);
  }
};
