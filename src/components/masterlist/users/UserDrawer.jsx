import React, { memo, useState } from "react";
import InputField from "../../form/InputField";
import { yupResolver } from "@hookform/resolvers/yup";
import { userSchema, userUpdateSchema } from "../../../utility/schema";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from "../../../api/metroApi";
import { useEffect } from "react";
import FormPicker from "../../form/FormPicker";
import AutoFormPicker from "../../form/AutoFormPicker";
import DateFormPicker from "../../form/DateFormPicker";
import ImageFormPicker from "../../form/ImageFormPicker";
import { Controller, useForm } from "react-hook-form";
import DrawerWrapper from "../../drawer/DrawerWrapper";
import useToast from "../../../hook/useToast";
import { Autocomplete, Checkbox, TextField } from "@mui/material";
import { permission } from "../../../utility/permission";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

import { locations } from "../../../utility/user/locations";
import { divisions } from "../../../utility/user/divisions";
import { divisionCategory } from "../../../utility/user/divisionCategory";
import { company } from "../../../utility/user/company";
import { subUnit } from "../../../utility/user/subUnit";
import { department } from "../../../utility/user/department";

const UserDrawer = ({ onClose, item }) => {
  //
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  // STATE
  const [image, setImage] = useState();

  // RTK QUERY
  const [createUser, { isLoading }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  // HOOKS
  const { toast } = useToast();

  // REACT HOOK FORMS
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue: setFormValue,
    watch,
  } = useForm({
    resolver: yupResolver(item ? userUpdateSchema : userSchema),
    mode: "onSubmit",
    defaultValues: {
      department: null,
      sub_unit: null,
      location: null,
      division: null,
      division_category: null,
      company: null,
      trip_template: "",
      role: "",
      status: "",
      license_exp: null,
    },
  });

  useEffect(() => {
    setFormValue("department", item?.department);
    setFormValue("sub_unit", item?.sub_unit);
    setFormValue("location", item?.location);
    setFormValue("division", item?.division);
    setFormValue("division_category", item?.division_category);
    setFormValue("company", item?.company);
    setFormValue("trip_template", item?.trip_template);
    setFormValue("role", item?.role);
    setFormValue("status", item?.status);
    setFormValue("license_exp", item?.license_exp);

    return () => {
      null;
    };
  }, [item]);

  // FUNCTION
  const onSubmit = async (data) => {
    try {
      console.log(data);
      let res;
      const form = new FormData();
      (item?.profile != null || image?.imageFile.file != null) &&
        form.append("image", image?.imageFile.file);
      data?.permission &&
        form.append("permission", JSON.stringify(data.permission));
      form.append("employee_id", data.employee_id);
      form.append("first_name", data.first_name);
      form.append("last_name", data.last_name);
      form.append("username", data.username);
      form.append("password", data.password.length > 0 ? data.password : null);
      form.append("trip_template", data.trip_template);
      form.append("role", data.role);
      form.append("status", data.status);
      form.append("license_exp", data.license_exp);
      form.append("department", JSON.stringify(data.department));
      form.append("sub_unit", JSON.stringify(data.sub_unit));
      form.append("location", JSON.stringify(data.location));
      form.append("division", JSON.stringify(data.division));
      form.append("division_category", JSON.stringify(data.division_category));
      form.append("company", JSON.stringify(data.company));

      if (item) {
        res = await updateUser({ id: item._id, obj: form });
        console.log(res);
        !res?.error &&
          toast({
            severity: "success",
            message: `Success updating user ${data.first_name}`,
          });
      } else {
        res = await createUser(form);
        !res?.error &&
          toast({
            severity: "success",
            message: `Success creating user ${data.first_name}`,
          });
      }

      if (res?.error) {
        toast({
          severity: "error",
          message: res.error.data.error,
        });
      } else {
        onClose();
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
      onClose={onClose}
    >
      <ImageFormPicker item={item} image={image} setImage={setImage} />

      <InputField
        {...register("employee_id")}
        id="employee_id"
        label="Employee Id"
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

      <AutoFormPicker
        control={control}
        options={department}
        name="department"
        label="Department"
        errors={errors}
      />

      <AutoFormPicker
        control={control}
        options={subUnit}
        name="sub_unit"
        label="Sub Unit"
        errors={errors}
      />

      <AutoFormPicker
        control={control}
        options={locations}
        name="location"
        label="Location"
        errors={errors}
      />

      <AutoFormPicker
        control={control}
        options={divisions}
        name="division"
        label="Division"
        errors={errors}
        showId={false}
      />

      <AutoFormPicker
        control={control}
        options={divisionCategory}
        name="division_category"
        label="Division Category"
        errors={errors}
        showId={false}
      />

      <AutoFormPicker
        control={control}
        options={company}
        name="company"
        label="Company"
        errors={errors}
        showId={false}
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

      {watch("role") === "admin" && (
        <>
          <Controller
            name="permission"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Autocomplete
                size="small"
                multiple
                defaultValue={item?.permission ? item.permission : []}
                options={permission}
                disableCloseOnSelect
                getOptionLabel={(option) => option.label}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.label}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Permission" />
                )}
                onChange={(e, value) => onChange(value)}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                sx={{
                  minWidth: name === "search_by" && "200px",
                  "& .MuiOutlinedInput-root": {
                    "& > fieldset": {
                      borderColor: errors["permission"] && "error.main",
                    },
                  },
                }}
              />
            )}
          />
        </>
      )}
    </DrawerWrapper>
  );
};

export default memo(UserDrawer);
