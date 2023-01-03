import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import React from "react";
import { Controller } from "react-hook-form";

const AutoFormPicker = ({
  control,
  name,
  options,
  label,
  errors,
  showId,
  ...etc
}) => {
  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <>
            <Autocomplete
              className="filter"
              size="small"
              options={options}
              value={value}
              isOptionEqualToValue={(option, value) =>
                showId
                  ? `${option.id} - ${option.label}` ===
                    `${option.id} - ${option.label}`
                  : option.label === option.label
              }
              getOptionLabel={(option) =>
                showId ? `${option.id} - ${option.label}` : option.label
              }
              renderInput={(params) => <TextField {...params} label={label} />}
              onChange={(e, value) => onChange(value)}
              {...etc}
              sx={{
                minWidth: name === "search_by" && "200px",
                "& .MuiOutlinedInput-root": {
                  "& > fieldset": { borderColor: errors[name] && "error.main" },
                },
              }}
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
                  display: name === "search_by" && "none",
                }}
              >
                {errors[name].message}
              </Typography>
            )}
          </>
        )}
      />
    </>
  );
};

export default AutoFormPicker;
