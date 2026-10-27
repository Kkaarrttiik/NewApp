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
import { createLanguage, updateLanguage } from "../../store/Language/action";
import { baseURL } from "../../util/Config";
import { Toast } from "../../util/Toast";

const LanguageDialog = ({ open, handleClose, editData }) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [localizedTitle, setLocalizedTitle] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [icon, setIcon] = useState(null);
  const [isDefault, setIsDefault] = useState(false);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!open) {
      // reset form
      setName("");
      setCode("");
      setLocalizedTitle("");
      setIsActive(true);
      setIsDefault(false);
      setErrors({});
      setPreview(null);
      setIcon(null);
    }
  }, [open]);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setIcon(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = () => {
    let err = {};

    if (!name.trim()) err.name = "Language Name is required";
    if (!code.trim()) err.code = "Language Code is required";
    if (!localizedTitle.trim())
      err.localizedTitle = "Localized Title is required";

    // Icon is mandatory only for new language, optional for edit
    if (!editData && !icon) {
      err.icon = "Language Icon is required";
    }

    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }

    if (editData) {
      const isNameSame =
        name.trim() === (editData.languageTitle || editData.title || "").trim();
      const isCodeSame =
        code.trim() === (editData.languageCode || editData.code || "").trim();
      const isLocalizedSame =
        localizedTitle.trim() ===
        (editData.localLanguageTitle || editData.localizedTitle || "").trim();
      const isActiveSame = isActive === (editData.isActive ?? true);
      const isDefaultSame = isDefault === (editData.isDefault || false);
      const isIconSame = !icon; // If no new icon file is selected

      if (
        isNameSame &&
        isCodeSame &&
        isLocalizedSame &&
        isActiveSame &&
        isDefaultSame &&
        isIconSame
      ) {
        Toast("info", "Nothing changed!");
        handleClose();
        return;
      }
    }

    const formData = new FormData();
    formData.append("languageTitle", name.trim());
    formData.append("languageCode", code.trim());
    formData.append("localLanguageTitle", localizedTitle.trim());
    formData.append("isActive", isActive ? "true" : "false");
    formData.append("isDefault", isDefault ? "true" : "false");
    if (icon) {
      formData.append("languageIcon", icon);
    }

    if (editData) {
      dispatch(updateLanguage(editData._id, formData));
    } else {
      dispatch(createLanguage(formData));
    }

    handleClose();
  };

  useEffect(() => {
    if (editData) {
      setName(editData.languageTitle || editData.title || "");
      setCode(editData.languageCode || editData.code || "");
      setLocalizedTitle(
        editData.localLanguageTitle || editData.localizedTitle || "",
      );
      setIsActive(editData.isActive ?? true);
      setIsDefault(editData.isDefault || false);
      setPreview(
        editData.languageIcon ? baseURL + editData.languageIcon : null,
      );
    } else {
      // reset for add
      setName("");
      setCode("");
      setLocalizedTitle("");
      setIsActive(true);
      setIsDefault(false);
      setPreview(null);
    }
  }, [editData, open]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>
        <span className="text-danger h4">
          {editData ? "Edit Language" : "Add Language"}
        </span>
      </DialogTitle>

      {/* CLOSE BUTTON */}
      <IconButton style={{ position: "absolute", right: 10, top: 10 }}>
        <Tooltip title="Close">
          <Cancel className="text-danger" onClick={handleClose} />
        </Tooltip>
      </IconButton>

      <DialogContent>
        <form>
          {/* NAME */}
          <div className="form-group mt-3">
            <label className="text-gray mb-2">Language Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter language name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) {
                  setErrors({ ...errors, name: "" });
                }
              }}
            />
            {errors.name && (
              <small className="text-danger">{errors.name}</small>
            )}
          </div>

          {/* CODE */}
          <div className="form-group mt-3">
            <label className="text-gray mb-2">Code</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. en, hi"
              value={code}
              disabled={!!editData}
              onChange={(e) => {
                setCode(e.target.value);
                if (errors.code) {
                  setErrors({ ...errors, code: "" });
                }
              }}
            />
            {errors.code && (
              <small className="text-danger">{errors.code}</small>
            )}
            {editData && (
              <small className="text-muted">
                Language code cannot be changed after creation.
              </small>
            )}
          </div>

          {/* LOCALIZED TITLE */}
          <div className="form-group mt-3">
            <label className="text-gray mb-2">Localized Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="Localized name"
              value={localizedTitle}
              onChange={(e) => {
                setLocalizedTitle(e.target.value);
                if (errors.localizedTitle) {
                  setErrors({ ...errors, localizedTitle: "" });
                }
              }}
            />
            {errors.localizedTitle && (
              <small className="text-danger">{errors.localizedTitle}</small>
            )}
          </div>

          <div className="form-group mt-3">
            <label className="text-gray mb-2">Language Icon</label>
            <input
              type="file"
              className="form-control"
              accept="image/png, image/jpg, image/jpeg, image/webp"
              onChange={(e) => {
                handleFileChange(e);
                if (errors.icon) {
                  setErrors({ ...errors, icon: "" });
                }
              }}
            />
            {errors.icon && (
              <p className="text-danger m-0" style={{ fontSize: "12px" }}>
                {errors.icon}
              </p>
            )}
            <small style={{ color: "red" }}>
              Supported formats: PNG, JPG, JPEG, WEBP
            </small>

            {/* PREVIEW IMAGE */}
            {preview && (
              <div className="mt-2">
                <img
                  src={preview}
                  alt="preview"
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    border: "1px solid #1e2640",
                  }}
                />
              </div>
            )}
          </div>

          {/* BUTTONS */}
          <div className="mt-5">
            <button
              type="button"
              className="btn btn-outline-info float-end ms-2"
              onClick={handleClose}
            >
              Close
            </button>

            <button
              type="button"
              className="btn btn-danger float-end"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LanguageDialog;
