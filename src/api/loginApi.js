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

// export const createNewUser = async (formData) => {
//   try {
//     return await axios({
//       method: "POST",
//       url: `${baseURL}/auth/create-user`,
//       data: formData,
//       headers: {
//         "Content-Type": "multipart/form-data",
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then(function (response) {
//         //handle success
//         console.log(response);
//       })
//       .catch(function (response) {
//         //handle error
//         console.log(response);
//       });
//   } catch (error) {
//     return error.response;
//   }
// };

export const createNewUser = async (form) => {
  try {
    const response = await fetch(`${baseURL}/auth/create-user`, {
      method: "POST",
      headers: {
        // "Access-Control-Allow-Origin": "*",
        // "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      body: form,
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.log("CREATE-TRIP API ERROR: ", error);
  }
};
