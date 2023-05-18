import React from "react";
import {
  useCreateTripCategoryMutation,
  useUpdateTripCategoryMutation,
} from "../../../api/metroApi";
import { useDispatch, useSelector } from "react-redux";
import useToast from "../../../hook/useToast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { tripCategorySchema } from "../../../utility/schema";
import { Drawer } from "@mui/material";
import DrawerWrapper from "../../drawer/DrawerWrapper";
import InputField from "../../form/InputField";
import { onClose } from "../../../redux-toolkit/counter/drawerDisclosure";
import { useEffect } from "react";

const TripCategoryDrawer = () => {
  const [createTripCategory, { isLoading }] = useCreateTripCategoryMutation();
  const [updateTripCategory, { isLoading: isUpdating }] =
    useUpdateTripCategoryMutation();

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
  } = useForm({ resolver: yupResolver(tripCategorySchema) });

  useEffect(() => {
    setFormValue("category", item?.category);
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
          sx={{ width: "100%" }}
          defaultValue={item && item.category}
        />
      </DrawerWrapper>
    </Drawer>
  );
};

export default TripCategoryDrawer;
