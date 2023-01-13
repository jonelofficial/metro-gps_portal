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
import React, { memo } from "react";
import { useDeleteUserMutation } from "../../../api/metroApi";
import useToast from "../../../hook/useToast";
import TableAction from "../../table/TableAction";
import useDisclosure from "../../../hook/useDisclosure";
import ImageViewer from "../../table/ImageViewer";
import UserDrawer from "./UserDrawer";
import useQrCode from "../../../hook/useQrCode";

const TableUsers = ({ item, columns }) => {
  // RTK QUERY
  const [deleteUser, { isLoading }] = useDeleteUserMutation();

  // HOOKS
  const { isOpen, onClose, onToggle } = useDisclosure();
  const {
    isOpen: isOpenAction,
    onClose: onCloseAction,
    onToggle: onToggleAction,
  } = useDisclosure();
  const drawerDisclosure = useDisclosure();
  const { toast } = useToast();

  // FUNCTION

  const { handleDownloadQr, qr, a } = useQrCode(
    {
      username: item.username,
      password: item.password,
    },
    item.employee_id
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
              {column.id === "profile" && value != null ? (
                <Button onClick={onToggle}>View</Button>
              ) : column.id === "qrcode" ? (
                <>
                  {qr}
                  <Button onClick={handleDownloadQr}>{a}Download</Button>
                </>
              ) : column.id === "action" ? (
                <TableAction
                  handleOpen={onToggleAction}
                  drawerDisclosure={drawerDisclosure}
                  drawer={
                    <UserDrawer
                      onClose={drawerDisclosure.onClose}
                      item={item}
                    />
                  }
                />
              ) : column.id === "createdAt" ? (
                value == null ? null : (
                  dayjs(value).format("MMM-DD-YYYY")
                )
              ) : column.id === "license_exp" ? (
                value == null ? null : (
                  dayjs(value).format("MMM-DD-YYYY")
                )
              ) : column.id === "department" ? (
                value?.label
              ) : column.id === "sub_unit" ? (
                value?.label
              ) : column.id === "location" ? (
                value?.label
              ) : column.id === "division" ? (
                value?.label
              ) : column.id === "division_category" ? (
                value?.label
              ) : column.id === "company" ? (
                value?.label
              ) : column.id === "permission" ? (
                value?.map((item, i) => {
                  return <Box key={i}>{item.label}</Box>;
                })
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
                {` Are you sure you want to delete the " ${item.first_name} " record ? This action cannot be undone.`}
              </Typography>
              <Box
                sx={{
                  marginTop: 2,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                }}
              >
                <Button onClick={onCloseAction} color="customDanger">
                  Cancel
                </Button>
                <LoadingButton
                  onClick={() => {
                    deleteUser(item._id);
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

export default memo(TableUsers);
