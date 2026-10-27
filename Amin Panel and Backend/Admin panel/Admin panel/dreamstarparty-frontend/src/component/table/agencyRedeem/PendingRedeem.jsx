import React, { useEffect, useState, useRef } from "react";

//react-redux
import { connect, useDispatch, useSelector } from "react-redux";

//routing

//action
import { getSetting } from "../../../store/setting/action";

//MUI

//dayjs
import dayjs from "dayjs";

import arraySort from "array-sort";
import {
  acceptRedeem,
  declineRedeem,
  getAgencyRedeem,
} from "../../../store/agenyRedeem/action";

import { Cancel } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import { IconCopy } from "@tabler/icons-react";
import Rcoin from "../../../assets/images/rcoin.webp";
import { usePermission } from "../../../context/PermissionProvider";
import Pagination from "../../../pages/Pagination";
import { Toast } from "../../../util/Toast";

//sweet alert

const TablePaginationActions = React.lazy(() => import("../TablePagination"));

const PendingRedeemTable = (props) => {
  const dispatch = useDispatch();

  const [coinSort, setCoinSort] = useState(true);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialogue, setOpenDialogue] = useState(false);
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openAccept, setOpenAccept] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const { can } = usePermission();
  const canCreate = can("admin/agencyRedeemRequest", "Create");
  const canEdit = can("admin/agencyRedeemRequest", "Edit");
  const canDelete = can("admin/agencyRedeemRequest", "Delete");

  useEffect(() => {
    dispatch(getSetting());
    // dispatch(getAgencyRedeem("pending"));
  }, [dispatch]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(getAgencyRedeem("pending", activePage, rowsPerPage, search));
    }, 100);
    return () => clearTimeout(timeout);
  }, [activePage, rowsPerPage]);

  const redeem = useSelector((state) => state.agencyRedeem.agencyRedeem);
  const setting = useSelector((state) => state.setting.setting);

  useEffect(() => {
    setData(redeem.data);
  }, [redeem]);

  const searchTimeout = useRef(null);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    searchTimeout.current = setTimeout(() => {
      setActivePage(1);
      dispatch(getAgencyRedeem("pending", 1, rowsPerPage, value));
    }, 1000);
  };

  const handleAcceptDecline = (id, type) => {
    props.acceptRedeem(id, type);
  };

  const handleCoinSort = () => {
    setCoinSort(!coinSort);
    arraySort(data, "rCoin", { reverse: coinSort });
  };

  const validateDecline = () => {
    let error = {};
    let isValid = true;
    if (!reason || reason === "") {
      error.reason = "Please enter valid reason!";
      isValid = false;
    }
    setErrors(error);
    return isValid;
  };

  const handleDeclineSubmit = (type) => {
    if (validateDecline()) {
      dispatch(declineRedeem(selectedRequest?._id, type, reason));
      setOpenDialogue(false);
      setReason("");
    }
  };

  const handleAcceptSubmit = (type) => {
    dispatch(acceptRedeem(selectedRequest?._id, type));
    setOpenAccept(false);
  };

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
  };

  const copyToClipboard = (Text) => {
    navigator.clipboard.writeText(Text);
    Toast("success", "Copied successfully!");
  };

  return (
    <>
      {/* ── Add Reason Dialog ── */}
      <Dialog
        open={openDialogue}
        aria-labelledby="responsive-dialog-title"
        onClose={() => {
          setOpenDialogue(false);
          setReason("");
        }}
        disableBackdropClick
        disableEscapeKeyDown
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="responsive-dialog-title">
          <span className="text-white font-weight-bold h4"> Add Reason </span>
        </DialogTitle>

        <IconButton style={{ position: "absolute", right: 0 }}>
          <Tooltip title="Close">
            <Cancel
              style={{ color: "#6b7280" }}
              onClick={() => {
                setOpenDialogue(false);
                setReason("");
              }}
            />
          </Tooltip>
        </IconButton>
        <DialogContent>
          <div className="modal-body pt-1 px-1 pb-3">
            <div className="d-flex flex-column">
              <form>
                <div className="form-group">
                  <label className="mb-2 text-gray">Reason</label>
                  <input
                    type="text"
                    className="form-control"
                    required=""
                    placeholder="Enter Valid Reason"
                    value={reason}
                    onChange={(e) => {
                      setReason(e.target.value);
                      if (!e.target.value) {
                        return setErrors({
                          ...errors,
                          reason: "Reason is Required!",
                        });
                      } else {
                        return setErrors({
                          ...errors,
                          reason: "",
                        });
                      }
                    }}
                  />
                  {errors.reason && (
                    <div className="ml-2 mt-1">
                      {errors.reason && (
                        <div className="pl-1 text__left">
                          <span className="text-red">{errors.reason}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="mt-5">
                  <button
                    type="button"
                    className="btn-sm ml-2 float__right icon_margin"
                    style={{
                      background: "transparent",
                      border: "1px solid #1a6fd4",
                      color: "#1a6fd4",
                      borderRadius: 6,
                    }}
                    onClick={() => {
                      setOpenDialogue(false);
                      setReason("");
                    }}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn-sm delete-btn float__right"
                    onClick={() => {
                      handleDeclineSubmit("decline");
                    }}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Accept Dialog ── */}
      <Dialog
        open={openAccept}
        aria-labelledby="responsive-dialog-title"
        onClose={() => {
          setOpenAccept(false);
        }}
        disableBackdropClick
        disableEscapeKeyDown
        fullWidth
        style={{ maxHeight: "600px", marginTop: "100px" }}
      >
        <DialogTitle id="responsive-dialog-title">
          <span className="text-white font-weight-bold h4">
            Whould like to approve a Agency redeem request?
          </span>
        </DialogTitle>

        <IconButton style={{ position: "absolute", right: 0 }}>
          <Tooltip title="Close">
            <Cancel
              style={{ color: "#6b7280" }}
              onClick={() => {
                setOpenAccept(false);
              }}
            />
          </Tooltip>
        </IconButton>
        <DialogContent>
          <div className="modal-body pt-1 px-1 pb-3">
            <div className="d-flex flex-column">
              <form>
                <div className="mt-5">
                  <button
                    type="button"
                    className="btn-sm ml-2 float__right icon_margin"
                    style={{
                      background: "transparent",
                      border: "1px solid #1a6fd4",
                      color: "#1a6fd4",
                      borderRadius: 6,
                    }}
                    onClick={() => {
                      setOpenAccept(false);
                    }}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn-sm edit-btn float__right"
                    onClick={() => {
                      handleAcceptSubmit("accept");
                    }}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── SEARCH BAR ── */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="filter-bar">
            <div className="d-flex align-items-center justify-content-end flex-wrap gap-2">
              <div className="search-wrapper">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="search"
                  placeholder="Search by agency name"
                  aria-describedby="button-addon4"
                  className="search-input"
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TABLE CARD ── */}
      <div className="row mt-4">
        <div className="col">
          <div className="table-card">
            <div
              style={{ overflowX: "auto", width: "100%" }}
              // className="table-card-body"
            >
              <table className="table table-striped">
                <thead className="text-white">
                  <tr>
                    <th>No.</th>
                    <th>Agency Name</th>
                    <th>Agency Code</th>
                    <th>Description</th>
                    <th onClick={handleCoinSort} style={{ cursor: "pointer" }}>
                      RCoin {coinSort ? " ▼" : " ▲"}
                    </th>
                    <th>Amount({setting.currency?.symbol || "$"})</th>
                    <th>CreatedAt</th>
                    {canEdit && <th>Accept</th>}
                    {canEdit && <th>Decline</th>}
                  </tr>
                </thead>
                <tbody>
                  {data?.length > 0 ? (
                    (rowsPerPage > 0
                      ? data.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage,
                        )
                      : data
                    ).map((data, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{data.agency?.name}</td>
                          <td>
                            {data.agency?.agencyCode}{" "}
                            {data.agency?.agencyCode && (
                            <IconCopy
                              size={16}
                              className="ms-1"
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                copyToClipboard(data.agency?.agencyCode)
                              }
                            />
                            )}
                          </td>
                          <td>{data.description}</td>
                          <td>
                            <img
                              src={Rcoin}
                              width="15px"
                              height="15px"
                              style={{
                                verticalAlign: "middle",
                                marginRight: "1px",
                              }}
                            />{" "}
                            {data.rCoin}
                          </td>
                          <td>
                            {(data.rCoin / setting.rCoinForCashOut).toFixed(2)}{" "}
                            {setting.currency?.symbol}
                          </td>
                          <td>
                            {dayjs(data.createdAt).format("DD MMM, YYYY")}
                          </td>
                          {canEdit && (
                            <td>
                              <button
                                className="btn-sm edit-btn"
                                onClick={() => {
                                  setOpenAccept(true);
                                  setSelectedRequest(data);
                                }}
                              >
                                <i className="fa fa-check"></i> Accept
                              </button>
                            </td>
                          )}
                          {canEdit && (
                            <td>
                              <button
                                className="btn-sm delete-btn"
                                onClick={() => {
                                  setOpenDialogue(true);
                                  setSelectedRequest(data);
                                }}
                              >
                                <i className="fas fa-times"></i> Decline
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="10" align="center">
                        Nothing to show!!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-5">
              <Pagination
                activePage={activePage}
                rowsPerPage={rowsPerPage}
                userTotal={redeem.total}
                handleRowsPerPage={handleRowsPerPage}
                handlePageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { getAgencyRedeem, acceptRedeem, getSetting })(
  PendingRedeemTable,
);
