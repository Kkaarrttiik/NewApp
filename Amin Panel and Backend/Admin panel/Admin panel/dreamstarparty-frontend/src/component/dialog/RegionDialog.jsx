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
import { CLOSE_REGION_DIALOG } from "../../store/region/type";

//action
import { insertRegion, updateRegion } from "../../store/region/action";

import { Toast } from "../../util/Toast";

const RegionDialog = (props) => {
  const dispatch = useDispatch();

  const { dialog: open, dialogData } = useSelector((state) => state.region);

  const [mongoId, setMongoId] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (dialogData) {
      setMongoId(dialogData._id);
      setName(dialogData.name);
    }
  }, [dialogData]);

  useEffect(
    () => () => {
      setMongoId("");
      setName("");
    },
    [open],
  );

  useEffect(() => {
    return () => {
      dispatch({ type: CLOSE_REGION_DIALOG });
    };
  }, [dispatch]);

  const closePopup = () => {
    dispatch({ type: CLOSE_REGION_DIALOG });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(dialogData);

    const data = {
      name: name,
    };

    if (mongoId) {
      if (dialogData.name === name) {
        Toast("info", "Nothing changed!");
        return closePopup();
      }
      props.updateRegion(data, mongoId);
    } else {
      props.insertRegion(data);
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
          <span className="text-danger font-weight-bold h4"> Region </span>
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
                  <label className="mb-2 text-gray">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    required=""
                    placeholder="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </div>
                <div className="mt-5">
                  <button
                    type="button"
                    className="btn btn-outline-info ml-2 btn-round float__right icon_margin"
                    onClick={closePopup}
                  >
                    Close
                  </button>
                  {!mongoId ? (
                    <button
                      type="button"
                      className="btn btn-round float__right btn-danger"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-round float__right btn-danger"
                      onClick={handleSubmit}
                    >
                      Update
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default connect(null, { updateRegion, insertRegion })(RegionDialog);
