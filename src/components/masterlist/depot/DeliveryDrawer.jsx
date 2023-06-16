import React, { useEffect } from "react";
import { useGetDepartmentsQuery } from "../../../api/sedarApi";
import useToast from "../../../hook/useToast";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { onClose } from "../../../redux-toolkit/counter/drawerDisclosure";
import { Autocomplete, Drawer, TextField, Typography } from "@mui/material";
import DrawerWrapper from "../../drawer/DrawerWrapper";
import { useUpdateDeliveryMutation } from "../../../api/metroApi";

const DeliveryDrawer = () => {
  const [updateDelivery, { isLoading: isUpdating }] =
    useUpdateDeliveryMutation();
  const {
    data: departments = [],
    isLoading,
    isError,
  } = useGetDepartmentsQuery();

  const { toast } = useToast();

  const isDrawerOpen = useSelector((state) => state.drawer.value);
  const item = useSelector((state) => state.drawer.drawerState);
  const dispatch = useDispatch();

  //   REACK HOOK FORM
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    setValue: setFormValue,
    clearErrors,
  } = useForm({
    resolver: null,
    mode: "onSubmit",
    defaultValues: { department: null },
  });

  useEffect(() => {
    departments &&
      item?.charging &&
      setFormValue("department", { department_name: item?.charging });

    return () => {
      clearErrors();
    };
  }, [departments, item]);

  const onSubmit = async (data) => {
    try {
      let res;
      const newObj = { ...data, charging: data?.department?.department_name };

      if (item) {
        res = await updateDelivery({ id: item._id, obj: newObj });
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
      toast({ severity: "error", message: error });
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

export default DeliveryDrawer;
