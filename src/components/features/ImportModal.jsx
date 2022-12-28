import { LoadingButton } from "@mui/lab";
import { Box, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

const ImportModal = ({ func, isImporting, isOpenImport, onCloseImport }) => {
  const [excelFile, setExcelFile] = useState({});

  useEffect(() => {
    if (!isOpenImport) {
      setExcelFile({});
    }

    return () => {
      setExcelFile({});
    };
  }, [isOpenImport]);

  return (
    <Modal
      open={isOpenImport}
      onClose={() => !excelFile?.name && onCloseImport()}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxWidth: 620,
          bgcolor: "white",
          boxShadow: 24,
          borderRadius: 3,
          p: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Typography>{excelFile?.name}</Typography>
          <LoadingButton
            component="label"
            loading={excelFile?.name <= 0 || isImporting}
          >
            Upload Excel File
            <input
              type="file"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={(e) => {
                func(e.target.files[0]);
                setExcelFile(e.target.files[0]);
              }}
              hidden
            />
          </LoadingButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default ImportModal;
