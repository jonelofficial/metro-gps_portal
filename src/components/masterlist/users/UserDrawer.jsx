import React, { memo, useState } from "react";
import InputField from "../../form/InputField";
import { yupResolver } from "@hookform/resolvers/yup";
import { userSchema, userUpdateSchema } from "../../../utility/schema";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from "../../../api/metroApi";
import { useEffect } from "react";
import { department } from "../../../utility/department";
import FormPicker from "../../form/FormPicker";
import AutoFormPicker from "../../form/AutoFormPicker";
import DateFormPicker from "../../form/DateFormPicker";
import ImageFormPicker from "../../form/ImageFormPicker";
import { useForm } from "react-hook-form";
import DrawerWrapper from "../../drawer/DrawerWrapper";

const UserDrawer = ({ open, item }) => {
  const [image, setImage] = useState();

  const [createUser, { isLoading }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue: setFormValue,
  } = useForm({
    resolver: yupResolver(item ? userUpdateSchema : userSchema),
    mode: "onSubmit",
    defaultValues: {
      department: null,
      trip_template: "",
      role: "",
      status: "",
      license_exp: null,
    },
  });

  useEffect(() => {
    setFormValue("department", item?.department);
    setFormValue("trip_template", item?.trip_template);
    setFormValue("role", item?.role);
    setFormValue("status", item?.status);
    setFormValue("license_exp", item?.license_exp);

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
      form.append("employee_id", data.employee_id);
      form.append("first_name", data.first_name);
      form.append("last_name", data.last_name);
      form.append("username", data.username);
      form.append("password", data.password.length > 0 ? data.password : null);
      form.append("trip_template", data.trip_template);
      form.append("role", data.role);
      form.append("status", data.status);
      form.append("department", JSON.stringify(data.department));
      form.append("license_exp", data.license_exp);
      if (item) {
        res = await updateUser({ id: item._id, obj: form });
        console.log(res);
      } else {
        res = await createUser(form);
        console.log(res);
      }
      if (res?.error) {
        alert(res.error.data.error);
      } else {
        open(false);
      }
    } catch (e) {
      console.log("ERROR CREATE USER: ", e);
    }
  };

  return (
    <DrawerWrapper
      title={item ? "Update User" : "Create User"}
      color={item ? "customWarning" : "customSuccess"}
      loading={item ? isUpdating : isLoading}
      onSubmit={handleSubmit(onSubmit)}
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
        {...register("employee_id")}
        id="employee_id"
        label="Employee Id"
        autoComplete="off"
        errors={errors}
        sx={{ width: "100%" }}
        defaultValue={item && item.employee_id}
      />
      <InputField
        {...register("first_name")}
        id="first_name"
        label="First Name"
        autoComplete="off"
        errors={errors}
        sx={{ width: "100%" }}
        defaultValue={item && item.first_name}
      />
      <InputField
        {...register("last_name")}
        id="last_name"
        label="Last Name"
        autoComplete="off"
        errors={errors}
        sx={{ width: "100%" }}
        defaultValue={item && item.last_name}
      />
      <InputField
        {...register("username")}
        id="username"
        label="Username"
        autoComplete="off"
        errors={errors}
        sx={{ width: "100%" }}
        defaultValue={item && item.username}
      />
      <InputField
        {...register("password")}
        id="password"
        label="Password"
        autoComplete="off"
        errors={errors}
        type="password"
        sx={{ width: "100%" }}
      />

      <DateFormPicker
        control={control}
        name="license_exp"
        label="License Expiration"
        errors={errors}
      />

      <FormPicker
        control={control}
        name="trip_template"
        label="Trip Template"
        items={[
          { value: "office", label: "Office" },
          { value: "hauling", label: "Hauling" },
          { value: "delivery", label: "Delivery" },
          { value: "feeds_delivery", label: "Feeds Delivery" },
        ]}
        errors={errors}
      />

      <FormPicker
        control={control}
        name="role"
        label="Role"
        items={[
          { value: "admin", label: "Admin" },
          { value: "user", label: "User" },
          { value: "driver", label: "Driver" },
        ]}
        errors={errors}
      />

      <FormPicker
        control={control}
        name="status"
        label="Status"
        items={[
          { value: "active", label: "Active" },
          { value: "archived", label: "Archived" },
        ]}
        errors={errors}
      />
    </DrawerWrapper>
  );
};

export default memo(UserDrawer);
