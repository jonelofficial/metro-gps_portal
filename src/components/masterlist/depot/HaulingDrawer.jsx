import React, { useEffect } from "react";
import DrawerWrapper from "../../drawer/DrawerWrapper";
import { useGetDepartmentsQuery } from "../../../api/sedarApi";
import InputField from "../../form/InputField";
import { Controller, useForm } from "react-hook-form";
import { Autocomplete, TextField, Typography } from "@mui/material";
import { useUpdateTripHaulingMutation } from "../../../api/metroApi";
import useToast from "../../../hook/useToast";

const HaulingDrawer = ({ item, onClose }) => {
  const [updateTripHauling, { isLoading: isUpdating }] =
    useUpdateTripHaulingMutation();
  const {
    data: departments = [],
    isLoading,
    isError,
  } = useGetDepartmentsQuery();

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
    return () => {
      null;
    };
  }, [departments]);

  // FUNCTION
  const onSubmit = async (data) => {
    try {
      let res;
      const newObj = { ...data, charging: data?.department?.department_name };

      if (item) {
        res = await updateTripHauling({ id: item._id, obj: newObj });
        !res?.error &&
          toast({
            severity: "success",
            message: `Success updating trip ${item._id}`,
          });
      }

      if (res?.error) {
        toast({ severity: "error", message: res.error.data.error });
      } else {
        onClose();
      }
    } catch (error) {
      toast({ severity: "error", message: error });
    }

    t;
  };
  return (
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
        defaultValue={item && item.odometer}
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
        defaultValue={item && item.odometer_done}
      />

      <InputField
        {...register("temperature")}
        id="temperature"
        label="Temperature"
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
        defaultValue={item && item?.temperature}
      />

      <InputField
        {...register("tare_weight")}
        id="tare_weight"
        label="Tare Weight"
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
        defaultValue={item && item?.tare_weight}
      />

      <InputField
        {...register("net_weight")}
        id="net_weight"
        label="Net Weight"
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
        defaultValue={item && item?.net_weight}
      />

      <InputField
        {...register("gross_weight")}
        id="gross_weight"
        label="Gross Weight"
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
        defaultValue={item && item?.gross_weight}
      />

      <InputField
        {...register("item_count")}
        id="item_count"
        label="Item Count"
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
        defaultValue={item && item?.item_count}
      />

      <InputField
        {...register("doa_count")}
        id="doa_count"
        label="DOA Count"
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
        defaultValue={item && item?.doa_count}
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
  );
};

export default HaulingDrawer;
