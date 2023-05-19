import React from "react";
import {
  useCreateDestinationMutation,
  useGetAllTripCategoryQuery,
  useGetAllTripTypeQuery,
  useUpdateDestinationMutation,
} from "../../../api/metroApi";
import { useDispatch, useSelector } from "react-redux";
import useToast from "../../../hook/useToast";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { destinationSchema } from "../../../utility/schema";
import { useEffect } from "react";
import { Autocomplete, Drawer, TextField, Typography } from "@mui/material";
import DrawerWrapper from "../../drawer/DrawerWrapper";
import InputField from "../../form/InputField";
import { onClose } from "../../../redux-toolkit/counter/drawerDisclosure";

const DestinationDrawer = () => {
  const [createDestination, { isLoading }] = useCreateDestinationMutation();
  const [updateDestination, { isLoading: isUpdating }] =
    useUpdateDestinationMutation();

  const { data: tripCategoryData = [], isLoading: isLoadingTripCategory } =
    useGetAllTripCategoryQuery(
      {
        page: 1,
        limit: 0,
      },
      { refetchOnMountOrArgChange: true }
    );

  const { data: tripTypeData = [], isLoading: isLoadingTripType } =
    useGetAllTripTypeQuery(
      {
        page: 1,
        limit: 0,
      },
      { refetchOnMountOrArgChange: true }
    );

  const isDrawerOpen = useSelector((state) => state.drawer.value);
  const item = useSelector((state) => state.drawer.drawerState);
  const dispatch = useDispatch();

  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue: setFormValue,
    clearErrors,
    control,
  } = useForm({
    resolver: yupResolver(destinationSchema),
    mode: "onSubmit",
    defaultValues: {
      trip_category: { category: "" },
      trip_type: { type: "" },
      destination: "",
    },
  });

  useEffect(() => {
    setFormValue("destination", item?.destination);
    setFormValue("trip_category", { category: item?.trip_category || "" });
    setFormValue("trip_type", { type: item?.trip_type || "" });
  }, [item]);

  const onSubmit = async (data) => {
    try {
      let res;
      if (item) {
        res = await updateDestination({ id: item._id, obj: data });
        !res?.error &&
          toast({
            severity: "success",
            message: `Success updating trip type ${data.destination}`,
          });
      } else {
        res = await createDestination(data);
        !res?.error &&
          toast({
            severity: "success",
            message: `Success creating trip type ${data.destination}`,
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
        title={item ? "Update Destination" : "Create Destination"}
        color={item ? "customWarning" : "customSuccess"}
        loading={item ? isUpdating : isLoading}
        onSubmit={handleSubmit(onSubmit)}
        onClose={() => {
          dispatch(onClose());
          clearErrors();
        }}
      >
        <InputField
          {...register("destination")}
          id="destination"
          label="Detination"
          autoComplete="off"
          errors={errors}
          sx={{ width: "100%", margin: "unset!important" }}
          defaultValue={item && item.destination}
        />

        <Controller
          control={control}
          name="trip_type"
          render={({ field: { onChange, value } }) => {
            return (
              <>
                <Autocomplete
                  required
                  className="filter"
                  size="small"
                  loading={isLoadingTripCategory}
                  disabled={isLoading || isUpdating}
                  options={tripTypeData?.data}
                  value={value}
                  getOptionLabel={(option) => option.type}
                  isOptionEqualToValue={(option, value) =>
                    option.type === value.type || "" === value.type
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={isLoadingTripCategory ? "Loading..." : "Trip Type"}
                    />
                  )}
                  onChange={(e, value) => {
                    onChange(value);
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& > fieldset": {
                        borderColor: errors["trip_type"] && "error.main",
                      },
                    },
                  }}
                />
                {errors["trip_type"] && (
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
                    {errors["trip_type"].message}
                  </Typography>
                )}
              </>
            );
          }}
        />

        <Controller
          control={control}
          name="trip_category"
          render={({ field: { onChange, value } }) => {
            return (
              <>
                <Autocomplete
                  required
                  className="filter"
                  size="small"
                  loading={isLoadingTripCategory}
                  disabled={isLoading || isUpdating}
                  options={tripCategoryData?.data}
                  value={value}
                  getOptionLabel={(option) => option.category}
                  isOptionEqualToValue={(option, value) =>
                    option.category === value.category || "" === value.category
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        isLoadingTripCategory ? "Loading..." : "Trip Category"
                      }
                    />
                  )}
                  onChange={(e, value) => {
                    onChange(value);
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& > fieldset": {
                        borderColor: errors["trip_category"] && "error.main",
                      },
                    },
                  }}
                />
                {errors["trip_category"] && (
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
                    {errors["trip_category"].message}
                  </Typography>
                )}
              </>
            );
          }}
        />
      </DrawerWrapper>
    </Drawer>
  );
};

export default DestinationDrawer;
