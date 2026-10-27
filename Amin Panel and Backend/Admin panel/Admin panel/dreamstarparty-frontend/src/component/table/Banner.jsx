import React, { useEffect, useState } from "react";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//action
import { deleteBanner, getBanner } from "../../store/banner/action";

//config
import { baseURL } from "../../util/Config";

//routing
import { Link } from "react-router-dom";

//MUI
import { Tooltip } from "@mui/material";

// type
import { OPEN_BANNER_DIALOG } from "../../store/banner/types";

// dialog
import BannerDialog from "../dialog/Banner";

//sweet alert
import { alert, warning } from "../../util/Alert";

import $ from "jquery";
//image
import noImage from "../../assets/images/noImage.png";
import { usePermission } from "../../context/PermissionProvider";

const TablePaginationActions = React.lazy(() => import("./TablePagination"));

const BannerTable = (props) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  // const [page, setPage] = useState(0);
  // const [rowsPerPage, setRowsPerPage] = useState(10);
  // const [activePage, setActivePage] = useState(1);
  // const [totalBanner, setTotalBanner] = useState(null);

  const { can } = usePermission();
  const canCreate = can("admin/banner", "Create");
  const canEdit = can("admin/banner", "Edit");
  const canDelete = can("admin/banner", "Delete");

  useEffect(() => {
    dispatch(getBanner());
  }, [dispatch]);

  const banner = useSelector((state) => state.banner.banner);

  useEffect(() => {
    setData(banner);
    // setTotalBanner(banner.length);
  }, [banner]);

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

  $(document).ready(function () {
    $("img").bind("error", function () {
      $(this).attr("src", noImage);
    });
  });

  const handleOpen = () => {
    dispatch({ type: OPEN_BANNER_DIALOG });
  };

  const handleDelete = (bannerId) => {
    const data = warning();
    data
    .then((isDeleted) => {
      if (isDeleted) {
          props.deleteBanner(bannerId);
          alert("Deleted!", `Banner has been deleted!`, "success");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = (data) => {
    dispatch({ type: OPEN_BANNER_DIALOG, payload: data });
  };

  // const handleRowsPerPage = (value) => {
  //   setActivePage(1);
  //   setRowsPerPage(value);
  // };

  // const handlePageChange = (pageNumber) => {
  //   setActivePage(pageNumber);
  // };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Banner</h3>
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
                  Banner
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      {/* ── SEPARATE SEARCH/ACTION BAR ── */}
      {canCreate && (
        <div className="row mb-3">
          <div className="col-12">
            <div className="filter-bar">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                {/* Left — New button */}
                <div className="d-flex align-items-center gap-2">
                  <button className="edit-btn" onClick={handleOpen}>
                    <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> New
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                    <th>Image</th>
                    <th>URL</th>
                    {(canEdit || canDelete) && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data?.map((data, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td className="d-flex justify-content-center">
                            <img
                              height="100px"
                              width="100px"
                              alt="app"
                              src={
                                data?.image ? baseURL + data?.image : noImage
                              }
                              style={{
                                border: "2px solid #1e2640",
                                borderRadius: 10,
                                display: "block",
                                objectFit: "contain",
                              }}
                            />
                          </td>
                          <td>
                            <a
                              target="_blank"
                              href={data?.URL}
                              style={{ color: "#6ea8fe" }}
                            >
                              {data.URL ? data.URL : "-"}
                            </a>
                          </td>
                          {(canEdit || canDelete) && (
                            <td>
                              <div className="d-flex align-items-center justify-content-center gap-2">
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
                                {canDelete && (
                                  <Tooltip title="Delete">
                                    <button
                                      type="button"
                                      className="delete-btn btn-sm"
                                      onClick={() => handleDelete(data._id)}
                                    >
                                      <i className="fas fa-trash-alt fa-lg"></i>
                                    </button>
                                  </Tooltip>
                                )}
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" align="center">
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
      <BannerDialog />
    </>
  );
};

export default connect(null, { getBanner, deleteBanner })(BannerTable);
