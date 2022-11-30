import jwtDecode from "jwt-decode";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/loginApi";
import {
  addToken,
  addUser,
  removeToken,
  removeUser,
} from "../redux-toolkit/counter/userCounter";

const useAuth = () => {
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = async (data) => {
    try {
      setLoading(true);
      const res = await loginUser(data);
      if (res.data?.token) {
        dispatch(addUser(jwtDecode(res.data.token)));
        dispatch(addToken(res.data));
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(jwtDecode(res.data.token)));
        navigate("/");
      } else {
        alert(res.data.message);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      alert(e.response.data.message);
      console.log("ERROR LOGIN: ", e);
    }
  };

  const logout = () => {
    dispatch(removeToken());
    dispatch(removeUser());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return { login, logout, isLoading };
};

export default useAuth;
