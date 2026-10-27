import { useEffect, useState, useRef } from "react";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//action
import {
  enableDisableAgency,
  getAgency,
  redeemEnableAgency,
} from "../store/agency/action";

//routing
import $ from "jquery";
import { Link } from "react-router-dom";
import Male from "../assets/images/male.png";
//MUI
import { Tooltip } from "@mui/material";

import AgencyDialogue from "../component/dialog/AgencyDialogue";

//sweet alert
import { IconCopy } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import Rcoin from "../assets/images/rcoin.webp";
import { usePermission } from "../context/PermissionProvider";
import { OPEN_AGENCY_DIALOG } from "../store/agency/type";
import { alert, warning } from "../util/Alert";
import Pagination from "./Pagination";
import { Toast } from "../util/Toast";

const AgencyDetails = (props) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const searchTimeout = useRef(null);
  const { can } = usePermission();
  const canCreate = can("admin/agency", "Create");
  const canEdit = can("admin/agency", "Edit");
  const canDelete = can("admin/agency", "Delete");

  useEffect(() => {
    dispatch(getAgency(activePage, rowsPerPage, search));
  }, [activePage, rowsPerPage]);

  const { agency, total } = useSelector((state) => state.agency);

  useEffect(() => {
    setData(agency);
  }, [agency]);

  const totalHosts = data?.length || 0;
  const totalCoin = data?.reduce(
    (sum, item) => sum + (Number(item?.totalCoin) || 0),
    0,
  );
  const agencyCommission = 0; // replace with actual value when available
  const bdCommission = 0; // replace with actual value when available

  // useEffect(() => {
  //   handleSearch();
  // }, [search, agency]);

  //   pagination

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
  };

  $(document).ready(function () {
    $("img").bind("error", function () {
      // Set the default image
      $(this).attr("src", Male);
    });
  });

    const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      setActivePage(1);
      dispatch(getAgency(1, rowsPerPage, value));
    }, 1000);
  };
  // const handleSearch = () => {
  //   const value = search.trim().toLowerCase();

  //   if (value) {
  //     const filteredData = agency.filter((data) => {
  //       return (
  //         data?.name?.toLowerCase().includes(value) ||
  //         data?.uniqueId?.toString().includes(value) ||
  //         data?.agencyCode?.toString().includes(value) ||
  //         data?.totalCoin?.toString().includes(value)
  //       );
  //     });
  //     setData(filteredData);
  //   } else {
  //     setData(agency);
  //   }
  // };

  const handleOpen = () => {
    dispatch({ type: OPEN_AGENCY_DIALOG });
  };

  const handleDelete = (planId) => {
    const data = warning();
    data
    .then((isDeleted) => {
      if (isDeleted) {
          props.enableDisableAgency(planId);
          alert("Deleted!", `Plan has been deleted!`, "success");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = (data) => {
    dispatch({ type: OPEN_AGENCY_DIALOG, payload: data });
  };

  const handleIsTop = (id) => {

    dispatch(enableDisableAgency(id));
  };

  const handleEnabledRedeem = (id) => {
    dispatch(redeemEnableAgency(id));
  };

  const copyToClipboard = (Text) => {
    navigator.clipboard.writeText(Text);
    Toast("success", "Copied successfully!");
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Agency</h3>
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
                  Agency
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      {/* ── FILTER BAR ── */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="filter-bar">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              {/* Left — New button */}

              <div className="d-flex align-items-center gap-2">
                {canCreate && (
                  <button
                    type="button"
                    className="edit-btn"
                    onClick={handleOpen}
                    id="bannerDialog"
                  >
                    <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> New
                  </button>
                )}
              </div>

              {/* Right — Search */}
              <div className="search-wrapper">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="search"
                  id="searchBar"
                  autoComplete="off"
                  placeholder="Search by agency name"
                  className="search-input"
                  value={search}
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
            {/* <div className="table-card-body"> */}
              <div style={{ overflowX: "auto", width: "100%" }}>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Agency</th>
                      <th>UniqueId</th>
                      <th className="text-nowrap">Agency Code</th>
                      <th>MobileNumber</th>
                      <th className="text-nowrap">Total Coin</th>
                      <th className="text-nowrap">Created At</th>
                      {canEdit && <th className="text-nowrap">Is Active</th>}
                      {canEdit && <th>Action</th>}
                      <th>Host</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.length > 0 ? (
                      data.map((data, index) => {
                        return (
                          <tr key={index}>
                            <td>
                              {(activePage - 1) * rowsPerPage + index + 1}
                            </td>

                            <td className="d-flex align-items-center">
                              <img
                                height="50px"
                                width="50px"
                                alt="app"
                                src={data?.image ? data?.image : Male}
                                style={{
                                  border: "2px solid #1e2640",
                                  borderRadius: 10,
                                  objectFit: "cover",
                                  display: "block",
                                }}
                              />
                              <span className="ms-2 d-flex align-items-center text-nowrap">
                                {data?.name}
                              </span>
                            </td>

                            <td className="text-nowrap">
                              {data?.uniqueId && data.uniqueId !== "-" ? (
                                <>
                                  {data.uniqueId || "-"}
                                  <IconCopy
                                    size={16}
                                    className="ms-1"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      copyToClipboard(data.uniqueId)
                                    }
                                  />
                                </>
                              ) : (
                                "-"
                              )}
                            </td>

                            <td className="text-nowrap">
                              {data?.agencyCode}
                              <IconCopy
                                size={16}
                                className="ms-1"
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  copyToClipboard(
                                    data?.agencyCode ? data?.agencyCode : "-",
                                  )
                                }
                              />
                            </td>

                            <td>{data?.mobile}</td>

                            <td className="text-success text-nowrap">
                              <img
                                src={Rcoin}
                                width="15px"
                                height="15px"
                                style={{
                                  verticalAlign: "middle",
                                  marginRight: "1px",
                                }}
                              />{" "}
                              {data?.totalCoin ? data?.totalCoin : 0}
                            </td>

                            <td className="text-nowrap">
                              {dayjs(data?.createdAt).format("DD MMM, YYYY")}
                            </td>

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

                            {canEdit && (
                              <td>
                                <Tooltip title="Edit">
                                  <button
                                    type="button"
                                    className="btn-sm edit-btn"
                                    onClick={() => handleEdit(data)}
                                  >
                                    <i className="fa fa-edit fa-lg"></i>
                                  </button>
                                </Tooltip>
                              </td>
                            )}

                            <td>
                              <div className="d-flex justify-content-center">
                                <Tooltip title="Host">
                                  <button
                                    type="button"
                                    className="btn-sm delete-btn"
                                    onClick={() =>
                                      navigate("/admin/agency/agencyWiseHost", {
                                        state: data,
                                      })
                                    }
                                  >
                                    <i className="fa fa-users fa-lg"></i>
                                  </button>
                                </Tooltip>
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
            {/* </div> */}
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
      <AgencyDialogue />
    </>
  );
};

export default connect(null, { getAgency, enableDisableAgency })(AgencyDetails);
