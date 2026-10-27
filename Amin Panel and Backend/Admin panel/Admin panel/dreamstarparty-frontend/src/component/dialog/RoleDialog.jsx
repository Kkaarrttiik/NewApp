import { Cancel } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Slide,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  closeRoleDialog,
  createNewRole,
  editRole,
} from "../../store/role/action";
import { adminModulesConfigForRole } from "../../util/constants";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ACTIONS = ["List", "Create", "Edit", "Delete"];

const emptyRow = () => ({
  List: false,
  Create: false,
  Edit: false,
  Delete: false,
});

const RoleDialog = () => {
  const dispatch = useDispatch();
  const { dialog: open, dialogData: role } = useSelector((state) => state.role);

  const { uniqueModules, sections } = adminModulesConfigForRole;

  const initialPerms = useMemo(() => {
    const base = {};
    uniqueModules.forEach((m) => {
      base[m.key] = emptyRow();
    });

    if (role?.permissions?.length) {
      for (const p of role.permissions) {
        const modKey = p.module;
        const row = emptyRow();
        (p.actions || []).forEach((a) => {
          const match = ACTIONS.find(
            (x) => x.toLowerCase() === String(a).toLowerCase(),
          );
          if (match) row[match] = true;
        });
        if (base[modKey]) {
          base[modKey] = row;
        }
      }
    }
    return base;
  }, [role, uniqueModules]);

  const [name, setName] = useState(role?.name || "");
  const [errors, setErrors] = useState({ name: "" });
  const [perms, setPerms] = useState(initialPerms);
  const [initialState, setInitialState] = useState(null);

  useEffect(() => {
    if (!open) return;
    setName(role?.name || "");
    setPerms(initialPerms);

    setInitialState({
      name: role?.name || "",
      permissions: toPermissionsArray(initialPerms),
    });
  }, [open, role?._id, initialPerms]);

  const enabledCount = useMemo(
    () =>
      Object.values(perms).filter((p) => Object.values(p).some(Boolean)).length,
    [perms],
  );

  const validateName = (v) => {
    const s = (v || "").trim();
    if (!s) return "Role name is required";
    if (s.length < 3) return "Minimum 3 characters";
    if (s.length > 50) return "Maximum 50 characters";
    return undefined;
  };

  const toggleAction = useCallback((key, action) => {
    setPerms((prev) => ({
      ...prev,
      [key]: { ...prev[key], [action]: !prev[key][action] },
    }));
  }, []);

  const toggleRowAll = useCallback((key, value) => {
    setPerms((prev) => ({
      ...prev,
      [key]: ACTIONS.reduce((acc, a) => {
        acc[a] = !!value;
        return acc;
      }, {}),
    }));
  }, []);

  const getRowAllState = useCallback(
    (key) => {
      const row = perms[key] || emptyRow();
      const values = Object.values(row);
      const all = values.every(Boolean);
      const none = values.every((v) => !v);
      return { all, indeterminate: !all && !none };
    },
    [perms],
  );

  const sectionRows = useMemo(() => {
    const map = {};
    sections.forEach((section) => {
      map[section] = uniqueModules
        .filter((m) => m.section === section)
        .map((m) => m.key);
    });
    return map;
  }, [sections, uniqueModules]);

  const getSectionAllState = useCallback(
    (section) => {
      const keys = sectionRows[section] || [];
      if (!keys.length) return { all: false, indeterminate: false };
      const allRowsAll = keys.every((k) =>
        Object.values(perms[k] || {}).every(Boolean),
      );
      const allRowsNone = keys.every((k) =>
        Object.values(perms[k] || {}).every((v) => !v),
      );
      return {
        all: allRowsAll,
        indeterminate: !allRowsAll && !allRowsNone,
      };
    },
    [sectionRows, perms],
  );

  const setSectionAll = useCallback(
    (section, value) => {
      const keys = sectionRows[section] || [];
      setPerms((prev) => {
        const next = { ...prev };
        keys.forEach((k) => {
          next[k] = ACTIONS.reduce((acc, a) => {
            acc[a] = !!value;
            return acc;
          }, {});
        });
        return next;
      });
    },
    [sectionRows],
  );

  const toPermissionsArray = useCallback((state) => {
    return Object.entries(state)
      .map(([moduleKey, row]) => {
        const actions = ACTIONS.filter((a) => row[a]);
        if (!actions.length) return null;
        return { module: moduleKey, actions };
      })
      .filter(Boolean);
  }, []);

  const handleSave = () => {
    const nameErr = validateName(name);
    setErrors({ name: nameErr || "" });
    if (nameErr) return;

    const permissions = toPermissionsArray(perms);
    const payload = { name: name.trim(), permissions };

    if (
      role?._id &&
      initialState &&
      name.trim() === initialState.name &&
      JSON.stringify(permissions) === JSON.stringify(initialState.permissions)
    ) {
      toast.info("Nothing changed!");
      dispatch(closeRoleDialog());
      return;
    }

    if (role?._id) {
      dispatch(editRole({ roleId: role._id, ...payload }));
    } else {
      dispatch(createNewRole(payload));
    }
  };

  const handleClose = () => {
    dispatch(closeRoleDialog());
    setErrors({ name: "" });
  };

  const mode = role?._id ? "Edit" : "Create";

  const darkPaperSx = {
    overflow: "visible",
    width: "650px",
    maxWidth: "95vw",
    backgroundColor: "#1f1f2b",
    color: "#9a9cab",
  };

  const darkTableSx = {
    backgroundColor: "#181821",
    "& .MuiTableCell-head": {
      backgroundColor: "#262635",
      color: "#9a9cab",
      fontWeight: 600,
      borderColor: "#262635",
    },
    "& .MuiTableCell-body": {
      color: "#9a9cab",
      borderColor: "#262635",
    },
    "& .MuiTableRow-hover:hover": {
      backgroundColor: "#262635",
    },
  };

  return (
    <Dialog
      open={open}
      keepMounted
      scroll="paper"
      onClose={handleClose}
      TransitionComponent={Transition}
      fullWidth
      maxWidth="lg"
      PaperProps={{ sx: darkPaperSx }}
    >
      <DialogTitle sx={{ pr: 10, color: "#9a9cab" }}>
        <Typography variant="h5" component="span" sx={{ color: "#9a9cab" }}>
          {mode} Role
        </Typography>
        <Typography
          variant="body1"
          component="div"
          className="mt-2"
          sx={{ color: "#9a9cab" }}
        >
          This role has access to {enabledCount} module
          {enabledCount === 1 ? "" : "s"} with various permission levels.
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
        <Box sx={{ mb: 3, mt: 3 }}>
          <TextField
            fullWidth
            label="Role Name"
            placeholder="Enter Role Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
            }}
            error={!!errors.name}
            helperText={errors.name || " "}
            sx={{
              "& .MuiInputBase-root": { color: "#9a9cab" },
              "& .MuiInputLabel-root": { color: "#9a9cab" },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#262635" },
              "& .MuiFormHelperText-root": { color: "#9a9cab" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#e8538f" },
              "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                { borderColor: "#e8538f" },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                { borderColor: "#e8538f" },
            }}
          />
        </Box>

        <Divider sx={{ mb: 3, borderColor: "#262635" }} />

        <Stack spacing={4}>
          {sections.map((section) => {
            const rowsInSection = uniqueModules.filter(
              (m) => m.section === section,
            );
            if (!rowsInSection.length) return null;
            const { all, indeterminate } = getSectionAllState(section);

            return (
              <Box key={section}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mb: 1.5, gap: 2, flexWrap: "wrap" }}
                >
                  <Typography variant="h6" sx={{ color: "#9a9cab" }}>
                    {section}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Typography variant="body2" sx={{ color: "#9a9cab" }}>
                      Grant all in section
                    </Typography>
                    <Checkbox
                      checked={all}
                      indeterminate={indeterminate}
                      onChange={(_, v) => setSectionAll(section, v)}
                      inputProps={{
                        "aria-label": `Grant all in ${section}`,
                      }}
                      sx={{
                        color: "#9a9cab",
                        "&.Mui-checked": { color: "#e8538f" },
                        "&.MuiCheckbox-indeterminate": { color: "#e8538f" },
                      }}
                    />
                  </Stack>
                </Stack>

                <TableContainer
                  component={Paper}
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    backgroundColor: "#181821",
                    borderColor: "#262635",
                    ...darkTableSx,
                  }}
                >
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, width: 320 }}>
                          Module
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ fontWeight: 600, width: 90 }}
                        >
                          All
                        </TableCell>
                        {ACTIONS.map((a) => (
                          <TableCell
                            key={a}
                            align="center"
                            sx={{ fontWeight: 600 }}
                          >
                            {a}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rowsInSection.map((m) => {
                        const row = perms[m.key] || emptyRow();
                        const { all: rowAll, indeterminate: rowInd } =
                          getRowAllState(m.key);
                        return (
                          <TableRow key={m.key} hover>
                            <TableCell>
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1.5}
                              >
                                <Box component="span" sx={{ display: "flex" }}>
                                  {m.icon}
                                </Box>
                                <Box>
                                  <Typography
                                    fontWeight={600}
                                    sx={{ color: "#9a9cab" }}
                                  >
                                    {m.name}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{ color: "#6c757d" }}
                                  >
                                    {m.key}
                                  </Typography>
                                </Box>
                              </Stack>
                            </TableCell>
                            <TableCell align="center">
                              <Checkbox
                                checked={rowAll}
                                indeterminate={rowInd}
                                onChange={(_, v) => toggleRowAll(m.key, v)}
                                inputProps={{
                                  "aria-label": `Select all for ${m.name}`,
                                }}
                                sx={{
                                  color: "#9a9cab",
                                  "&.Mui-checked": { color: "#e8538f" },
                                  "&.MuiCheckbox-indeterminate": {
                                    color: "#e8538f",
                                  },
                                }}
                              />
                            </TableCell>
                            {ACTIONS.map((a) => (
                              <TableCell key={a} align="center">
                                <Checkbox
                                  checked={!!row[a]}
                                  onChange={() => toggleAction(m.key, a)}
                                  inputProps={{
                                    "aria-label": `${a} for ${m.name}`,
                                  }}
                                  sx={{
                                    color: "#9a9cab",
                                    "&.Mui-checked": { color: "#e8538f" },
                                  }}
                                />
                              </TableCell>
                            ))}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            );
          })}
        </Stack>
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
          {mode === "Edit" ? "Update Role" : "Create Role"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoleDialog;
