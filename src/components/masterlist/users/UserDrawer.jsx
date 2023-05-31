import React, { memo, useState } from "react";
import InputField from "../../form/InputField";
import { yupResolver } from "@hookform/resolvers/yup";
import { userSchema, userUpdateSchema } from "../../../utility/schema";
import {
  useCreateUserMutation,
  useGetAllTripTemplateQuery,
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
  Drawer,
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

import { useGetEmployeesQuery } from "../../../api/sedarApi";
import { useDispatch, useSelector } from "react-redux";
import { onClose } from "../../../redux-toolkit/counter/drawerDisclosure";
import axios from "axios";
import useDisclosure from "../../../hook/useDisclosure";

const UserDrawer = () => {
  const isDrawerOpen = useSelector((state) => state.drawer.value);
  const item = useSelector((state) => state.drawer.drawerState);
  const dispatch = useDispatch();

  const {
    isOpen: isLoadingEmployee,
    onClose: stopLoadingEmployee,
    onToggle: toggleLoadingEmployee,
  } = useDisclosure();

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

  useEffect(() => {
    (async () => {
      await getEmployee();
    })();
    return () => {
      null;
    };
  }, [item]);

  const getEmployee = async () => {
    let prefix, idNumber;

    if (item?.employee_id) {
      toggleLoadingEmployee();

      const arrayEmployeeId = item.employee_id.split("-");
      if (arrayEmployeeId.length > 2) {
        prefix = `${arrayEmployeeId[0]}-${arrayEmployeeId[1]}`;
        idNumber = arrayEmployeeId[arrayEmployeeId.length - 1];
      } else {
        prefix = arrayEmployeeId[0];
        idNumber = arrayEmployeeId[arrayEmployeeId.length - 1];
      }

      const res = await axios.get(
        `${process.env.SEDAR_API}/data/employee/filter/idnumber?prefix_id=${prefix}&id_number=${idNumber}`,
        {
          headers: { Authorization: `Bearer ${process.env.SEDAR_KEY}` },
        }
      );

      const employeeData = res?.data?.data[0];

      if (!employeeData) {
        dispatch(onClose());
        toast({
          severity: "error",
          message: "No data found. Pleas try again.",
        });
        return stopLoadingEmployee();
      }

      setFormValue("employee_id", {
        general_info: {
          full_id_number: employeeData?.general_info?.full_id_number,
        },
      });
      setFormValue("first_name", employeeData?.general_info?.first_name);
      setFormValue("last_name", employeeData?.general_info?.last_name);
      setFormValue("department", employeeData?.unit_info?.department_name);
      setFormValue("sub_unit", employeeData?.unit_info?.subunit_name);
      setFormValue("location", employeeData?.unit_info?.location_name);
      setFormValue("division", employeeData?.unit_info?.division_name);
      setFormValue("division_category", employeeData?.unit_info?.category_name);
      setFormValue("company", employeeData?.unit_info?.company_name);
      setFormValue("trip_template", { template: item?.trip_template || "" });
      setFormValue("username", item?.username);
      setFormValue("role", item?.role);
      setFormValue("status", item?.status);
      setFormValue("license_exp", item?.license_exp);
      setFormValue("permission", item?.permission);

      stopLoadingEmployee();
    } else {
      reset();
    }
  };

  // RTK QUERY
  const [createUser, { isLoading }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const { data = [], isLoading: employeeLoading } = useGetEmployeesQuery();
  const { data: tripTemplate = [], isLoading: tripTemplateLoading } =
    useGetAllTripTemplateQuery(
      {
        page: 1,
        limit: 0,
      },
      { refetchOnMountOrArgChange: true }
    );

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
    clearErrors,
    reset,
  } = useForm({
    resolver: yupResolver(item ? userUpdateSchema : userSchema),
    mode: "onSubmit",
    defaultValues: {
      employee_id: null,
      trip_template: { template: "" },
      role: "",
      status: "",
      license_exp: null,
    },
  });

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
        dispatch(onClose());
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
        title={item ? "Update User" : "Create User"}
        color={item ? "customWarning" : "customSuccess"}
        loading={item ? isUpdating : isLoading || isLoadingEmployee}
        disabled={isLoading || isLoadingEmployee}
        onSubmit={handleSubmit(onSubmit)}
        onClose={() => {
          dispatch(onClose());
          clearErrors();
        }}
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
                  disabled={isLoadingEmployee}
                  options={data}
                  value={value}
                  getOptionLabel={(option) =>
                    option.general_info?.full_id_number
                  }
                  isOptionEqualToValue={(option, value) =>
                    option.general_info?.full_id_number ===
                    value.general_info?.full_id_number
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={isLoadingEmployee ? "Loading..." : "Employee ID"}
                    />
                  )}
                  onChange={(e, value) => {
                    onChange(value);

                    setFormValue("first_name", value?.general_info?.first_name);
                    setFormValue("last_name", value?.general_info?.last_name);
                    setFormValue(
                      "department",
                      value?.unit_info?.department_name
                    );

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
          defaultValue={"Auto Fill"}
          disabled
        />

        <InputField
          {...register("last_name")}
          id="last_name"
          label="Last Name"
          autoComplete="off"
          errors={errors}
          sx={{ width: "100%" }}
          defaultValue={"Auto Fill"}
          disabled
        />

        <InputField
          {...register("department")}
          id="department"
          label="Department"
          autoComplete="off"
          errors={errors}
          sx={{ width: "100%" }}
          defaultValue={"Auto Fill"}
          disabled
        />

        <InputField
          {...register("sub_unit")}
          id="sub_unit"
          label="Sub Unit"
          autoComplete="off"
          errors={errors}
          sx={{ width: "100%" }}
          defaultValue={"Auto Fill"}
          disabled
        />

        <InputField
          {...register("location")}
          id="location"
          label="Location"
          autoComplete="off"
          errors={errors}
          sx={{ width: "100%" }}
          defaultValue={"Auto Fill"}
          disabled
        />

        <InputField
          {...register("division")}
          id="division"
          label="Division"
          autoComplete="off"
          errors={errors}
          sx={{ width: "100%" }}
          defaultValue={"Auto Fill"}
          disabled
        />

        <InputField
          {...register("division_category")}
          id="division_category"
          label="Division Category"
          autoComplete="off"
          errors={errors}
          sx={{ width: "100%" }}
          defaultValue={"Auto Fill"}
          disabled
        />

        <InputField
          {...register("company")}
          id="company"
          label="Company"
          autoComplete="off"
          errors={errors}
          sx={{ width: "100%" }}
          defaultValue={"Auto Fill"}
          disabled
        />

        <InputField
          {...register("username")}
          id="username"
          label="Username"
          autoComplete="off"
          errors={errors}
          defaultValue={item?.username}
          sx={{ width: "100%" }}
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
        {/* 
        <FormPicker
          control={control}
          name="trip_template"
          label="Trip Template"
          items={[
            { value: "Service Vehicle", label: "Service Vehicle" },
            { value: "Depot", label: "Depot" },
            { value: "Live", label: "Live" },
          ]}
          errors={errors}
        /> */}

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
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
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
    </Drawer>
  );
};

export default memo(UserDrawer);
