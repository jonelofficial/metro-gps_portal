import { LoadingButton } from "@mui/lab";
import { Button, Divider, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import InputField from "../form/InputField";

const UserDrawer = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const ref = useRef();

  const handleImageClick = (e) => {
    console.log(e);
  };
  return (
    <Box
      sx={{
        width: "350px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ padding: "15px" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Create User
        </Typography>
      </Box>

      <Divider />
      <form style={{ display: "flex", flex: 1 }}>
        <Box
          sx={{
            padding: "15px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <Stack spacing={2}>
            <InputField
              {...register("employee_id")}
              id="employee_id"
              label="Employee Id"
              autoComplete="off"
              errors={errors}
              sx={{ width: "100%" }}
            />
            <InputField
              {...register("first_name")}
              id="first_name"
              label="First Name"
              autoComplete="off"
              errors={errors}
              sx={{ width: "100%" }}
            />
            <InputField
              {...register("last_name")}
              id="last_name"
              label="Last Name"
              autoComplete="off"
              errors={errors}
              sx={{ width: "100%" }}
            />
            <InputField
              {...register("username")}
              id="username"
              label="Username"
              autoComplete="off"
              errors={errors}
              sx={{ width: "100%" }}
            />
            <InputField
              {...register("password")}
              id="password"
              label="Password"
              autoComplete="off"
              errors={errors}
              sx={{ width: "100%" }}
            />
            <InputField
              {...register("trip_template")}
              id="trip_template"
              label="Trip Template"
              autoComplete="off"
              errors={errors}
              sx={{ width: "100%" }}
            />
            <InputField
              {...register("role")}
              id="role"
              label="Role"
              autoComplete="off"
              errors={errors}
              sx={{ width: "100%" }}
            />
            <Button component="label" variant="outlined">
              Select Image
              <input type="file" hidden ref={ref} onChange={handleImageClick} />
            </Button>
          </Stack>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <LoadingButton
              variant="contained"
              type="submit"
              sx={{ marginRight: "20px" }}
            >
              Create
            </LoadingButton>

            <LoadingButton variant="contained" type="submit">
              Cancel
            </LoadingButton>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default UserDrawer;
