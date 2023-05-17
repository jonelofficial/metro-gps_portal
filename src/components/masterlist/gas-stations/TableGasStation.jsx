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
import React from "react";
import { useDeleteGasStationMutation } from "../../../api/metroApi";
import useDisclosure from "../../../hook/useDisclosure";
import useToast from "../../../hook/useToast";
import TableAction from "../../table/TableAction";

const TableGasStation = ({ item, columns }) => {
  const drawerDisclosure = useDisclosure();
  const { isOpen, onClose, onToggle } = useDisclosure();
  const { toast } = useToast();

  const [deleteGasStation, { isLoading }] = useDeleteGasStationMutation();

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
          if (
            value === "Others" ||
            (column.id === "action" && item["label"] === "Others")
          ) {
            return;
          }
          return (
            <TableCell
              key={column.id}
              size="small"
              style={{
                whiteSpace: "nowrap",
                height: item["label"] === "Others" && "32px",
                textTransform: "capitalize",
              }}
            >
              {column.id === "action" && item["label"] !== "Others" ? (
                <TableAction item={item} />
              ) : (
                value
              )}
            </TableCell>
          );
        })}
      </StyledTableRow>
      <Modal open={isOpen} onClose={onClose}>
        <Box className="table__modal">
          <Typography id="modal-modal-title" variant="h6">
            {` Are you sure you want to delete the " ${item.label} " record ? This action cannot be undone.`}
          </Typography>
          <Box
            sx={{
              marginTop: 2,
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
            }}
          >
            <Button onClick={onClose} color="customDanger">
              Cancel
            </Button>
            <LoadingButton
              onClick={() => {
                deleteGasStation(item._id);
                onClose();
                toast({
                  severity: "success",
                  message: `Success deleting gas station ${item.first_name}`,
                });
              }}
              variant="contained"
              color="customDanger"
              loading={isLoading}
            >
              Delete
            </LoadingButton>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default TableGasStation;
