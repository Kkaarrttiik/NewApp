import { Cancel } from "@mui/icons-material";
import { Dialog, DialogContent, IconButton, Tooltip } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const LanguageWarningDialog = ({ open, onClose }) => {
  const navigate = useNavigate();

  const handleClose = () => {
    if (onClose) onClose();
    navigate("/admin/language");
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      {/* CLOSE BUTTON */}
      <IconButton style={{ position: "absolute", right: 10, top: 10 }} onClick={handleClose}>
        <Tooltip title="Close">
          <Cancel className="text-danger" />
        </Tooltip>
      </IconButton>

      <DialogContent>
        {/* HEADER */}
        <div className="text-center mt-3 mb-3">
          {/* Icon circle - Warning icon instead of Lock */}
          <div
            className="mx-auto mb-3 d-flex align-items-center justify-content-center"
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              border: "1px solid #e8538f",
              background: "rgba(220,53,69,0.1)",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                stroke="#e8538f"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <small
            className="text-danger text-uppercase fw-bold"
            style={{ letterSpacing: "0.1em" }}
          >
            Attention
          </small>

          <h4 className="text-danger mt-1 mb-0">Minimum 1 Language Required</h4>
        </div>

        <hr className="text-muted" />

        {/* BODY TEXT */}
        <p
          className="text-gray text-center"
          style={{ fontSize: 13.5, lineHeight: 1.75 }}
        >
          Minimum one language is required. Please add atleast one language.
        </p>

        {/* CLOSE BUTTON */}
        <div className="mt-4">
          <button
            type="button"
            className="btn btn-outline-info w-100"
            onClick={handleClose}
          >
            Go to Languages
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LanguageWarningDialog;
