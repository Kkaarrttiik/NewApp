import { Cancel } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Slide,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { forwardRef } from "react";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const getColorByAction = (action) => {
  const a = String(action).toLowerCase();
  if (a === "list" || a.includes("view") || a === "read") return "info";
  if (a === "create" || a.includes("add")) return "primary";
  if (a === "edit" || a.includes("update")) return "warning";
  if (a === "delete" || a.includes("remove")) return "error";
  return "secondary";
};

const PermissionShowDialog = ({ open, onClose, role }) => {
  const handleClose = () => {
    onClose();
  };

  const permissions = role?.permissions || [];
  const roleName = role?.name || "Role";

  return (
    <Dialog
      open={open}
      keepMounted
      scroll="paper"
      onClose={handleClose}
      TransitionComponent={Transition}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          overflow: "visible",
          width: "600px",
          maxWidth: "95vw",
          backgroundColor: "#1f1f2b",
          color: "#9a9cab",
        },
      }}
    >
      <DialogTitle sx={{ pr: 8, color: "#9a9cab" }}>
        <Typography variant="h5" component="span" sx={{ color: "#9a9cab" }}>
          {roleName} Permissions
        </Typography>
        <Typography
          variant="body1"
          component="div"
          className="mt-2"
          sx={{ color: "#9a9cab" }}
        >
          This role has access to {permissions.length} module
          {permissions.length === 1 ? "" : "s"} with various permission levels.
        </Typography>
        <IconButton
          sx={{ position: "absolute", right: 10, top: 10 }}
          size="small"
        >
          <Tooltip title="Close">
            <Cancel className="text-danger" onClick={handleClose} />
          </Tooltip>
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          pt: 2,
          color: "#9a9cab",
          borderColor: "#262635",
        }}
      >
        <Stack spacing={2}>
          {permissions.length === 0 ? (
            <Typography sx={{ color: "#9a9cab" }}>
              No permissions assigned.
            </Typography>
          ) : (
            permissions.map((permission, index) => (
              <Paper
                key={`${permission.module}-${index}`}
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "#181821",
                  borderColor: "#262635",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 1,
                    mb: 1.5,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    sx={{ color: "#9a9cab" }}
                  >
                    {permission.module}
                  </Typography>
                  <Chip
                    size="small"
                    label={`${(permission.actions || []).length} action(s)`}
                    variant="outlined"
                    sx={{
                      color: "#ada6f2",
                      borderColor: "#ada6f2",
                      "& .MuiChip-label": { color: "#ada6f2" },
                    }}
                  />
                </Box>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {(permission.actions || []).map((action, idx) => {
                    const chipColor = getColorByAction(action);
                    const colorMap = {
                      primary: "#86c1ed",
                      info: "#86c1ed",
                      warning: "#f5af47",
                      error: "#e8538f",
                      secondary: "#9a9cab",
                    };
                    const chipColorVal = colorMap[chipColor] || "#9a9cab";
                    return (
                      <Chip
                        key={`${permission.module}-${action}-${idx}`}
                        label={action}
                        variant="outlined"
                        size="small"
                        sx={{
                          textTransform: "capitalize",
                          color: chipColorVal,
                          borderColor: chipColorVal,
                          "& .MuiChip-label": { color: chipColorVal },
                        }}
                      />
                    );
                  })}
                </Stack>
              </Paper>
            ))
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ pt: 2, borderTop: "1px solid #262635" }}>
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{
            backgroundColor: "#e8538f",
            "&:hover": { backgroundColor: "#d9457a" },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PermissionShowDialog;
