import { Cancel } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Slide,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { forwardRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  closeStaffDialog,
  createStaff,
  editStaff,
} from "../../store/staff/action";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StaffDialog = () => {
  const dispatch = useDispatch();
  const { dialog: open, dialogData: staff } = useSelector(
    (state) => state.staff,
  );
  const { roles } = useSelector((state) => state.role);

  const [name, setName] = useState(staff?.name || "");
  const [email, setEmail] = useState(staff?.email || "");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState(staff?.roleId || staff?.role?._id || "");

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    roleId: "",
  });

  useEffect(() => {
    if (!open) return;
    setName(staff?.name || "");
    setEmail(staff?.email || "");
    setPassword("");
    setRoleId(staff?.roleId || staff?.role?._id || "");
    setErrors({ name: "", email: "", password: "", roleId: "" });
  }, [open, staff?._id]);

  const validate = () => {
    const err = { name: "", email: "", password: "", roleId: "" };
    const nameTrim = (name || "").trim();
    const emailTrim = (email || "").trim();
    if (!nameTrim) err.name = "Name is required";
    if (!emailTrim) err.email = "Email is required";
    if (!staff?._id && !(password || "").trim()) {
      err.password = "Password is required for new staff";
    }
    if (!roleId) err.roleId = "Role is required";
    setErrors(err);
    return !Object.values(err).some(Boolean);
  };

  const handleSave = () => {
    if (!validate()) return;

    const payload = {
      name: (name || "").trim(),
      email: (email || "").trim(),
      roleId: roleId || undefined,
    };
    if ((password || "").trim()) payload.password = password.trim();

    if (
      staff?._id &&
      name.trim() === (staff?.name || "") &&
      email.trim() === (staff?.email || "") &&
      roleId === (staff?.roleId || staff?.role?._id) &&
      !password
    ) {
      toast.info("Nothing changed!");
      dispatch(closeStaffDialog());
      return;
    }

    if (staff?._id) {
      dispatch(
        editStaff({
          subAdminId: staff._id,
          ...payload,
        }),
      );
    } else {
      dispatch(createStaff(payload));
    }
  };

  const handleClose = () => {
    dispatch(closeStaffDialog());
    setErrors({ name: "", email: "", password: "", roleId: "" });
  };

  const mode = staff?._id ? "Edit" : "Create";

  const darkPaperSx = {
    overflow: "visible",
    width: "480px",
    maxWidth: "95vw",
    backgroundColor: "#1f1f2b",
    color: "#9a9cab",
  };

  const fieldSx = {
    "& .MuiInputBase-root": { color: "#9a9cab" },
    "& .MuiInputLabel-root": { color: "#9a9cab" },
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#262635" },
    "& .MuiFormHelperText-root": { color: "#9a9cab" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#e8538f" },
    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#e8538f",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#e8538f",
    },
    "& .MuiSelect-select": { color: "#9a9cab" },
  };

  return (
    <Dialog
      open={open}
      keepMounted
      onClose={handleClose}
      TransitionComponent={Transition}
      PaperProps={{ sx: darkPaperSx }}
    >
      <DialogTitle sx={{ pr: 10, color: "#9a9cab" }}>
        <Typography variant="h5" component="span" sx={{ color: "#9a9cab" }}>
          {mode} Staff
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

      <DialogContent sx={{ pt: 0, color: "#9a9cab" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 1 }}>
          <TextField
            fullWidth
            label="Name"
            placeholder="Staff name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
            }}
            error={!!errors.name}
            helperText={errors.name || " "}
            sx={fieldSx}
          />
          <TextField
            fullWidth
            type="email"
            label="Email"
            placeholder="staff@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
            }}
            error={!!errors.email}
            helperText={errors.email || " "}
            // disabled={!!staff?._id}
            sx={fieldSx}
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            placeholder={
              staff?._id
                ? "Leave blank to keep current"
                : "Required for new staff"
            }
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password)
                setErrors((prev) => ({ ...prev, password: "" }));
            }}
            error={!!errors.password}
            helperText={errors.password || " "}
            sx={fieldSx}
          />
          <FormControl fullWidth error={!!errors.roleId} sx={fieldSx}>
            <InputLabel id="staff-role-label">Role</InputLabel>
            <Select
              labelId="staff-role-label"
              label="Role"
              value={roleId}
              sx={{ color: "#9a9cab" }}
              onChange={(e) => {
                setRoleId(e.target.value);
                if (errors.roleId)
                  setErrors((prev) => ({ ...prev, roleId: "" }));
              }}
            >
              {(roles || []).map((r) => (
                <MenuItem key={r._id} value={r._id} sx={{ color: "#9a9cab" }}>
                  {r.name}
                </MenuItem>
              ))}
            </Select>
            {errors.roleId && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mt: 0.5, ml: 1.5 }}
              >
                {errors.roleId}
              </Typography>
            )}
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions className="p-3" sx={{ borderTop: "1px solid #262635" }}>
        <Button
          variant="outlined"
          onClick={handleClose}
          sx={{
            color: "#9a9cab",
            borderColor: "#262635",
            "&:hover": { borderColor: "#e8538f", color: "#e8538f" },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            backgroundColor: "#e8538f",
            "&:hover": { backgroundColor: "#d9457a" },
          }}
        >
          {mode === "Edit" ? "Update Staff" : "Create Staff"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StaffDialog;
