import { Box, Container, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import React from "react";
import { useForm } from "react-hook-form";
import logo from "../assets/images/logo-metro.png";
import InputField from "../components/form/InputField";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../utility/schema";
import useAuth from "../auth/useAuth";
import useToast from "../hook/useToast";

const Login = () => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onSubmit",
  });

  const { isLoading, login } = useAuth();

  const onSubmit = async (data) => {
    const res = await login(data);
    if (res) {
      toast({
        severity: "error",
        message: res.data.message,
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Box sx={{ marginBottom: 2 }}>
            <Box
              component="img"
              sx={{
                height: "auto",
                maxWidth: 150,
                display: "block",
                margin: "0 auto",
              }}
              alt="Metro GPS"
              src={logo}
            />
            <Typography
              variant="h4"
              sx={{
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Metro GPS
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{
                display: "flex",
                flexDirection: "column",
                width: "300px",
              }}
            >
              <InputField
                {...register("username")}
                id="username"
                label="Username"
                autoComplete="off"
                errors={errors}
              />
              <InputField
                {...register("password")}
                id="password"
                label="Password"
                type="password"
                autoComplete="off"
                errors={errors}
              />

              <LoadingButton
                loading={isLoading}
                variant="contained"
                type="submit"
              >
                Login
              </LoadingButton>
            </form>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
