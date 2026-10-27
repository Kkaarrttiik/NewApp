import React, { useEffect, useState } from "react";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//MUI
import { Cancel } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";

//types
import { CLOSE_BD_PAYMENT_METHOD_DIALOG } from "../../store/bdPaymentMethod/types";

//action
import {
  createBdPaymentMethod,
  updateBdPaymentMethod,
} from "../../store/bdPaymentMethod/action";

//util
import { Toast } from "../../util/Toast";

const BdPaymentMethodDialog = (props) => {
  const dispatch = useDispatch();

  const { dialog: open, dialogData } = useSelector(
    (state) => state.bdPaymentMethod,
  );

  const [name, setName] = useState("");
  const [fieldInput, setFieldInput] = useState("");
  const [fields, setFields] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (dialogData) {
      setName(dialogData.name || "");
      // Convert details object keys to fields array
      setFields(dialogData.details ? Object.keys(dialogData.details) : []);
    }
  }, [dialogData]);

  useEffect(() => {
    if (!open) {
      setName("");
      setFieldInput("");
      setFields([]);
      setErrors({});
    }
  }, [open]);

  useEffect(() => {
    return () => {
      dispatch({ type: CLOSE_BD_PAYMENT_METHOD_DIALOG });
    };
  }, [dispatch]);

  const closePopup = () => {
    dispatch({ type: CLOSE_BD_PAYMENT_METHOD_DIALOG });
  };

  const handleAddField = () => {
    const trimmed = fieldInput.trim();
    if (!trimmed) return;
    if (fields.includes(trimmed)) {
      Toast("error", "Field already added!");
      return;
    }
    setFields([...fields, trimmed]);
    setFieldInput("");
  };

  const handleRemoveField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddField();
    }
  };

  const validate = () => {
    let error = {};
    let isValid = true;

    if (!name.trim()) {
      error.name = "Payment method name is required!";
      isValid = false;
    }
    if (fields.length === 0) {
      error.fields = "Please add at least one detail field!";
      isValid = false;
    }

    setErrors(error);
    return isValid;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    // Convert fields array to details object e.g. ["upiId", "name"] → { upiId: "", name: "" }
    const details = fields.reduce((acc, field) => {
      acc[field] = "";
      return acc;
    }, {});

    const data = {
      name: name.trim(),
      details,
    };

    if (dialogData) {
      props.updateBdPaymentMethod({
        methodId: dialogData._id,
        name: data.name,
        details: data.details,
      });
    } else {
      props.createBdPaymentMethod(data);
    }
    closePopup();
  };

  return (
    <Dialog
      open={open}
      aria-labelledby="bd-payment-method-dialog"
      onClose={closePopup}
      disableBackdropClick
      disableEscapeKeyDown
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle id="bd-payment-method-dialog">
        <span className="text-danger font-weight-bold h4">
          {dialogData ? "Edit Payment Method" : "Add Payment Method"}
        </span>
      </DialogTitle>

      <IconButton style={{ position: "absolute", right: 0 }}>
        <Tooltip title="Close">
          <Cancel className="text-danger" onClick={closePopup} />
        </Tooltip>
      </IconButton>

      <DialogContent>
        <div className="modal-body pt-1 px-1 pb-3">
          <div className="d-flex flex-column">
            <form>
              {/* Payment Method Name */}
              <div className="form-group mb-3">
                <label className="mb-2 text-gray">Payment Method Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. UPI, Bank Transfer"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (e.target.value.trim()) {
                      setErrors({ ...errors, name: "" });
                    }
                  }}
                />
                {errors.name && (
                  <span className="text-red" style={{ fontSize: "12px" }}>
                    {errors.name}
                  </span>
                )}
              </div>

              {/* Add Detail Field */}
              <div className="form-group mb-3">
                <label className="mb-2 text-gray">Add Detail Field</label>
                <div className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Account Number, IFSC Code"
                    value={fieldInput}
                    onChange={(e) => setFieldInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    style={{ whiteSpace: "nowrap" }}
                    onClick={handleAddField}
                  >
                    <i className="fa fa-plus me-1"></i> Add
                  </button>
                </div>
                {errors.fields && (
                  <span className="text-red" style={{ fontSize: "12px" }}>
                    {errors.fields}
                  </span>
                )}
              </div>

              {/* Added Fields as Badges */}
              {fields.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {fields.map((field, index) => (
                    <span
                      key={index}
                      className="d-flex align-items-center"
                      style={{
                        background: "transparent",
                        border: "1px solid #e8538f",
                        color: "#e8538f",
                        borderRadius: "20px",
                        padding: "4px 10px",
                        fontSize: "12px",
                      }}
                    >
                      {field}
                      <i
                        className="fas fa-times ms-2"
                        style={{ cursor: "pointer", fontSize: "10px" }}
                        onClick={() => handleRemoveField(index)}
                      ></i>
                    </span>
                  ))}
                </div>
              )}

              {/* Buttons */}
              <div className="mt-4">
                <button
                  type="button"
                  className="btn btn-outline-info ml-2 btn-round float__right icon_margin"
                  onClick={closePopup}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-round float__right btn-danger"
                  onClick={handleSubmit}
                >
                  {dialogData ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default connect(null, { createBdPaymentMethod, updateBdPaymentMethod })(
  BdPaymentMethodDialog,
);
