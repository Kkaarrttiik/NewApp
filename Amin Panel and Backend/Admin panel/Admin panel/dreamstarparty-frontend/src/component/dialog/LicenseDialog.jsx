import { Cancel } from "@mui/icons-material";
import { Dialog, DialogContent, IconButton, Tooltip } from "@mui/material";
import React from "react";

const LicenseDialog = ({ open, onClose }) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
    {/* CLOSE BUTTON */}
    <IconButton style={{ position: "absolute", right: 10, top: 10 }}>
      <Tooltip title="Close">
        <Cancel className="text-danger" onClick={onClose} />
      </Tooltip>
    </IconButton>

    <DialogContent>
      {/* HEADER */}
      <div className="text-center mt-3 mb-3">
        {/* Icon circle */}
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
            <rect
              x="4"
              y="11"
              width="16"
              height="11"
              rx="2.5"
              stroke="#e8538f"
              strokeWidth="1.8"
            />
            <path
              d="M8 11V7a4 4 0 018 0v4"
              stroke="#e8538f"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <circle cx="12" cy="16.5" r="1.8" fill="#e8538f" />
          </svg>
        </div>

        <small
          className="text-danger text-uppercase fw-bold"
          style={{ letterSpacing: "0.1em" }}
        >
          License Required
        </small>

        <h4 className="text-danger mt-1 mb-0">Extended License Required</h4>
      </div>

      <hr className="text-muted" />

      {/* BODY TEXT */}
      <p
        className="text-gray text-center"
        style={{ fontSize: 13.5, lineHeight: 1.75 }}
      >
        If you want to charge end users by any way, you are required to purchase
        an <strong className="text-danger">Extended License</strong> as per
        CodeCanyon/Envato policy.
      </p>

      {/* CONTACT BOX */}
      <div
        className="mb-3 p-3"
        style={{
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(255,255,255,0.03)",
        }}
      >
        <small
          className="text-muted text-uppercase fw-bold"
          style={{ letterSpacing: "0.1em" }}
        >
          Contact us to upgrade
        </small>

        {/* Phone Button */}
        <button
          className="btn btn-danger w-100 d-flex align-items-center gap-2 mt-2"
          style={{ textDecoration: "none", boxShadow: "none" }}
          onClick={() => window.open("https://wa.me/919909515320", "_blank")}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            style={{ flexShrink: 0 }}
          >
            <path
              d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1C9.61 21 3 14.39 3 6a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.24 1.02l-2.21 2.2z"
              fill="white"
            />
          </svg>
          +91 9909515320
        </button>

        {/* Envato Link */}
        <button
          type="button"
          className="btn btn-outline-info w-100 d-flex align-items-center justify-content-center gap-2 mt-2"
          onClick={() =>
            window.open(
              "https://codecanyon.net/licenses/faq#main-differences-licenses-a",
              "_blank",
            )
          }
        >
          View Envato License Policy
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* CLOSE BUTTON */}
      <div className="mt-2">
        <button
          type="button"
          className="btn btn-outline-info w-100"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </DialogContent>
  </Dialog>
);

export default LicenseDialog;
