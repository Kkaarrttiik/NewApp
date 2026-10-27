import { Tooltip } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import StaffDialog from "../component/dialog/StaffDialog";
import { usePermission } from "../context/PermissionProvider";
import { getRoles as fetchRoles } from "../store/role/action";
import {
  deleteStaff,
  getStaff,
  openStaffDialog,
  toggleStaffStatus,
} from "../store/staff/action";
import { warning } from "../util/Alert";
import Pagination from "./Pagination";

const StaffTable = () => {
  const dispatch = useDispatch();
  const { staff, total } = useSelector((state) => state.staff);
  const { can } = usePermission();
  const canCreate = can("admin/staff", "Create");
  const canEdit = can("admin/staff", "Edit");
  const canDelete = can("admin/staff", "Delete");
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setPage(1);
    setLimit(value);
  };

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getStaff({ start: page, limit }));
  }, [dispatch, page, limit]);

  useEffect(() => {
    setData(staff);
  }, [staff]);

  const handleSearch = (e) => {
    const value = (e.target.value || "").trim().toUpperCase();
    if (value) {
      setData(
        staff.filter(
          (s) =>
            s?.name?.toUpperCase?.()?.indexOf(value) > -1 ||
            s?.email?.toUpperCase?.()?.indexOf(value) > -1,
        ),
      );
    } else {
      setData(staff);
    }
  };

  const handleDelete = (subadminId) => {
    warning()
    .then((isDeleted) => {
      if (isDeleted) {
          dispatch(deleteStaff(subadminId));
        }
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = (row) => {
    dispatch(openStaffDialog(row));
  };

  const handleCreate = () => {
    dispatch(openStaffDialog());
  };

  const handleToggleStatus = (row) => {
    dispatch(toggleStaffStatus(row._id));
  };

  const getRoleName = (row) => {
    if (row?.role?.name) return row.role.name;
    if (row?.roleId) return row.roleId;
    return "–";
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Staff</h3>
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
                  Staff
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
                  <button
                    type="button"
                    className="edit-btn"
                    onClick={handleCreate}
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
                  placeholder="Search by name or email..."
                  aria-describedby="button-addon4"
                  className="search-input"
                  autoComplete="off"
                  readOnly
                  onFocus={(e) => e.target.removeAttribute("readOnly")}
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
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created</th>
                    <th>Updated</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {data?.length > 0 ? (
                    data.map((row, index) => (
                      <tr key={row._id || index}>
                        <td>{(page - 1) * limit + index + 1}</td>
                        <td>{row.name || "–"}</td>
                        <td>{row.email || "–"}</td>
                        <td>{getRoleName(row)}</td>
                        <td>
                          {row.createdAt
                            ? dayjs(row.createdAt).format("DD MMM, YYYY")
                            : "–"}
                        </td>
                        <td>
                          {row.updatedAt
                            ? dayjs(row.updatedAt).format("DD MMM, YYYY")
                            : "–"}
                        </td>
                        <td>
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={!!row.isActive}
                              onChange={() => handleToggleStatus(row)}
                            />
                            <span className="slider"></span>
                          </label>
                        </td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            {canEdit && (
                              <Tooltip title="Edit">
                                <button
                                  type="button"
                                  className="btn-sm edit-btn"
                                  onClick={() => handleEdit(row)}
                                >
                                  <i className="fa fa-edit"></i>
                                </button>
                              </Tooltip>
                            )}
                            {canDelete && (
                              <Tooltip title="Delete">
                                <button
                                  type="button"
                                  className="btn-sm delete-btn"
                                  onClick={() => handleDelete(row._id)}
                                >
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                              </Tooltip>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} align="center">
                        Nothing to show!!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-5">
              <Pagination
                activePage={page}
                rowsPerPage={limit}
                userTotal={total}
                handleRowsPerPage={handleRowsPerPage}
                handlePageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
      <StaffDialog />
    </>
  );
};

export default StaffTable;
