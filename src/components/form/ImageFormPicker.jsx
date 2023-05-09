import { Box, IconButton } from "@mui/material";
import React from "react";
import "react-image-upload/dist/index.css";
import ImageUploader from "react-image-upload/dist";
import DoNotDisturbOnIcon from "@mui/icons-material/DoNotDisturbOn";

const ImageFormPicker = ({ item, image, setImage }) => {
  function getImageFileObject(imageFile) {
    setImage({ imageFile });
  }
  function runAfterImageDelete(file) {}
  return (
    <Box className="drawer__form-image">
      {item?.profile && image == null ? (
        <Box sx={{ position: "relative" }}>
          <IconButton
            sx={{
              position: "absolute",
              right: 0,
              padding: 0,
            }}
            color="customDanger"
            onClick={() => setImage({})}
          >
            <DoNotDisturbOnIcon />
          </IconButton>
          <Box
            component="img"
            sx={{
              height: "auto",
              maxWidth: 100,
              display: "block",
              margin: "0 auto",
            }}
            alt="Metro GPS"
            src={`${process.env.BASEURL}/${item.profile}`}
          />
        </Box>
      ) : (
        <ImageUploader
          onFileAdded={(img) => getImageFileObject(img)}
          onFileRemoved={(img) => runAfterImageDelete(img)}
        />
      )}
    </Box>
  );
};

export default ImageFormPicker;
