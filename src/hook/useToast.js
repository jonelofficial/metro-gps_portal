import React, { useContext } from "react";
import WebAppContext from "../context/context";

const useToast = () => {
  const { toast } = useContext(WebAppContext);
  return { toast };
};

export default useToast;
