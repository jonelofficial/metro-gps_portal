import React from "react";
import Lottie from "lottie-react";
import PageNotFound from "../assets/images/lottie/404.json";
const NotFound = () => {
  return (
    <Lottie
      animationData={PageNotFound}
      loop={true}
      style={{ width: "100%", height: "auto" }}
    />
  );
};

export default NotFound;
