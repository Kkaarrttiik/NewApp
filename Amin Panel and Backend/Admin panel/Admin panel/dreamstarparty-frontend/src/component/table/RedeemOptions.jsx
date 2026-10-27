import React, { useEffect, useState, useRef } from "react";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//action
import {
  deleteRedeemOption,
  getRedeemOptions,
  updateRedeemOptStatus,
} from "../../store/redeemOptions/action";

//routing
//MUI
import { Tooltip } from "@mui/material";
// type
import { OPEN_REDEEM_OPT_DIALOG } from "../../store/redeemOptions/types";

// dialog
import RedeemOptions from "../dialog/RedeemOptions";

//sweet alert
import { alert, warning } from "../../util/Alert";

import { usePermission } from "../../context/PermissionProvider";

const TablePaginationActions = React.lazy(() => import("./TablePagination"));

const RedeemOptTable = (props) => {
  const dispatch = useDispatch();
  const [coinSort, setCoinSort] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activePage, setActivePage] = useState(1);

  const { can } = usePermission();
  const canCreate = can("admin/Setting", "Create");
  const canEdit = can("admin/Setting", "Edit");
  const canDelete = can("admin/Setting", "Delete");

  useEffect(() => {
    dispatch(getRedeemOptions());
  }, [dispatch]);

  const { redeemOptions } = useSelector((state) => state.redeemOption);

  useEffect(() => {
    setData(redeemOptions);
  }, [redeemOptions]);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
  };

  const searchTimeout = useRef(null);

  const handleSearch = (e) => {
    const value = e.target.value.toUpperCase()
      ? e.target.value.trim().toUpperCase()
      : e.target.value.trim();

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      if (value) {
        const filteredData = redeemOptions.filter((item) => {
          return (
            item?.name?.toUpperCase()?.indexOf(value) > -1
          );
        });
        setData(filteredData);
      } else {
        setData(redeemOptions);
      }
    }, 1000);
  };

  const handleDelete = (optId) => {

    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
          props.deleteRedeemOption(optId);
          alert("Deleted!", `Redeem Option has been deleted!`, "success");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = (data) => {

    dispatch({ type: OPEN_REDEEM_OPT_DIALOG, payload: data });
  };

  const handleOpen = () => {

    dispatch({ type: OPEN_REDEEM_OPT_DIALOG });
  };

  const handleSwitch = (id) => {
    dispatch(updateRedeemOptStatus(id));
  };

  return (
    <>
      <div className="page-title">
        {/* <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Redeem Options</h3>
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
                  Redeem Options
                </li>
              </ol>
            </nav>
          </div>
        </div> */}
      </div>

      {/* ── SEPARATE SEARCH/ACTION BAR ── */}
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
                    <i className="fa fa-plus"></i>
                    <span className="icon_margin">New</span>
                  </button>
                )}
              </div>

              {/* Right — Search */}
              <div className="search-wrapper">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="search"
                  placeholder="Search by name"
                  aria-describedby="button-addon4"
                  className="search-input"
                  onChange={handleSearch}
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
                <thead className="text-white">
                  <tr>
                    <th>No.</th>
                    <th>Name</th>
                    {canEdit && <th>Is Active</th>}
                    {canEdit && <th>Edit</th>}
                    {canDelete && <th>Delete</th>}
                  </tr>
                </thead>
                <tbody className="text-center">
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
                          <td>{data?.name}</td>
                          {canEdit && (
                            <td>
                              <label className="switch">
                                <input
                                  type="checkbox"
                                  checked={data?.isActive}
                                  onChange={() => handleSwitch(data?._id)}
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
                                  <i className="fa fa-edit"></i>
                                </button>
                              </Tooltip>
                            </td>
                          )}
                          {canDelete && (
                            <td>
                              <Tooltip title="Delete">
                                <button
                                  type="button"
                                  className="btn-sm delete-btn"
                                  onClick={() => handleDelete(data._id)}
                                >
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                              </Tooltip>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" align="center">
                        Nothing to show!!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {/* <Pagination
                activePage={activePage}
                rowsPerPage={rowsPerPage}
                userTotal={redeemOptions.length}
                handleRowsPerPage={handleRowsPerPage}
                handlePageChange={handlePageChange}
              /> */}
            </div>
          </div>
        </div>
      </div>
      <RedeemOptions />
    </>
  );
};

export default connect(null, {
  getRedeemOptions,
  deleteRedeemOption,
  updateRedeemOptStatus,
})(RedeemOptTable);
