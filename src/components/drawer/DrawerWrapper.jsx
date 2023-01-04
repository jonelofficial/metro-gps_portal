import { LoadingButton } from "@mui/lab";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import React from "react";

const DrawerWrapper = ({
  children,
  title,
  onSubmit,
  loading,
  color,
  onClose,
}) => {
  return (
    <Box className="drawer">
      <Box className="drawer__title-wrapper">
        <Typography variant="h6" className="drawer__title">
          {title || "ADD TITLE"}
        </Typography>
      </Box>
      <Divider />
      <form onSubmit={onSubmit} className="drawer__form">
        <Box className="drawer__form-wrapper">
          <Stack spacing={2}>{children}</Stack>

          <Box className="drawer__form-button">
            <Button
              sx={{ marginRight: "20px" }}
              color="customDanger"
              onClick={onClose}
            >
              Cancel
            </Button>

            <LoadingButton
              variant="contained"
              type="submit"
              color={color || "customSuccess"}
              loading={loading || null}
            >
              {title || "ADD TITLE"}
            </LoadingButton>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default DrawerWrapper;
