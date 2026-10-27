import React, { useEffect, useState, useRef } from "react";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//action
import { deleteRegion } from "../../store/region/action";

//routing
import { Link, useNavigate } from "react-router-dom";

//MUI
import { Tooltip } from "@mui/material";

//sweet alert
import { usePermission } from "../../context/PermissionProvider";

//image
import male from "../../assets/images/male.png";
import Pagination from "../../pages/Pagination";
import { getBd, handleVIPSwitchBd } from "../../store/Bd/action";
import { OPEN_BD_DIALOG } from "../../store/Bd/type";
import BdCoinDialog from "../dialog/BdCoinDialogue";
import BdDialogue from "../dialog/BdDialogue";

const TablePaginationActions = React.lazy(() => import("./TablePagination"));

const Bd = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [coinDialog, setCoinDialog] = useState(false);
  const [selectedBd, setSelectedBd] = useState(null);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activePage, setActivePage] = useState(1);

  const { can } = usePermission();
  const canCreate = can("admin/bd", "Create");
  const canEdit = can("admin/bd", "Edit");

  useEffect(() => {
    dispatch(getBd({ start: page, limit: rowsPerPage }));
  }, [dispatch, page, rowsPerPage]);

  const { bdData, total } = useSelector((state) => state.bd);

  useEffect(() => {
    setData(bdData);
  }, [bdData]);

  const handleIsTop = (id) => {
    dispatch(handleVIPSwitchBd(id));
  };

  const searchTimeout = useRef(null);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      const val = value.trim().toUpperCase();
      if (val) {
        const filteredData = bdData.filter((item) => {
          return item?.name?.toUpperCase()?.indexOf(val) > -1;
        });
        setData(filteredData);
      } else {
        setData(bdData);
      }
    }, 1000);
  };

  const handleOpen = () => {
    dispatch({ type: OPEN_BD_DIALOG });
  };

  const handleEdit = (data) => {
    dispatch({ type: OPEN_BD_DIALOG, payload: data });
  };

  const handleViewProfile = (id) => {
    navigate("/admin/bd/profile", { state: { id } });
  };

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setPage(1);
    setRowsPerPage(value);
  };

  const handleCoinDialog = (data) => {
    setSelectedBd(data);
    setCoinDialog(true);
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Bd</h3>
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
                  Bd
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      {/* ── SEPARATE SEARCH/ACTION BAR ── */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="filter-bar">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              {/* Left — New button */}
              <div className="d-flex align-items-center gap-2">
                {canCreate && (
                  <button className="edit-btn" onClick={handleOpen}>
                    <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> New
                  </button>
                )}
              </div>

              {/* Right — Search */}
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
            <div
              style={{ overflowX: "auto", width: "100%" }}
              // className="table-card-body"
            >
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>BD Code</th>
                    <th className="text-nowrap">Profile</th>
                    <th>User</th>
                    <th>Regions</th>
                    <th className="text-nowrap">Commission (%)</th>
                    <th>rCoin</th>
                    <th className="text-nowrap">Total Withdrawn</th>
                    <th className="text-nowrap">Net Coin</th>
                    {canEdit && <th>Is Active</th>}
                    <th>Mobile</th>
                    <th className="text-nowrap">Created At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.length > 0 ? (
                    data?.map((data, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td className="text-nowrap">{data?.bdCode}</td>
                          {/* Profile */}
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <img
                                height="50px"
                                width="50px"
                                alt="app"
                                src={data?.image || male}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = male;
                                }}
                                style={{
                                  border: "2px solid #1e2640",
                                  borderRadius: 10,
                                  objectFit: "cover",
                                  display: "block",
                                }}
                              />
                              <div className="text-start">
                                <p className="m-0 small-text text-nowrap">
                                  {data?.name ? data?.name : "-"}
                                </p>
                                <p
                                  className="m-0 small-text text-nowrap"
                                  style={{ color: "#9CA3AF" }}
                                >
                                  • {data?.uniqueId ? data?.uniqueId : "-"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* User */}
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <img
                                height="50px"
                                width="50px"
                                alt="app"
                                src={data?.user?.image || male}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = male;
                                }}
                                style={{
                                  border: "2px solid #1e2640",
                                  borderRadius: 10,
                                  objectFit: "cover",
                                  display: "block",
                                }}
                              />
                              <div className="text-start">
                                <p className="m-0 small-text text-nowrap">
                                  {data?.user?.name ? data?.user?.name : "-"}
                                </p>
                                <p
                                  className="m-0 small-text text-nowrap"
                                  style={{ color: "#9CA3AF" }}
                                >
                                  •{" "}
                                  {data?.user?.uniqueId
                                    ? data?.user?.uniqueId
                                    : "-"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Regions */}
                          <td>
                            {data?.regions.length < 1
                              ? "-"
                              : data?.regions?.map((region) => (
                                  <span
                                    key={region._id}
                                    className="badge mb-2"
                                    style={{
                                      background: "#1e2d50",
                                      color: "#6ea8fe",
                                      border: "1px solid #2a3f6f",
                                      marginRight: 4,
                                    }}
                                  >
                                    {region.name}
                                  </span>
                                ))}
                          </td>

                          <td>{data?.bdCommission}</td>
                          <td>{data?.rCoin}</td>
                          <td>{data?.totalWithdrawn}</td>
                          <td>{data?.netCoin}</td>

                          {/* Is Active Toggle */}
                          {canEdit && (
                            <td>
                              <label className="switch">
                                <input
                                  type="checkbox"
                                  checked={data?.isActive}
                                  onChange={() => handleIsTop(data?._id)}
                                />
                                <span className="slider"></span>
                              </label>
                            </td>
                          )}

                          <td>{data?.mobile}</td>
                          <td className="text-nowrap">
                            {new Date(data?.createdAt).toLocaleString()}
                          </td>

                          {/* Actions */}
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              {canEdit && (
                                <Tooltip title="Edit">
                                  <button
                                    type="button"
                                    className="btn-sm edit-btn"
                                    onClick={() => handleEdit(data)}
                                  >
                                    <i className="fa fa-edit fa-lg"></i>
                                  </button>
                                </Tooltip>
                              )}

                              <Tooltip title="Profile">
                                <button
                                  type="button"
                                  className="btn-sm delete-btn"
                                  onClick={() => handleViewProfile(data._id)}
                                >
                                  <i className="fa fa-user fa-lg"></i>
                                </button>
                              </Tooltip>

                              <Tooltip title="Agency">
                                <button
                                  type="button"
                                  className="btn-sm edit-btn"
                                  onClick={() =>
                                    navigate("/admin/bd/agency", {
                                      state: { id: data._id },
                                    })
                                  }
                                >
                                  <i className="fa fa-image fa-lg"></i>
                                </button>
                              </Tooltip>

                              {canEdit && (
                                <Tooltip title="Coin">
                                  <button
                                    type="button"
                                    className="btn-sm delete-btn"
                                    onClick={() => handleCoinDialog(data)}
                                  >
                                    <i className="fa fa-coins fa-lg"></i>
                                  </button>
                                </Tooltip>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="12" align="center">
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
                userTotal={total}
                handleRowsPerPage={handleRowsPerPage}
                handlePageChange={handlePageChange}
              />
              </div>
          </div>
        </div>
      </div>

      <BdCoinDialog
        open={coinDialog}
        onClose={() => setCoinDialog(false)}
        bdData={selectedBd}
        page={page}
        rowsPerPage={rowsPerPage}
      />
      <BdDialogue />
    </>
  );
};

export default connect(null, { deleteRegion, getBd })(Bd);
