import { Tooltip } from "@mui/material";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Male from "../../../assets/images/male.png";
import { usePermission } from "../../../context/PermissionProvider";
import { getComplain, solvedComplain } from "../../../store/complain/action";
import { OPEN_COMPLAIN_DIALOG } from "../../../store/complain/types";
import { baseURL } from "../../../util/Config";
import ComplainDetails from "../../dialog/ComplainDetails";

const TablePaginationActions = React.lazy(() => import("../TablePagination"));

const ComplainRequest = (props) => {
  const dispatch = useDispatch();

  const [type, setType] = useState(() => {
    return localStorage.getItem("complainRequestTab") || "Pending";
  });
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { can } = usePermission();
  const canCreate = can("admin/complainRequest", "Create");
  const canEdit = can("admin/complainRequest", "Edit");

  const handleTabChange = (newType) => {
    setType(newType);
    localStorage.setItem("complainRequestTab", newType);
  };

  useEffect(() => {
    dispatch(getComplain(type.toLowerCase()));
  }, [dispatch, type]);

  const complain = useSelector((state) => state.complain.complain);

  useEffect(() => {
    setData(complain);
  }, [complain]);

  // ... rest of the handlers (handleChangePage, handleChangeRowsPerPage, handleSearch, etc.)

  const handleSolvedComplain = (id) => {
    props.solvedComplain(id);
  };

  const handleViewComplainDetail = (data) => {
    dispatch({ type: OPEN_COMPLAIN_DIALOG, payload: data });
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Complain Request</h3>
          </div>
          <div className="col-12 col-md-6 order-md-2 order-first">
            <nav
              aria-label="breadcrumb"
              className="breadcrumb-header float-start float-lg-end"
            >
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/admin/dashboard" className="text-white">
                    Dashboard
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Complain Request
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-12">
          <div className="filter-bar">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <button
                type="button"
                className="btn btn-sm"
                style={{
                  background: type === "Pending" ? "#1a6fd4" : "#1a1f2e",
                  color: type === "Pending" ? "#fff" : "#6b7280",
                  border: `1px solid ${type === "Pending" ? "#1a6fd4" : "#2a3050"}`,
                  borderRadius: 6,
                  transition: "0.2s",
                }}
                onClick={() => handleTabChange("Pending")}
              >
                Pending
              </button>
              <button
                type="button"
                className="btn btn-sm"
                style={{
                  background: type === "Solved" ? "#0f766e" : "#1a1f2e",
                  color: type === "Solved" ? "#99f6e4" : "#6b7280",
                  border: `1px solid ${type === "Solved" ? "#0f766e" : "#2a3050"}`,
                  borderRadius: 6,
                  transition: "0.2s",
                }}
                onClick={() => handleTabChange("Solved")}
              >
                Solved
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── SEPARATE TABLE CARD ── */}
      <div className="row mt-4">
        <div className="col">
          <div className="table-card">
            <div
              style={{ overflowX: "auto", width: "100%" }}
              // className="table-card-body"
            >
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>User</th>
                    <th>Complain Image</th>
                    <th>Message</th>
                    <th>Contact</th>
                    <th>CreatedAt</th>
                    {canEdit && type === "Pending" && <th>Solved</th>}
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
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
                            <div className="d-flex align-items-center justify-content-center">
                              <img
                                height="50px"
                                width="50px"
                                alt="app"
                                src={
                                  data?.userId?.image ? data?.userId?.image : Male
                                }
                                style={{
                                  boxShadow: "0 5px 15px 0 rgb(105 103 103 / 0%)",
                                  border: "2px solid #1e2640",
                                  borderRadius: 10,
                                  objectFit: "cover",
                                  display: "block",
                                }}
                                className=""
                              />
                              <span className="ms-2 d-flex align-items-center text-nowrap">
                                {data?.userId?.name}
                              </span>
                            </div>
                          </td>
                          <td className="mx-auto">
                            <div className="d-flex justify-content-center">
                              <img
                                height="50px"
                                width="50px"
                                alt="app"
                                src={data?.image ? baseURL + data?.image : Male}
                                style={{
                                  boxShadow:
                                    "0 5px 15px 0 rgb(105 103 103 / 0%)",
                                  border: "2px solid #1e2640",
                                  borderRadius: 10,
                                  objectFit: "cover",
                                  display: "block",
                                }}
                                className=""
                              />
                            </div>
                          </td>
                          <td>{data?.message ? data?.message : "-"}</td>
                          <td>{data?.contact ? data?.contact : "-"}</td>
                          <td className="text-nowrap">
                            {dayjs(data.createdAt).format("DD MMM, YYYY")}
                          </td>
                          {canEdit && type === "Pending" && (
                            <td>
                              <label className="switch">
                                <input
                                  type="checkbox"
                                  checked={data.solved}
                                  onChange={() =>
                                    handleSolvedComplain(data._id)
                                  }
                                />
                                <span className="slider"></span>
                              </label>
                            </td>
                          )}
                          <td>
                            <Tooltip title="Complain Details">
                              <button
                                type="button"
                                className="btn-sm edit-btn"
                                onClick={() => handleViewComplainDetail(data)}
                              >
                                <i className="fas fa-info-circle fa-lg"></i>
                              </button>
                            </Tooltip>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8" align="center">
                        Nothing to show!!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <ComplainDetails />
    </>
  );
};

export default connect(null, { getComplain, solvedComplain })(ComplainRequest);
