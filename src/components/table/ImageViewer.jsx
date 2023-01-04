import { Box, Button } from "@mui/material";
import React from "react";

const ImageViewer = ({ onClose, img }) => {
  return (
    <>
      <Box
        component="img"
        sx={{
          height: "auto",
          maxWidth: 420,
          display: "block",
          margin: "0 auto",
        }}
        alt="Profile"
        src={img}
      />
      <Button
        sx={{ marginRight: 2, float: "right", marginTop: "20px" }}
        onClick={onClose}
      >
        Cancel
      </Button>
    </>
  );
};

export default ImageViewer;
