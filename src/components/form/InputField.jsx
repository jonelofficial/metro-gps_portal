import { TextField, Typography } from "@mui/material";
import React from "react";

const InputField = React.forwardRef(({ errors, id, ...etc }, ref) => {
  return (
    <>
      <TextField
        ref={ref}
        size="small"
        variant="outlined"
        sx={{ marginBottom: errors[id] ? 0.5 : 2 }}
        {...etc}
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
          }}
        >
          {errors[id].message}
        </Typography>
      )}
    </>
  );
});

export default InputField;
