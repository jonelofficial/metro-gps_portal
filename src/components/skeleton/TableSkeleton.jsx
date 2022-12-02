import { Box, Skeleton, Stack } from "@mui/material";
import React from "react";
import "../../style/outlet/users/users.scss";

const TableSkeleton = () => {
  return (
    <Stack spacing={1} className="table">
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Skeleton variant="rounded" width={600} height={50} />
        <Skeleton variant="rounded" width={100} height={50} />
      </Box>
      <Skeleton variant="rounded" width="100%" height="50%" />
    </Stack>
  );
};

export default TableSkeleton;
