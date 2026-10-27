import { Cancel } from "@mui/icons-material";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Tooltip,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadTranslation } from "../../store/Language/action";

const UploadCSVDialogue = ({ open, handleClose }) => {
    const dispatch = useDispatch();
    const { languages } = useSelector((state) => state.language);

    const [file, setFile] = useState(null);
    const [error, setError] = useState("");

    const activeLanguages = languages
        ? languages.filter((lang) => lang.isActive)
        : [];

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError("");
        }
    };

    const onClose = () => {
        setFile(null);
        setError("");
        handleClose();
    };

    const handleSubmit = () => {
        if (!file) {
            setError("Please select a CSV file!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        dispatch(uploadTranslation(formData));
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>
                <span className="text-danger h4">Upload CSV File</span>
            </DialogTitle>

            {/* CLOSE BUTTON */}
            <IconButton style={{ position: "absolute", right: 10, top: 10 }}>
                <Tooltip title="Close">
                    <Cancel className="text-danger" onClick={onClose} />
                </Tooltip>
            </IconButton>

            <DialogContent>
                <form>
                    {/* INSTRUCTIONS */}
                    <div className="form-group mt-3">
                        <p className="text-gray mb-2" style={{ fontSize: "14px" }}>
                            You currently have <b>{activeLanguages.length}</b> active languages.
                            Please upload a CSV file that includes all these languages:
                        </p>
                        <ul
                            className="list-group"
                            style={{
                                maxHeight: "120px",
                                overflowY: "auto",
                                borderRadius: "5px",
                                border: "1px solid #ced4da",
                                backgroundColor: "#f8f9fa",
                                padding: "5px 10px",
                            }}
                        >
                            {activeLanguages.map((lang) => (
                                <li key={lang._id} style={{ fontSize: "13px", padding: "2px 0" }}>
                                    • {lang.languageTitle || lang.name || lang.title} (
                                    {lang.languageCode || lang.code})
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* FILE UPLOAD */}
                    <div className="form-group mt-3">
                        <label className="text-gray mb-2">Select CSV File</label>
                        <input
                            type="file"
                            accept=".csv"
                            className="form-control"
                            onChange={handleFileChange}
                        />
                        {error && <small className="text-danger mt-1">{error}</small>}
                    </div>

                    {/* BUTTONS */}
                    <div className="mt-5">
                        <button
                            type="button"
                            className="btn btn-outline-info float-end ms-2"
                            onClick={onClose}
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

export default UploadCSVDialogue;