import { TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React from "react";
import { Controller } from "react-hook-form";

const DateFormPicker = ({ name, control, label, errors }) => {
  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={value}
              label={label}
              onChange={onChange}
              renderInput={(params) => (
                <TextField size="small" {...params} label={label} />
              )}
            />
          </LocalizationProvider>
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

export default DateFormPicker;
