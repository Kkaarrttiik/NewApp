import { Cancel } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBd } from "../../store/Bd/action";
import { Toast } from "../../util/Toast";

const BdCoinDialog = ({ open, onClose, bdData, page, rowsPerPage }) => {
  const dispatch = useDispatch();
  const [type, setType] = useState("add");
  const [coin, setCoin] = useState("");
  const [coinError, setCoinError] = useState("");
  const [loading, setLoading] = useState(false);

  const availableCoins = bdData?.netCoin ?? 0;

  const handleClose = () => {
    setCoin("");
    setCoinError("");
    setType("add");
    onClose();
  };

  const validateCoin = (value, coinType) => {
    if (!value && value !== 0) {
      return "Coin amount is required!";
    }

    const numValue = Number(value);

    if (isNaN(numValue)) {
      return "Please enter a valid number!";
    }

    if (!Number.isInteger(numValue)) {
      return "Coin amount must be a whole number!";
    }

    if (numValue <= 0) {
      return "Coin amount must be greater than 0!";
    }

    if (coinType === "deduct" && numValue > availableCoins) {
      return `Cannot deduct ${numValue} coins — only ${availableCoins} available!`;
    }

    return "";
  };

  const handleCoinChange = (e) => {
    const value = e.target.value;
    setCoin(value);

    if (coinError) {
      const error = validateCoin(value, type);
      setCoinError(error);
    }
  };

  const handleTypeChange = (newType) => {
    setType(newType);

    if (coin) {
      const error = validateCoin(coin, newType);
      setCoinError(error);
    }
  };

  const handleSubmit = () => {
    const error = validateCoin(coin, type);
    if (error) {
      setCoinError(error);
      return;
    }

    setLoading(true);
    axios
      .post("bd/addDeductCoin", {
        bdId: bdData?._id,
        coin: Number(coin),
        type,
      })
      .then((res) => {
        if (res.data.status) {
          Toast("success", res.data.message);
          dispatch(getBd({ start: page, limit: rowsPerPage }));
          handleClose();
        } else {
          Toast("error", res.data.message);
        }
      })
      .catch((err) => Toast("error", err.message))
      .finally(() => setLoading(false));
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <span className="text-danger font-weight-bold h5">
          Adjust Coins for {bdData?.name}
        </span>
      </DialogTitle>

      <IconButton style={{ position: "absolute", right: 4, top: 4 }}>
        <Tooltip title="Close">
          <Cancel className="text-danger" onClick={handleClose} />
        </Tooltip>
      </IconButton>

      <DialogContent>
        <div className="pb-3">
          <p className="mb-4 text-white" style={{ fontSize: 14 }}>
            Current Net Coins:{" "}
            <span
              className="text-light"
              style={{ fontWeight: 600, fontSize: 16 }}
            >
              {availableCoins}
            </span>
          </p>

          {/* Add / Remove toggle buttons */}
          <div className="d-flex gap-3 mb-4">
            <button
              type="button"
              className="btn"
              style={{
                background: type === "add" ? "#6c63ff" : "transparent",
                color: type === "add" ? "#fff" : "#6c63ff",
                border: "2px solid #6c63ff",
                fontWeight: 600,
                minWidth: 120,
                borderRadius: 6,
              }}
              onClick={() => handleTypeChange("add")}
            >
              Add Coins
            </button>
            <button
              type="button"
              className="btn"
              style={{
                background: type === "deduct" ? "#e11d48" : "transparent",
                color: type === "deduct" ? "#fff" : "#e11d48",
                border: "2px solid #e11d48",
                fontWeight: 600,
                minWidth: 120,
                borderRadius: 6,
              }}
              onClick={() => handleTypeChange("deduct")}
            >
              Remove Coins
            </button>
          </div>

          {/* Deduct warning banner */}
          {type === "deduct" && availableCoins === 0 && (
            <div
              className="mb-3 px-3 py-2"
              style={{
                background: "rgba(225, 29, 72, 0.12)",
                border: "1px solid rgba(225, 29, 72, 0.4)",
                borderRadius: 6,
                fontSize: 13,
                color: "#e11d48",
              }}
            >
              ⚠ This BD has no coins to deduct.
            </div>
          )}

          {/* Coin Input */}
          <div className="mb-2">
            <label
              style={{
                fontSize: 13,
                color: "#888",
                marginBottom: 6,
                display: "block",
              }}
            >
              {type === "add" ? "Coins to Add" : "Coins to Remove"}
            </label>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#888",
                  fontSize: 16,
                }}
              >
                ⭐
              </span>
              <input
                type="number"
                className="form-control"
                placeholder="Enter amount"
                value={coin}
                min={1}
                max={type === "deduct" ? availableCoins : undefined}
                onChange={handleCoinChange}
                onBlur={() => setCoinError(validateCoin(coin, type))}
                style={{
                  paddingLeft: 36,
                  borderColor: coinError ? "#e11d48" : undefined,
                  boxShadow: coinError
                    ? "0 0 0 0.2rem rgba(225,29,72,0.15)"
                    : undefined,
                }}
              />
            </div>

            {/* Inline error message */}
            {coinError && (
              <div
                style={{
                  marginTop: 6,
                  fontSize: 12,
                  color: "#e11d48",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span>⚠</span>
                <span>{coinError}</span>
              </div>
            )}

            {/* Remaining preview for deduct */}
            {type === "deduct" &&
              coin &&
              !coinError &&
              Number(coin) > 0 &&
              Number(coin) <= availableCoins && (
                <div
                  style={{
                    marginTop: 6,
                    fontSize: 12,
                    color: "#888",
                  }}
                >
                  Remaining after deduction:{" "}
                  <strong style={{ color: "#6c63ff" }}>
                    {availableCoins - Number(coin)} coins
                  </strong>
                </div>
              )}
          </div>

          {/* Action Buttons */}
          <div className="d-flex justify-content-end gap-2 mt-4">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleClose}
              style={{ minWidth: 90 }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn"
              onClick={handleSubmit}
              disabled={loading || (type === "deduct" && availableCoins === 0)}
              style={{
                background: "#6c63ff",
                color: "#fff",
                minWidth: 130,
                fontWeight: 600,
                opacity:
                  loading || (type === "deduct" && availableCoins === 0)
                    ? 0.6
                    : 1,
              }}
            >
              {loading ? "Updating..." : "Update Coins"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BdCoinDialog;
