import { LoadingButton } from "@mui/lab";
import {
  Button,
  Modal,
  styled,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import dayjs from "dayjs";
import React from "react";
import { useDeleteVehicleMutation } from "../../../api/metroApi";
import useDisclosure from "../../../hook/useDisclosure";
import useQrCode from "../../../hook/useQrCode";
import useToast from "../../../hook/useToast";
import ImageViewer from "../../table/ImageViewer";
import TableAction from "../../table/TableAction";
import VehicleDrawer from "./VehicleDrawer";

const TableVehicles = ({ item, columns }) => {
  const { toast } = useToast();

  const { isOpen, onClose, onToggle } = useDisclosure();
  const {
    isOpen: isOpenAction,
    onClose: onCloseAction,
    onToggle: onToggleAction,
  } = useDisclosure();
  const drawerDisclosure = useDisclosure();

  const [deleteVehicle, { isLoading }] = useDeleteVehicleMutation();

  // FUNCTION
  const { handleDownloadQr, qr, a } = useQrCode(
    {
      vehicle_id: item.plate_no,
    },
    item.plate_no
  );

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },

    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));
  return (
    <>
      <StyledTableRow
        hover
        role="checkbox"
        tabIndex={-1}
        sx={{ height: "10px" }}
      >
        {columns.map((column) => {
          const value = item[column.id];
          return (
            <TableCell
              key={column.id}
              size="small"
              style={{ whiteSpace: "nowrap" }}
            >
              {column.id === "createdAt" ? (
                value && dayjs(value).format("MMM-DD-YYYY")
              ) : column.id === "action" ? (
                <TableAction
                  handleOpen={onToggleAction}
                  drawerDisclosure={drawerDisclosure}
                  drawer={
                    <VehicleDrawer
                      onClose={drawerDisclosure.onClose}
                      item={item}
                    />
                  }
                />
              ) : column.id === "department" ? (
                value?.label
              ) : column.id === "profile" && value != null ? (
                <Button
                  onClick={() => {
                    onToggle();
                  }}
                >
                  View
                </Button>
              ) : column.id === "qrcode" ? (
                <>
                  {qr}
                  <Button onClick={handleDownloadQr}>{a}Download</Button>
                </>
              ) : (
                value
              )}
            </TableCell>
          );
        })}
      </StyledTableRow>

      <Modal open={isOpen || isOpenAction} onClose={onClose}>
        <Box className="table__modal">
          {isOpen ? (
            <ImageViewer
              onClose={onClose}
              img={`${process.env.BASEURL}/${item.profile}`}
            />
          ) : (
            <>
              <Typography id="modal-modal-title" variant="h6">
                {` Are you sure you want to delete the " ${item.plate_no} " record ? This action cannot be undone.`}
              </Typography>
              <Box
                sx={{
                  marginTop: 2,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                }}
              >
                <Button onClick={() => onCloseAction()} color="customDanger">
                  Cancel
                </Button>
                <LoadingButton
                  onClick={() => {
                    deleteVehicle(item._id);
                    onCloseAction();
                    toast({
                      severity: "success",
                      message: `Success deleting user  ${item.first_name}`,
                    });
                  }}
                  variant="contained"
                  color="customDanger"
                  loading={isLoading}
                >
                  Delete
                </LoadingButton>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default TableVehicles;
