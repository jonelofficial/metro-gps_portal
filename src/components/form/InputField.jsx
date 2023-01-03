import { Box, TextField, Typography } from "@mui/material";
import React from "react";

const InputField = React.forwardRef(({ errors, id, sx, ...etc }, ref) => {
  return (
    <>
      <TextField
        ref={ref}
        size="small"
        variant="outlined"
        {...etc}
        sx={{
          marginBottom: id === "search" ? 0 : errors[id] ? 0.5 : 2,
          "& .MuiOutlinedInput-root": {
            "& > fieldset": { borderColor: errors[id] && "error.main" },
          },
          ...sx,
        }}
      />
      {errors[id] && (
        <Typography
          variant="p"
          sx={{
            fontFamily: "Roboto",
            fontSize: 12,
            marginBottom: 1,
            marginLeft: 1,
            color: "custom.danger",
            display: id === "search" && "none",
          }}
        >
          {errors[id].message}
        </Typography>
      )}
    </>
  );
});

export default InputField;
