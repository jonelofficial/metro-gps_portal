import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUpdateTripMutation } from "../../../api/metroApi";
import useToast from "../../../hook/useToast";
import DrawerWrapper from "../../drawer/DrawerWrapper";
import InputField from "../../form/InputField";

const TripDrawer = ({ onClose, item }) => {
  // RTK QUERY
  const [updateTrip, { isLoading: isUpdating }] = useUpdateTripMutation();

  // HOOKS
  const { toast } = useToast();

  // REACT HOOK FORMS
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    setFormValue,
  } = useForm();

  useEffect(() => {
    return () => {
      null;
    };
  }, []);

  // FUNCTION
  const onSubmit = async (data) => {
    try {
      let res;
      if (item) {
        res = await updateTrip({ id: item._id, obj: data });
        !res?.error &&
          toast({
            severity: "success",
            message: `Sucess updating trip ${item._id}`,
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
  };

  return (
    <DrawerWrapper
      title={item ? "Update Trip" : "Create Trip"}
      color={item ? "customWarning" : "customSuccess"}
      loading={isUpdating}
      onSubmit={handleSubmit(onSubmit)}
      onClose={onClose}
    >
      <InputField
        {...register("odometer")}
        id="odometer"
        label="Odometer"
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
    </DrawerWrapper>
  );
};

export default TripDrawer;
