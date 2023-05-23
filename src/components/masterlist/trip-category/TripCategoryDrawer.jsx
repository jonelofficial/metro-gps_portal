import React from "react";
import {
  useCreateTripCategoryMutation,
  useGetAllTripTemplateQuery,
  useUpdateTripCategoryMutation,
} from "../../../api/metroApi";
import { useDispatch, useSelector } from "react-redux";
import useToast from "../../../hook/useToast";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { tripCategorySchema } from "../../../utility/schema";
import { Autocomplete, Drawer, TextField, Typography } from "@mui/material";
import DrawerWrapper from "../../drawer/DrawerWrapper";
import InputField from "../../form/InputField";
import { onClose } from "../../../redux-toolkit/counter/drawerDisclosure";
import { useEffect } from "react";

const TripCategoryDrawer = () => {
  const [createTripCategory, { isLoading }] = useCreateTripCategoryMutation();
  const [updateTripCategory, { isLoading: isUpdating }] =
    useUpdateTripCategoryMutation();

  const { data: tripTemplate = [], isLoading: tripTemplateLoading } =
    useGetAllTripTemplateQuery(
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
    resolver: yupResolver(tripCategorySchema),
    mode: "onSubmit",
    defaultValues: {
      trip_template: { template: "" },
      category: "",
    },
  });

  useEffect(() => {
    setFormValue("category", item?.category);
    setFormValue("trip_template", { template: item?.trip_template || "" });
    return () => {
      null;
    };
  }, [item]);

  const onSubmit = async (data) => {
    try {
      let res;
      if (item) {
        res = await updateTripCategory({ id: item._id, obj: data });
        !res?.error &&
          toast({
            severity: "success",
            message: `Success updating trip category ${data.category}`,
          });
      } else {
        res = await createTripCategory(data);
        !res?.error &&
          toast({
            severity: "success",
            message: `Success creating trip category ${data.category}`,
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
        title={item ? "Update Trip Category" : "Create Trip Category"}
        color={item ? "customWarning" : "customSuccess"}
        loading={item ? isUpdating : isLoading}
        onSubmit={handleSubmit(onSubmit)}
        onClose={() => {
          dispatch(onClose());
          clearErrors();
        }}
      >
        <InputField
          {...register("category")}
          id="category"
          label="Category"
          autoComplete="off"
          errors={errors}
          sx={{ width: "100%", margin: "unset!important" }}
          defaultValue={item && item.category}
        />

        <Controller
          control={control}
          name="trip_template"
          render={({ field: { onChange, value } }) => {
            return (
              <>
                <Autocomplete
                  required
                  className="filter"
                  size="small"
                  loading={tripTemplateLoading}
                  disabled={isLoading || isUpdating}
                  options={tripTemplate?.data}
                  value={value}
                  getOptionLabel={(option) => option.template}
                  isOptionEqualToValue={(option, value) =>
                    option.template === value.template || "" === value.template
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        tripTemplateLoading ? "Loading..." : "Trip Template"
                      }
                    />
                  )}
                  onChange={(e, value) => {
                    console.log(value);
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
                {errors["trip_template"] && (
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
                    {errors["trip_template"].message}
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

export default TripCategoryDrawer;
