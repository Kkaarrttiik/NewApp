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
  acceptBdRedeem,
  clearBdRedeem,
  declineBdRedeem,
  getBdRedeem,
} from "../../../store/bdRedeem/action";

import { Cancel } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import { IconCopy } from "@tabler/icons-react";
import swal from "sweetalert";
import { usePermission } from "../../../context/PermissionProvider";
import Pagination from "../../../pages/Pagination";
import { Toast } from "../../../util/Toast";

const TablePaginationActions = React.lazy(() => import("../TablePagination"));

const PendingRedeemTable = (props) => {
  const dispatch = useDispatch();
  const { can } = usePermission();
  const canCreate = can("admin/bdRedeem", "Create");
  const canEdit = can("admin/bdRedeem", "Edit");

  const [coinSort, setCoinSort] = useState(true);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialogue, setOpenDialogue] = useState(false);
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activePage, setActivePage] = useState(1);

  useEffect(() => {
    dispatch(getSetting());
    dispatch(clearBdRedeem());
  }, [dispatch]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(getBdRedeem("pending", activePage, rowsPerPage, search));
    }, 100);
    return () => clearTimeout(timeout);
  }, [activePage, rowsPerPage]);

  const redeem = useSelector((state) => state.bdRedeem.bdRedeem);
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
      dispatch(getBdRedeem("pending", 1, rowsPerPage, value));
    }, 1000);
  };

  const handleAcceptSubmit = (data) => {
    swal({
      title: "Approve Request?",
      text: "This BD redeem request will be approved.",
      icon: "info",
      buttons: true,
      dangerMode: true,
    }).then((willAccept) => {
      if (willAccept) {
        dispatch(acceptBdRedeem(data?._id, data?.bd?._id, "accept"));

        swal(
          "Approved!",
          "BD redeem request has been approved successfully.",
          "success",
        );
      }
    });
  };

  const handleCoinSort = () => {
    setCoinSort(!coinSort);
    arraySort(data, "amount", { reverse: coinSort });
  };

  const validateDecline = () => {
    let error = {};
    let isValid = true;
    if (!reason || !reason.trim()) {
      error.reason = "Please enter valid reason!";
      isValid = false;
    }
    setErrors(error);
    return isValid;
  };

  const handleDeclineClick = (data) => {
    setSelectedRequest(data);
    setOpenDialogue(true);
  };

  const handleDeclineSubmit = () => {
    if (validateDecline()) {
      swal({
        title: "Decline Request?",
        text: "This BD redeem request will be declined.",
        icon: "warning",
        buttons: ["Cancel", "Decline"],
        dangerMode: true,
      }).then((willDecline) => {
        if (willDecline) {
          dispatch(
            declineBdRedeem(
              selectedRequest?._id,
              selectedRequest?.bd?._id,
              "decline",
              reason,
            ),
          );
          setOpenDialogue(false);
          setReason("");
        }
      });
    }
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
      {/* Dialog stays exactly the same — no changes */}
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
          <span className="text-danger font-weight-bold h4"> Add Reason </span>
        </DialogTitle>

        <IconButton
          style={{
            position: "absolute",
            right: 0,
          }}
        >
          <Tooltip title="Close">
            <Cancel
              className="text-danger"
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
                    className="btn btn-outline-info ml-2 btn-round float__right icon_margin"
                    onClick={() => {
                      setOpenDialogue(false);
                      setReason("");
                    }}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-round float__right btn-danger"
                    onClick={handleDeclineSubmit}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── SEPARATE SEARCH/ACTION BAR ── */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="filter-bar">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div></div>
              <div className="search-wrapper">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="search"
                  placeholder="Search by name"
                  className="search-input"
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SEPARATE TABLE CARD ── */}
      <div className="row mt-4">
        <div className="col">
          <div className="table-card">
            {/* <div className="table-card-body"> */}
              <div style={{ overflowX: "auto", width: "100%" }}>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Profile</th>
                      <th>Unique ID</th>
                      <th>BD Code</th>
                      <th
                        onClick={handleCoinSort}
                        style={{ cursor: "pointer" }}
                      >
                        Amount {coinSort ? " ▼" : " ▲"}
                      </th>
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
                            <td>
                              <img
                                src={data.bd?.image}
                                alt="Profile"
                                width="40px"
                                height="40px"
                                style={{
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                  border: "2px solid #1e2640",
                                  marginRight: 8,
                                }}
                              />
                              {data.bd?.name}
                            </td>
                            <td>{data.bd?.uniqueId}</td>
                            <td>
                              {data.bd?.bdCode || "-"}
                              {data.bd?.bdCode && (
                              <IconCopy
                                size={16}
                                className="ms-1"
                                style={{ cursor: "pointer" }}
                                onClick={() => copyToClipboard(data.bd?.bdCode)}
                              />
                              )}
                            </td>
                            <td>{data.amount}</td>
                            <td>
                              {dayjs(data.createdAt).format("DD MMM, YYYY")}
                            </td>
                            {canEdit && (
                              <td>
                                <button
                                  className="btn-sm edit-btn"
                                  onClick={() => {
                                    handleAcceptSubmit(data);
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
                                    handleDeclineClick(data);
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
            {/* </div> */}
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

export default connect(null, { getBdRedeem, acceptBdRedeem, getSetting })(
  PendingRedeemTable,
);
