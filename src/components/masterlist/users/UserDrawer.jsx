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
import DateFormPicker from "../../form/DateFormPicker";
import ImageFormPicker from "../../form/ImageFormPicker";
import { Controller, useForm } from "react-hook-form";
import DrawerWrapper from "../../drawer/DrawerWrapper";
import useToast from "../../../hook/useToast";
import {
  Autocomplete,
  Box,
  Checkbox,
  createFilterOptions,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { permission } from "../../../utility/permission";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

import {
  useGetEmployeeQuery,
  useGetEmployeesQuery,
} from "../../../api/sedarApi";

const UserDrawer = ({ onClose, item }) => {
  //
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  // STATE
  const [image, setImage] = useState();
  const [radioBtnValue, setRadioBtnValue] = useState(
    item?.show_all_departments === false ||
      item?.show_all_departments === undefined
      ? "no"
      : "yes"
  );
  const onChangeRadioBtn = (e) => {
    setRadioBtnValue(e.target.value);
  };

  let singleEmployee, singleEmployeeLoading;

  if (item?.employee_id) {
    const prerix = item.employee_id.split("-")[0];
    const id_number = item.employee_id.split("-")[1];
    ({ data: singleEmployee, isLoading: singleEmployeeLoading } =
      useGetEmployeeQuery({
        prefix: prerix,
        id_number: id_number,
      }));
  }

  // RTK QUERY
  const [createUser, { isLoading }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const { data = [], isLoading: employeeLoading } = useGetEmployeesQuery();

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
      employee_id: null,
      trip_template: "",
      role: "",
      status: "",
      license_exp: null,
    },
  });

  useEffect(() => {
    if (item?.employee_id && singleEmployee) {
      setFormValue("employee_id", {
        general_info: {
          full_id_number: singleEmployee[0]?.general_info?.full_id_number,
        },
      });
      setFormValue("first_name", singleEmployee[0]?.general_info?.first_name);
      setFormValue("last_name", singleEmployee[0]?.general_info?.last_name);
      setFormValue("department", singleEmployee[0]?.unit_info?.department_name);
      setFormValue("sub_unit", singleEmployee[0]?.unit_info?.subunit_name);
      setFormValue("location", singleEmployee[0]?.unit_info?.location_name);
      setFormValue("division", singleEmployee[0]?.unit_info?.division_name);
      setFormValue(
        "division_category",
        singleEmployee[0]?.unit_info?.category_name
      );
      setFormValue("company", singleEmployee[0]?.unit_info?.company_name);
      setFormValue("trip_template", item?.trip_template);
      setFormValue("role", item?.role);
      setFormValue("status", item?.status);
      setFormValue("license_exp", item?.license_exp);
      setFormValue("permission", item?.permission);
    }

    return () => {
      null;
    };
  }, [singleEmployee]);

  // FUNCTION
  const onSubmit = async (data) => {
    try {
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
      form.append("department", data.department);
      form.append("sub_unit", data.sub_unit);
      form.append("location", data.location);
      form.append("division", data.division);
      form.append("division_category", data.division_category);
      form.append("company", data.company);
      form.append(
        "show_all_departments",
        radioBtnValue === "no" ? false : true
      );
      if (item) {
        res = await updateUser({ id: item._id, obj: form });
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
  const filterOptions = createFilterOptions({
    limit: 50,
    matchFrom: "any",
  });

  return (
    <DrawerWrapper
      title={item ? "Update User" : "Create User"}
      color={item ? "customWarning" : "customSuccess"}
      loading={item ? isUpdating : isLoading}
      onSubmit={handleSubmit(onSubmit)}
      onClose={onClose}
    >
      <ImageFormPicker item={item} image={image} setImage={setImage} />

      <Controller
        control={control}
        name="employee_id"
        render={({ field: { onChange, value } }) => {
          return (
            <>
              <Autocomplete
                required
                className="filter"
                size="small"
                loading={employeeLoading}
                options={data}
                value={value}
                getOptionLabel={(option) => option.general_info?.full_id_number}
                isOptionEqualToValue={(option, value) =>
                  option.general_info?.full_id_number ===
                  value.general_info?.full_id_number
                }
                renderInput={(params) => (
                  <TextField {...params} label="Employee ID" />
                )}
                onChange={(e, value) => {
                  onChange(value);

                  setFormValue("first_name", value?.general_info?.first_name);
                  setFormValue("last_name", value?.general_info?.last_name);
                  setFormValue("department", value?.unit_info?.department_name);

                  setFormValue("sub_unit", value?.unit_info?.subunit_name);
                  setFormValue("location", value?.unit_info?.location_name);
                  setFormValue("division", value?.unit_info?.division_name);
                  setFormValue(
                    "division_category",
                    value?.unit_info?.category_name
                  );
                  setFormValue("company", value?.unit_info?.company_name);
                }}
                filterOptions={filterOptions}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& > fieldset": {
                      borderColor: errors["employee_id"] && "error.main",
                    },
                  },
                }}
              />
              {errors["employee_id"] && (
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
                  {errors["employee_id"].message}
                </Typography>
              )}
            </>
          );
        }}
      />

      <InputField
        {...register("first_name")}
        id="first_name"
        label="First Name"
        autoComplete="off"
        errors={errors}
        defaultValue={item ? item.first_name : "Auto Fill"}
        disabled
      />

      <InputField
        {...register("last_name")}
        id="last_name"
        label="Last Name"
        autoComplete="off"
        errors={errors}
        sx={{ width: "100%" }}
        defaultValue={item ? item.last_name : "Auto Fill"}
        disabled
      />

      <InputField
        {...register("department")}
        id="department"
        label="Department"
        autoComplete="off"
        errors={errors}
        sx={{ width: "100%" }}
        defaultValue={item ? item.department : "Auto Fill"}
        disabled
      />

      <InputField
        {...register("sub_unit")}
        id="sub_unit"
        label="Sub Unit"
        autoComplete="off"
        errors={errors}
        sx={{ width: "100%" }}
        defaultValue={item ? item.sub_unit : "Auto Fill"}
        disabled
      />

      <InputField
        {...register("location")}
        id="location"
        label="Location"
        autoComplete="off"
        errors={errors}
        sx={{ width: "100%" }}
        defaultValue={item ? item.location : "Auto Fill"}
        disabled
      />

      <InputField
        {...register("division")}
        id="division"
        label="Division"
        autoComplete="off"
        errors={errors}
        sx={{ width: "100%" }}
        defaultValue={item ? item.division : "Auto Fill"}
        disabled
      />

      <InputField
        {...register("division_category")}
        id="division_category"
        label="Division Category"
        autoComplete="off"
        errors={errors}
        sx={{ width: "100%" }}
        defaultValue={item ? item.division_category : "Auto Fill"}
        disabled
      />

      <InputField
        {...register("company")}
        id="company"
        label="Company"
        autoComplete="off"
        errors={errors}
        sx={{ width: "100%" }}
        defaultValue={item ? item.company : "Auto Fill"}
        disabled
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
        // items={[
        //   { value: "office", label: "Office" },
        //   { value: "hauling", label: "Hauling" },
        //   { value: "delivery", label: "Delivery" },
        //   { value: "feeds_delivery", label: "Feeds Delivery" },
        // ]}
        items={[
          { value: "Service Vehicle", label: "Service Vehicle" },
          { value: "Depot", label: "Depot" },
          { value: "Live", label: "Live" },
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

          {/* RADIO BTN */}
          <Box sx={{ paddingLeft: "5px" }}>
            <FormLabel>Show all departments on the trip report</FormLabel>
            <RadioGroup
              row
              value={radioBtnValue}
              onChange={onChangeRadioBtn}
              sx={{
                "& .MuiSvgIcon-root": {
                  fontSize: 18,
                },
              }}
            >
              <FormControlLabel value="no" control={<Radio />} label="No" />
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            </RadioGroup>
          </Box>
        </>
      )}
    </DrawerWrapper>
  );
};

export default memo(UserDrawer);
