import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
} from "../../../api/metroApi";
import useToast from "../../../hook/useToast";
import { department } from "../../../utility/department";
import { vehicleSchema } from "../../../utility/schema";
import DrawerWrapper from "../../drawer/DrawerWrapper";
import AutoFormPicker from "../../form/AutoFormPicker";
import FormPicker from "../../form/FormPicker";
import ImageFormPicker from "../../form/ImageFormPicker";
import InputField from "../../form/InputField";
import { useDispatch, useSelector } from "react-redux";
import { onClose } from "../../../redux-toolkit/counter/drawerDisclosure";
import { Drawer } from "@mui/material";

const VehicleDrawer = () => {
  const [image, setImage] = useState();

  const isDrawerOpen = useSelector((state) => state.drawer.value);
  const item = useSelector((state) => state.drawer.drawerState);
  const dispatch = useDispatch();

  const [createVehicle, { isLoading }] = useCreateVehicleMutation();
  const [updateVehicle, { isLoading: isUpdating }] = useUpdateVehicleMutation();

  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue: setFormValue,
    clearErrors,
  } = useForm({
    resolver: yupResolver(vehicleSchema),
    mode: "onSubmit",
    defaultValues: {
      department: null,
      vehicle_type: "",
      brand: "",
      fuel_type: "",
    },
  });

  useEffect(() => {
    setFormValue("department", item?.department);
    setFormValue("vehicle_type", item?.vehicle_type);
    setFormValue("brand", item?.brand);
    setFormValue("fuel_type");
    setFormValue("plate_no", item?.plate_no);
    setFormValue("name", item?.name);
    setFormValue("km_per_liter", item?.km_per_liter);

    return () => {
      null;
    };
  }, [item]);

  const onSubmit = async (data) => {
    try {
      let res;
      const form = new FormData();
      (item?.profile != null || image?.imageFile.file != null) &&
        form.append("image", image?.imageFile.file);
      form.append("department", JSON.stringify(data.department));
      form.append("plate_no", data.plate_no.toUpperCase());
      form.append("vehicle_type", data.vehicle_type);
      form.append("name", data.name);
      form.append("brand", data.brand);
      form.append("fuel_type", data.fuel_type);
      form.append("km_per_liter", data.km_per_liter);

      if (item) {
        res = await updateVehicle({ id: item._id, obj: form });
        !res?.error &&
          toast({
            severity: "success",
            message: `Success updating vehicle ${data.plate_no.toUpperCase()}`,
          });
      } else {
        res = await createVehicle(form);
        !res?.error &&
          toast({
            severity: "success",
            message: `Success creating vehicle ${data.plate_no.toUpperCase()}`,
          });
      }

      if (res?.error) {
        toast({
          severity: "error",
          message: res.error.data.error,
        });
      } else {
        dispatch(onClose());
      }
    } catch (error) {
      console.log("ERROR CREATE VEHICLE: ", error);
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
        title={item ? "Update Vehicle" : "Create Vehicle"}
        color={item ? "customWarning" : "customSuccess"}
        loading={item ? isUpdating : isLoading}
        onSubmit={handleSubmit(onSubmit)}
        onClose={() => {
          dispatch(onClose());
          clearErrors();
        }}
      >
        <ImageFormPicker item={item} image={image} setImage={setImage} />

        <AutoFormPicker
          control={control}
          options={department}
          name="department"
          label="Department"
          errors={errors}
        />

        <InputField
          {...register("plate_no")}
          id="plate_no"
          label="Plate Number"
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

        <FormPicker
          control={control}
          name="vehicle_type"
          label="Vehicle Type"
          items={[
            { value: "Service Vehicle", label: "Service Vehicle" },
            { value: "Depot", label: "Depot" },
          ]}
          errors={errors}
        />

        <InputField
          {...register("name")}
          id="name"
          label="Name"
          autoComplete="off"
          errors={errors}
          sx={{ width: "100%" }}
        />

        <FormPicker
          control={control}
          name="brand"
          label="Brand"
          items={[
            { value: "Toyota", label: "Toyota" },
            { value: "Honda", label: "Honda" },
            { value: "Hyundai", label: "Hyundai" },
            { value: "Suzuki", label: "Suzuki" },
            { value: "Mitsubishi", label: "Mitsubishi" },
            { value: "Isuzu", label: "Isuzu" },
          ]}
          errors={errors}
        />

        <FormPicker
          control={control}
          name="fuel_type"
          label="Fuel Type"
          items={[
            { value: "Gasoline", label: "Gasoline" },
            { value: "Diesel", label: "Diesel" },
          ]}
          errors={errors}
        />

        <InputField
          {...register("km_per_liter")}
          id="km_per_liter"
          label="KMPL"
          autoComplete="off"
          errors={errors}
          sx={{ width: "100%" }}
        />
      </DrawerWrapper>
    </Drawer>
  );
};

export default VehicleDrawer;
