import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { Controller } from "react-hook-form";

const FormPicker = ({ control, name, label, items, errors, sx, ...etc }) => {
  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Box>
            <FormControl
              fullWidth
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& > fieldset": { borderColor: errors[name] && "error.main" },
                },
                ...sx,
              }}
            >
              <InputLabel id="select-label">{label}</InputLabel>
              <Select
                labelId="select-label"
                label={label}
                sx={{ width: "100%" }}
                value={value}
                onChange={onChange}
                {...etc}
              >
                {items.map((item, i) => (
                  <MenuItem key={i} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}
      />

      {errors[name] && (
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
          {errors[name].message}
        </Typography>
      )}
    </>
  );
};
export default FormPicker;
