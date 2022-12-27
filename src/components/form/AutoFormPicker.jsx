import { Autocomplete, TextField, Typography } from "@mui/material";
import React from "react";
import { Controller } from "react-hook-form";

const AutoFormPicker = ({ control, name, options, label, errors }) => {
  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <Autocomplete
            className="filter"
            size="small"
            options={options}
            value={value}
            isOptionEqualToValue={(option, value) =>
              `${option.id} - ${option.label}` ===
              `${option.id} - ${option.label}`
            }
            getOptionLabel={(option) => `${option.id} - ${option.label}`}
            renderInput={(params) => <TextField {...params} label={label} />}
            onChange={(e, value) => onChange(value)}
          />
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

export default AutoFormPicker;
