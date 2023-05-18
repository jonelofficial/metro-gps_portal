import React from "react";
import {
  useCreateTripTypeMutation,
  useGetAllTripCategoryQuery,
  useUpdateTripTypeMutation,
} from "../../../api/metroApi";
import { useDispatch, useSelector } from "react-redux";
import useToast from "../../../hook/useToast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { tripTypeSchema } from "../../../utility/schema";
import { useEffect } from "react";
import DrawerWrapper from "../../drawer/DrawerWrapper";
import InputField from "../../form/InputField";
import { onClose } from "../../../redux-toolkit/counter/drawerDisclosure";
import { Drawer } from "@mui/material";
import FormPicker from "../../form/FormPicker";
import { useState } from "react";

const TripTypeDrawer = () => {
  const [categories, setCategories] = useState([
    { value: "", label: "Loading..." },
  ]);
  const [createTripType, { isLoading }] = useCreateTripTypeMutation();
  const [updateTripTypem, { isLoading: isUpdating }] =
    useUpdateTripTypeMutation();

  const isDrawerOpen = useSelector((state) => state.drawer.value);
  const item = useSelector((state) => state.drawer.drawerState);
  const dispatch = useDispatch();
  const {
    data,
    isLoading: isLoadingCategory,
    isError,
    isFetching,
  } = useGetAllTripCategoryQuery(
    {
      page: 1,
      limit: 0,
    },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (data) {
      setCategories(
        data?.data?.map((item) => {
          return { value: item?.category, label: item?.category };
        })
      );
    }
  }, [data]);

  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue: setFormValue,
    clearErrors,
    control,
  } = useForm({ resolver: yupResolver(tripTypeSchema) });

  useEffect(() => {
    setFormValue("type", item?.type);
    setFormValue("trip_category", item?.trip_category);
  }, [item]);

  const onSubmit = async (data) => {
    console.log(data);
    try {
      let res;
      if (item) {
        res = await updateTripTypem({ id: item._id, obj: data });
        !res?.error &&
          toast({
            severity: "success",
            message: `Success updating trip type ${data.type}`,
          });
      } else {
        res = await createTripType(data);
        !res?.error &&
          toast({
            severity: "success",
            message: `Success creating trip type ${data.type}`,
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
        title={item ? "Update Trip Type" : "Create Trip Type"}
        color={item ? "customWarning" : "customSuccess"}
        loading={item ? isUpdating : isLoading}
        onSubmit={handleSubmit(onSubmit)}
        onClose={() => {
          dispatch(onClose());
          clearErrors();
        }}
      >
        <InputField
          {...register("type")}
          id="type"
          label="Type"
          autoComplete="off"
          errors={errors}
          sx={{ width: "100%" }}
          defaultValue={item && item.type}
        />

        <FormPicker
          control={control}
          name="trip_category"
          label={isLoadingCategory ? "Loading..." : "Trip Category"}
          items={categories}
          errors={errors}
          disabled={isLoadingCategory}
        />
      </DrawerWrapper>
    </Drawer>
  );
};

export default TripTypeDrawer;
