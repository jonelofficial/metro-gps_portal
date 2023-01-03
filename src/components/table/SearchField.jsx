import { Autocomplete, Box, Button, TextField } from "@mui/material";
import React from "react";
import AutoFormPicker from "../form/AutoFormPicker";
import InputField from "../form/InputField";
import SearchIcon from "@mui/icons-material/Search";

const SearchField = ({ onSubmit, control, errors, register, options }) => {
  return (
    <form onSubmit={onSubmit} className="table__filter-wrapper">
      <AutoFormPicker
        control={control}
        options={options}
        name="search_by"
        label="Search By"
        errors={errors}
        showId={false}
        sx={{ marginRight: "10px", minWidth: "200px" }}
      />
      <InputField
        {...register("search")}
        id="search"
        label="Search"
        autoComplete="off"
        errors={errors}
        className="filter-textfield"
        size="small"
        sx={{ marginRight: "10px" }}
      />
      <Button
        className="filter-button"
        variant="contained"
        startIcon={<SearchIcon />}
        type="submit"
      >
        Search
      </Button>
    </form>
  );
};

export default SearchField;
