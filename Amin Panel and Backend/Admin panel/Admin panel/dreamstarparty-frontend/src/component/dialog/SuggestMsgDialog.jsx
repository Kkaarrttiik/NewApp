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
import { CLOSE_SG_DIALOG } from '../../store/suggestMessage/types';

//action
import { createNewSuggestMsg, editSuggestMsg } from '../../store/suggestMessage/action';
import { Toast } from "../../util/Toast";

const SuggestMsgDialog = (props) => {
  const dispatch = useDispatch();

  const { dialog: open, dialogData } = useSelector((state) => state.suggestMessage);


  const [mongoId, setMongoId] = useState("");
  const [message, setMessage] = useState("");

  const [errors, setError] = useState({
    message: "",
  });

  useEffect(() => {
    if (dialogData) {
      setMongoId(dialogData._id);
      setMessage(dialogData.message);
    }
  }, [dialogData]);

  useEffect(
    () => () => {
      setError({
        message: "",
      });
      setMongoId("");
      setMessage("");
    },
    [open]
  );


  useEffect(() => {
    window.onbeforeunload = closePopup();
  }, []);

  const closePopup = () => {
    dispatch({ type: CLOSE_SG_DIALOG });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message) {
      const errors = {};
      if (!message) errors.message = "Suggested Message is Required!";
      return setError({ ...errors });
    }


    if (mongoId) {
      if (message === dialogData?.message) {
        Toast("info", "Nothing changed!");
        closePopup();
        return;
      }
      props.editSuggestMsg(mongoId, message);
    } else {
      props.createNewSuggestMsg(message);
    }
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
        maxWidth="xs"
      >
        <DialogTitle id="responsive-dialog-title">
          <span className="text-danger font-weight-bold h4"> Suggested Message </span>
        </DialogTitle>

        <IconButton
          style={{
            position: "absolute",
            right: 0,
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
                <div className="form-group">
                  <label className="mb-2 text-gray">Message</label>
                  <textarea
                    rows={3}
                    type="text"
                    className="form-control"
                    required=""
                    placeholder="Type Suggested Message Here..."
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...errors,
                          message: "Suggested Message is Required!",
                        });
                      } else {
                        return setError({
                          ...errors,
                          message: "",
                        });
                      }
                    }}
                  />
                  {errors.message && (
                    <div className="ml-2 mt-1">
                      {errors.message && (
                        <div className="pl-1 text__left">
                          <span className="text-red">{errors.message}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className={"mt-5"}>
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

export default connect(null, { createNewSuggestMsg, editSuggestMsg })(SuggestMsgDialog);
