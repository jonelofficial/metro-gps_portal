import React, { useEffect } from "react";
import {
  useCreateTripTemplateMutation,
  useUpdateTripTemplateMutation,
} from "../../../api/metroApi";
import { useDispatch, useSelector } from "react-redux";
import useToast from "../../../hook/useToast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { tripTemplateSchema } from "../../../utility/schema";
import { Drawer } from "@mui/material";
import DrawerWrapper from "../../drawer/DrawerWrapper";
import InputField from "../../form/InputField";
import { onClose } from "../../../redux-toolkit/counter/drawerDisclosure";

const TripTemplateDrawer = () => {
  const [createTripTemplate, { isLoading }] = useCreateTripTemplateMutation();
  const [updateTripTemplate, { isLoading: isUpdating }] =
    useUpdateTripTemplateMutation();

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
  } = useForm({ resolver: yupResolver(tripTemplateSchema) });

  useEffect(() => {
    setFormValue("template", item?.template);

    return () => {
      null;
    };
  }, [item]);

  const onSubmit = async (data) => {
    try {
      let res;
      if (item) {
        res = await updateTripTemplate({ id: item._id, obj: data });
        !res?.error &&
          toast({
            severity: "success",
            message: `Success updating trip category ${data.template}`,
          });
      } else {
        res = await createTripTemplate(data);
        !res?.error &&
          toast({
            severity: "success",
            message: `Success creating trip category ${data.template}`,
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
        title={item ? "Update Trip Template" : "Create Trip Template"}
        color={item ? "customWarning" : "customSuccess"}
        loading={item ? isUpdating : isLoading}
        onSubmit={handleSubmit(onSubmit)}
        onClose={() => {
          dispatch(onClose());
          clearErrors();
        }}
      >
        <InputField
          {...register("template")}
          id="template"
          label="Template"
          autoComplete="off"
          errors={errors}
          sx={{ width: "100%" }}
          defaultValue={item && item.template}
        />
      </DrawerWrapper>
    </Drawer>
  );
};

export default TripTemplateDrawer;
