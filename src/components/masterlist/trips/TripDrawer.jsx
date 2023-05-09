import { Autocomplete, Drawer, TextField, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useUpdateTripMutation } from "../../../api/metroApi";
import { useGetDepartmentsQuery } from "../../../api/sedarApi";
import useToast from "../../../hook/useToast";
import DrawerWrapper from "../../drawer/DrawerWrapper";
import InputField from "../../form/InputField";
import { useDispatch, useSelector } from "react-redux";
import {
  clearDrawerState,
  onClose,
} from "../../../redux-toolkit/counter/drawerDisclosure";

const TripDrawer = () => {
  // RTK QUERY
  const [updateTrip, { isLoading: isUpdating }] = useUpdateTripMutation();
  const {
    data: departments = [],
    isLoading,
    isError,
  } = useGetDepartmentsQuery();

  const isDrawerOpen = useSelector((state) => state.drawer.value);
  const item = useSelector((state) => state.drawer.drawerState);
  const dispatch = useDispatch();

  // HOOKS
  const { toast } = useToast();

  // REACT HOOK FORMS
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    setValue: setFormValue,
  } = useForm({
    defaultValues: {
      department: null,
    },
  });

  useEffect(() => {
    departments &&
      item?.charging &&
      setFormValue("department", { department_name: item?.charging });

    setFormValue("odometer", item?.odometer);
    setFormValue("odometer_done", item?.odometer_done);
    return () => {
      null;
    };
  }, [departments, item]);

  // FUNCTION
  const onSubmit = async (data) => {
    try {
      let res;
      const newObj = { ...data, charging: data?.department?.department_name };

      if (item) {
        res = await updateTrip({ id: item._id, obj: newObj });
        !res?.error &&
          toast({
            severity: "success",
            message: `Sucess updating trip ${item._id}`,
          });
      }

      if (res?.error) {
        toast({ severity: "error", message: res.error.data.error });
      } else {
        dispatch(onClose());
        dispatch(clearDrawerState());
      }
    } catch (error) {
      toast({ severity: "error", message: error });
    }
  };

  return (
    <Drawer
      className="main-drawer"
      anchor="right"
      open={isDrawerOpen}
      onClose={() => dispatch(onClose())}
    >
      <DrawerWrapper
        title={item ? "Update Trip" : "Create Trip"}
        color={item ? "customWarning" : "customSuccess"}
        loading={isUpdating}
        onSubmit={handleSubmit(onSubmit)}
        onClose={onClose}
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
                    <TextField {...params} label="Charging" I />
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
                    {errors["department"].message}
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

export default TripDrawer;
