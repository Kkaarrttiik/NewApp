import { Cancel, Visibility, VisibilityOff } from "@mui/icons-material";
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
import { useNavigate } from "react-router-dom";
import { CLOSE_ADMIN_DIALOG, UNSET_ADMIN } from "../../store/admin/types";
import { Toast } from "../../util/Toast";

const UpdatePassword = () => {
  const { dialog: open, dialogData } = useSelector((state) => state.admin);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const changePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      const errors = {};

      if (!oldPassword) errors.oldPassword = "Require this Filed!";
      if (!newPassword) errors.newPassword = "Require this Filed!";
      if (!confirmPassword) errors.confirmPassword = "Require this Filed!";

      return setErrors({ ...errors });
    }

    setError("");
    if (confirmPassword !== newPassword) {
      return setError("Password & Confirm Password do not match ❌");
    }
    axios
      .put(`/admin`, {
        oldPass: oldPassword,
        newPass: newPassword,
        confirmPass: confirmPassword,
      })
      .then((res) => {
        if (res.data.status) {
          Toast("success", "Change Admin Password Successfully ✔");
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setTimeout(() => {
            dispatch({ type: UNSET_ADMIN });
            navigate("/");
          }, 1000);
        } else {
          Toast("error", res.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const closePopup = () => {
    dispatch({ type: CLOSE_ADMIN_DIALOG });
  };
  return (
    <>
      <Dialog
        open={open}
        aria-labelledby="responsive-dialog-title"
        onClose={closePopup}
        disableBackdropClick
        disableEscapeKeyDown
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="responsive-dialog-title">
          <span className="text-danger font-weight-bold h4">
            {" "}
            Update Password{" "}
          </span>
        </DialogTitle>

        <IconButton
          style={{
            position: "absolute",
            top: 10,
            right: 10,
          }}
        >
          <Tooltip title="Close">
            <Cancel className="text-danger" onClick={closePopup} />
          </Tooltip>
        </IconButton>
        <DialogContent>
          <div className="modal-body pt-1 px-1 pb-3">
            <div className="d-flex flex-column">
              <form>
                <div className="edu-section">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="degree1">Old Password</label>
                        <div style={{ position: "relative" }}>
                          <input
                            type={showOldPassword ? "text" : "password"}
                            className="form-control "
                            id="degree1"
                            style={{ paddingRight: "40px" }}
                            placeholder="Add your old password here..."
                            onChange={(event) => {
                              setOldPassword(event.target.value);
                              if (!event.target.value) {
                                return setErrors({
                                  ...errors,
                                  oldPassword: "Require this Filed!",
                                });
                              } else {
                                return setErrors({
                                  ...errors,
                                  oldPassword: "",
                                });
                              }
                            }}
                          />
                          <span
                            onClick={() => setShowOldPassword(!showOldPassword)}
                            style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#6b7280", display: "flex", alignItems: "center" }}
                          >
                            {showOldPassword ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                          </span>
                        </div>
                        {errors.oldPassword && (
                          <span className="text-danger">
                            {errors.oldPassword}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="col-md-12 mt-4">
                      <div className="form-group">
                        <label htmlFor="degree1">New Password</label>
                        <div style={{ position: "relative" }}>
                          <input
                            type={showNewPassword ? "text" : "password"}
                            className="form-control "
                            id="degree1"
                            style={{ paddingRight: "40px" }}
                            placeholder="Add your new password here..."
                            onChange={(event) => {
                              setNewPassword(event.target.value);
                              if (!event.target.value) {
                                return setErrors({
                                  ...errors,
                                  newPassword: "Require this Filed!",
                                });
                              } else {
                                return setErrors({
                                  ...errors,
                                  newPassword: "",
                                });
                              }
                            }}
                          />
                          <span
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#6b7280", display: "flex", alignItems: "center" }}
                          >
                            {showNewPassword ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                          </span>
                        </div>
                        {errors.newPassword && (
                          <span className="text-danger">
                            {errors.newPassword}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-md-12 mt-4">
                      <div className="form-group">
                        <label htmlFor="degree1">confirm Password</label>
                        <div style={{ position: "relative" }}>
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            className="form-control"
                            style={{ backgroundColor: "#141B2D", paddingRight: "40px" }}
                            id="degree1"
                            placeholder="confirm your new password here..."
                            // value="Royal Collage of Art Designer Illustrator"
                            onChange={(event) => {
                              setConfirmPassword(event.target.value);
                              if (!event.target.value) {
                                return setErrors({
                                  ...errors,
                                  confirmPassword: "Require this Filed!",
                                });
                              } else {
                                return setErrors({
                                  ...errors,
                                  confirmPassword: "",
                                });
                              }
                            }}
                          />
                          <span
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#6b7280", display: "flex", alignItems: "center" }}
                          >
                            {showConfirmPassword ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                          </span>
                        </div>
                        {errors.confirmPassword && (
                          <span className="text-danger">
                            {errors.confirmPassword}
                          </span>
                        )}
                        {error && (
                          <span className="text-danger">{error}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
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
                    onClick={changePassword}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpdatePassword;
