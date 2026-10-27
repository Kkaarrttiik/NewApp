import { Cancel } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTranslation, updateTranslation } from "../../store/Language/action";
import { Toast } from "../../util/Toast";
import { permissionError } from "../../util/Alert";
import { usePermission } from "../../context/PermissionProvider";

const TranslationInfoDialog = ({ open, handleClose, language }) => {
  const dispatch = useDispatch();
  const storeTranslations = useSelector((state) => state.language.translations);
  const { can } = usePermission();
  const canEdit = can("admin/language", "Edit");

  const [search, setSearch] = useState("");
  const [localTranslations, setLocalTranslations] = useState({});
  const [changedKeys, setChangedKeys] = useState(new Set());

  // Fetch translations on open / tab change
  useEffect(() => {
    if (open && language) {
      const code = language.languageCode || language.code;
      dispatch(getTranslation(code, "app"));
    }
  }, [open, language, dispatch]);

  // Sync Redux translations to local state
  useEffect(() => {
    if (storeTranslations?.translations) {
      setLocalTranslations(storeTranslations.translations);
    } else {
      setLocalTranslations({});
    }
    setChangedKeys(new Set());
  }, [storeTranslations]);

  // Reset search & changedKeys on tab/language change
  useEffect(() => {
    setSearch("");
    setChangedKeys(new Set());
  }, [language]);

  const handleChange = (key, value) => {
    if (!canEdit) return;
    const originalValue = storeTranslations?.translations?.[key] ?? "";
    setLocalTranslations((prev) => ({ ...prev, [key]: value }));
    setChangedKeys((prev) => {
      const updated = new Set(prev);
      if (value !== originalValue) {
        updated.add(key);
      } else {
        updated.delete(key);
      }
      return updated;
    });
  };

  const handleUpdate = () => {
    if (!language) return;
    if (!canEdit) return permissionError();

    if (changedKeys.size === 0) {
      Toast("info", "No changes detected!");
      handleClose();
      return;
    }

    const changedTranslations = {};
    changedKeys.forEach((key) => {
      changedTranslations[key] = localTranslations[key];
    });

    const code = language.languageCode || language.code;
    dispatch(
      updateTranslation({
        languageCode: code,
        module: "app",
        translations: changedTranslations,
      }),
    );
    handleClose();
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value === "") {
      const code = language.languageCode || language.code;
      dispatch(getTranslation(code, "app"));
    }
  };

  const handleSearchSubmit = () => {
    if (search.trim() === "") return;
    const code = language.languageCode || language.code;
    dispatch(getTranslation(code, "app", search.trim()));
  };

  const keys = Object.keys(localTranslations);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      disableBackdropClick
      disableEscapeKeyDown
    >
      <DialogTitle>
        <span className="text-danger font-weight-bold h4">Translations</span>

        {changedKeys.size > 0 && (
          <span
            className="badge bg-warning text-dark ms-2"
            style={{ fontSize: "0.75rem" }}
          >
            {changedKeys.size} unsaved change{changedKeys.size > 1 ? "s" : ""}
          </span>
        )}

        <IconButton style={{ position: "absolute", right: 4, top: 4 }}>
          <Tooltip title="Close">
            <Cancel className="text-danger" onClick={handleClose} />
          </Tooltip>
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <div className="modal-body pt-1 px-1 pb-3">
          <div className="d-flex flex-column">
            {/* Language Info */}
            <div className="mb-3">
              <span className="text-gray" style={{ fontSize: "0.9rem" }}>
                Language:{" "}
                <strong>
                  {language?.languageTitle ||
                    language?.name ||
                    language?.title ||
                    "N/A"}
                </strong>{" "}
                ({language?.languageCode || language?.code || ""})
              </span>
            </div>

            {/* Search */}
            <div className="form-group mb-3">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search translations..."
                  value={search}
                  onChange={handleSearchChange}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSearchSubmit();
                    }
                  }}
                />
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={handleSearchSubmit}
                >
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>

            {/* Table */}
            <div style={{ maxHeight: "45vh", overflowY: "auto" }}>
              <table
                className="table table-bordered table-hover mb-0"
                style={{ tableLayout: "fixed", width: "100%" }}
              >
                <thead className="thead-light">
                  <tr>
                    <th
                      style={{ width: "40%", wordBreak: "break-word" }}
                      className="text-gray"
                    >
                      Key
                    </th>
                    <th
                      style={{ width: "60%", wordBreak: "break-word" }}
                      className="text-gray"
                    >
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {keys.length === 0 ? (
                    <tr>
                      <td colSpan="2" className="text-center py-4 text-muted">
                        <i className="fas fa-inbox me-2"></i>
                        No Data Found
                      </td>
                    </tr>
                  ) : (
                    keys.map((key) => (
                      <tr
                        key={key}
                        style={{
                          backgroundColor: changedKeys.has(key)
                            ? "rgba(255, 193, 7, 0.1)"
                            : undefined,
                        }}
                      >
                        <td
                          className="align-middle"
                          style={{
                            wordBreak: "break-word",
                            whiteSpace: "normal",
                          }}
                        >
                          <span
                            className="badge bg-danger text-wrap text-start"
                            style={{
                              fontSize: "0.75rem",
                              whiteSpace: "normal",
                              wordBreak: "break-all",
                            }}
                          >
                            {key}
                          </span>
                        </td>
                        <td
                          style={{
                            wordBreak: "break-word",
                            whiteSpace: "normal",
                          }}
                        >
                          <input
                            type="text"
                            className={`form-control form-control-sm ${
                              changedKeys.has(key) ? "border-warning" : ""
                            }`}
                            value={localTranslations[key] || ""}
                            onChange={(e) => handleChange(key, e.target.value)}
                            style={{ width: "100%" }}
                            disabled={!canEdit}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="mt-5">
              <button
                type="button"
                className="btn btn-outline-info ml-2 btn-round float__right icon_margin"
                onClick={handleClose}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-round float__right btn-danger"
                onClick={handleUpdate}
                disabled={changedKeys.size === 0 || !canEdit}
              >
                Submit {changedKeys.size > 0 ? `(${changedKeys.size})` : ""}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TranslationInfoDialog;
