import { Box, Button } from "@mui/material";
import React from "react";

const ImageViewer = ({ onClose, img, ...etc }) => {
  return (
    <>
      <Box
        component="img"
        sx={{
          // height: "auto",
          height: 450,
          maxWidth: 600,
          display: "block",
          margin: "0 auto",
        }}
        src={img}
        {...etc}
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
