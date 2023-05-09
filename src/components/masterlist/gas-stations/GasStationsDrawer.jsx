import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  useCreateGasStationMutation,
  useUpdateGasStationMutation,
} from "../../../api/metroApi";
import useToast from "../../../hook/useToast";
import { gasStationSchema } from "../../../utility/schema";
import DrawerWrapper from "../../drawer/DrawerWrapper";
import InputField from "../../form/InputField";
import { onClose } from "../../../redux-toolkit/counter/drawerDisclosure";
import { useDispatch, useSelector } from "react-redux";
import { Drawer } from "@mui/material";

const GasStationsDrawer = () => {
  const [createGasStaion, { isLoading }] = useCreateGasStationMutation();
  const [updateGasStation, { isLoading: isUpdating }] =
    useUpdateGasStationMutation();

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
  } = useForm({ resolver: yupResolver(gasStationSchema), mode: "onSubmit" });

  useEffect(() => {
    setFormValue("label", item?.label);

    return () => {
      null;
    };
  }, [item]);

  const onSubmit = async (data) => {
    try {
      let res;
      if (item) {
        res = await updateGasStation({ id: item._id, obj: data });
        !res?.error &&
          toast({
            severity: "success",
            message: `Success updating gas station ${data.label}`,
          });
      } else {
        res = await createGasStaion(data);
        !res?.error &&
          toast({
            severity: "success",
            message: `Success creating gas station ${data.label}`,
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
        title={item ? "Update Gas Station" : "Create Gas Station"}
        color={item ? "customWarning" : "customSuccess"}
        loading={item ? isUpdating : isLoading}
        onSubmit={handleSubmit(onSubmit)}
        onClose={() => {
          dispatch(onClose());
          clearErrors();
        }}
      >
        <InputField
          {...register("label")}
          id="label"
          label="Label"
          autoComplete="off"
          errors={errors}
          sx={{ width: "100%" }}
          defaultValue={item && item.label}
        />
      </DrawerWrapper>
    </Drawer>
  );
};

export default GasStationsDrawer;
