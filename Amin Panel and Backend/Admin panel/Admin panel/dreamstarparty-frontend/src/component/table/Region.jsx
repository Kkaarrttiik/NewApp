import React, { useEffect, useState, useRef } from "react";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//action
import {
  deleteRegion,
  getRegion,
  handleVIPSwitchRegion,
} from "../../store/region/action";

//routing
import { Link } from "react-router-dom";

//MUI
import { Tooltip } from "@mui/material";

//sweet alert
import { usePermission } from "../../context/PermissionProvider";
import { alert, warning } from "../../util/Alert";

//image
import Pagination from "../../pages/Pagination";
import { OPEN_REGION_DIALOG } from "../../store/region/type";
import RegionDialog from "../dialog/RegionDialog";

const TablePaginationActions = React.lazy(() => import("./TablePagination"));

const Region = (props) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activePage, setActivePage] = useState(1);

  const { can } = usePermission();
  const canCreate = can("admin/region", "Create");
  const canEdit = can("admin/region", "Edit");
  const canDelete = can("admin/region", "Delete");

  useEffect(() => {
    dispatch(getRegion({ start: page, limit: rowsPerPage }));
  }, [dispatch, rowsPerPage, page]);

  const { name, total } = useSelector((state) => state.region);

  useEffect(() => {
    setData(name);
  }, [name]);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
  };

  const handleIsTop = (id) => {
    dispatch(handleVIPSwitchRegion(id));
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
        const filteredData = name.filter((item) => {
          return item?.name?.toUpperCase()?.indexOf(val) > -1;
        });
        setData(filteredData);
      } else {
        setData(name);
      }
    }, 1000);
  };

  const handleOpen = () => {

    dispatch({ type: OPEN_REGION_DIALOG });
  };

  const handleDelete = (nameId) => {

    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
          props.deleteRegion(nameId);
          alert("Deleted!", `name has been deleted!`, "success");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = (data) => {

    dispatch({ type: OPEN_REGION_DIALOG, payload: data });
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Region</h3>
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
                  Region
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
                    <th>Name</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                    {canEdit && <th>Is Active</th>}
                    {(canEdit || canDelete) && <th>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {data?.length > 0 ? (
                    data?.map((data, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{data?.name}</td>
                          <td>{new Date(data?.createdAt).toLocaleString()}</td>
                          <td>{new Date(data?.updatedAt).toLocaleString()}</td>
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
                                      className="btn-sm delete-btn"
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
                      <td colSpan="6" align="center">
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
      <RegionDialog />
    </>
  );
};

export default connect(null, { deleteRegion, getRegion })(Region);
