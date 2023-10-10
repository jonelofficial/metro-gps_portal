import React, { useEffect } from "react";
import { useUpdateLiveMutation } from "../../../api/metroApi";
import { useGetDepartmentsQuery } from "../../../api/sedarApi";
import useToast from "../../../hook/useToast";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { liveDrawerSchema } from "../../../utility/schema";
import { Autocomplete, Drawer, TextField, Typography } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import DrawerWrapper from "../../drawer/DrawerWrapper";
import InputField from "../../form/InputField";
import { onClose } from "../../../redux-toolkit/counter/drawerDisclosure";

const LiveDrawer = () => {
  const [updateLive, { isLoading: isUpdating }] = useUpdateLiveMutation();
  const {
    data: departments = [],
    isLoading,
    isError,
  } = useGetDepartmentsQuery();

  const { toast } = useToast();

  const isDrawerOpen = useSelector((state) => state.drawer.value);
  const item = useSelector((state) => state.drawer.drawerState);
  const dispatch = useDispatch();

  // REACT HOOK FORMS
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    setValue: setFormValue,
    clearErrors,
  } = useForm({
    resolver: yupResolver(liveDrawerSchema),
    mode: "onSubmit",
    defaultValues: {
      department: null,
    },
  });

  useEffect(() => {
    if (departments && item?.charging) {
      setFormValue("department", { department_name: item.charging });
    }

    setFormValue("odometer", item.odometer);
    setFormValue("odometer_done", item.odometer_done);
    setFormValue("total_bags", item.total_bags);
    setFormValue("total_bags_delivered", item.total_bags_delivered);

    return () => {
      clearErrors();
    };
  }, [departments, item]);

  // FUNCTION
  const onSubmit = async (data) => {
    try {
      let res;
      const newObj = { ...data, charging: data?.department?.department_name };

      if (item) {
        res = await updateLive({ id: item._id, obj: newObj });
        !res?.error &&
          toast({
            severity: "success",
            message: `Success updating trip ${item._id}`,
          });
      }

      if (res?.error) {
        toast({ severity: "error", message: res.error.data.error });
      } else {
        dispatch(onClose());
      }
    } catch (error) {
      toast({ severity: "error", message: error.message });
    }
  };
  return (
    <Drawer
      className="main-drawer"
      anchor="right"
      open={isDrawerOpen}
      onClose={() => {
        dispatch(onClose());
        clearErrors();
      }}
    >
      <DrawerWrapper
        title={item ? "Update Trip" : "Create Trip"}
        color={item ? "customWarning" : "customSuccess"}
        loading={isUpdating}
        onSubmit={handleSubmit(onSubmit)}
        onClose={() => {
          dispatch(onClose());
          clearErrors();
        }}
        disabled={isLoading}
      >
        <InputField
          {...register("odometer")}
          id="odometer"
          label="Odometer"
          autoComplete="off"
          errors={errors}
          sx={{ width: "100%", margin: "unset" }}
          InputProps={{
            inputProps: {
              style: {
                textTransform: "uppercase",
              },
            },
          }}
        />

        <InputField
          {...register("odometer_done")}
          id="odometer_done"
          label="Odometer Done"
          autoComplete="off"
          errors={errors}
          sx={{ width: "100%" }}
          InputProps={{
            inputProps: {
              style: {
                textTransform: "uppercase",
              },
            },
          }}
        />

        <InputField
          {...register("total_bags")}
          id="total_bags"
          label="Total Bags"
          autoComplete="off"
          errors={errors}
          sx={{ width: "100%" }}
          InputProps={{
            inputProps: {
              style: {
                textTransform: "uppercase",
              },
            },
          }}
        />

        <InputField
          {...register("total_bags_delivered")}
          id="total_bags_delivered"
          label="Total Bags Delivered"
          autoComplete="off"
          errors={errors}
          sx={{ width: "100%" }}
          InputProps={{
            inputProps: {
              style: {
                textTransform: "uppercase",
              },
            },
          }}
        />

        <Controller
          control={control}
          name="department"
          render={({ field: { onChange, value } }) => {
            return (
              <>
                <Autocomplete
                  required
                  className="filter"
                  size="small"
                  loading={isLoading}
                  options={departments}
                  value={value}
                  getOptionLabel={(option) => option?.department_name}
                  isOptionEqualToValue={(option, value) =>
                    option?.department_name === value?.department_name
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Charging" />
                  )}
                  onChange={(e, value) => {
                    onChange(value);
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& > fieldset": {
                        borderColor: errors["department"] && "error.main",
                      },
                    },
                  }}
                />
                {errors["department"] && (
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
                    {errors["department"]?.message}
                  </Typography>
                )}
              </>
            );
          }}
        />
        {isError && (
          <Typography sx={{ color: "error.main" }}>
            Cedar Api Department Error
          </Typography>
        )}
      </DrawerWrapper>
    </Drawer>
  );
};

export default LiveDrawer;
