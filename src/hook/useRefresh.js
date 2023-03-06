import React from "react";
import { useDispatch } from "react-redux";
import {
  setLimit,
  setPage,
  setSearch,
  setSearchBy,
} from "../redux-toolkit/counter/featuresCounter";

const useRefresh = () => {
  const dispatch = useDispatch();

  const refresh = (reset) => {
    dispatch(setPage(1));
    dispatch(setLimit(25));
    dispatch(setSearch(""));
    dispatch(setSearchBy("_id"));
    reset && reset();
  };
  return { refresh };
};

export default useRefresh;
