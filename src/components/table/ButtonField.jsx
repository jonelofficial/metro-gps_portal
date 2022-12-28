import React from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import PublishIcon from "@mui/icons-material/Publish";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Box, Button, IconButton, Tooltip } from "@mui/material";

const ButtonField = ({
  handleRefresh,
  handleToggleExport,
  handleCreate,
  handleToggleImport,
}) => {
  return (
    <>
      <Box className="table__button-wrapper">
        <Tooltip title="Refresh">
          <IconButton sx={{ marginRight: "15px" }} onClick={handleRefresh}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Import">
          <IconButton sx={{ marginRight: "15px" }} onClick={handleToggleImport}>
            <PublishIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Export">
          <IconButton sx={{ marginRight: "15px" }} onClick={handleToggleExport}>
            <FileDownloadIcon />
          </IconButton>
        </Tooltip>
        <Button
          variant="contained"
          color="customSuccess"
          onClick={handleCreate}
          endIcon={<AddIcon />}
        >
          Create
        </Button>
      </Box>
    </>
  );
};

export default ButtonField;
