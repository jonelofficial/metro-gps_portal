import axios from "axios";

export default axios.create({
  baseURL: `${process.env.BASEURL}`,
  headers: {
    "Content-Type": "application/json",
  },
});
