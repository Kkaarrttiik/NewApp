import { Tooltip } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PermissionShowDialog from "../component/dialog/PermissionShowDialog";
import RoleDialog from "../component/dialog/RoleDialog";
import { usePermission } from "../context/PermissionProvider";
import {
  deleteRole,
  getRoles,
  openRoleDialog,
  toggleRoleStatus,
} from "../store/role/action";
import { alert, warning } from "../util/Alert";
import Pagination from "./Pagination";

const RoleTable = () => {
  const dispatch = useDispatch();
  const { roles, total } = useSelector((state) => state.role);
  const { can } = usePermission();
  const canCreate = can("admin/role", "Create");
  const canEdit = can("admin/role", "Edit");
  const canDelete = can("admin/role", "Delete");
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setPage(1);
    setLimit(value);
  };

  useEffect(() => {
    dispatch(getRoles({ start: page, limit }));
  }, [dispatch, page, limit]);

  useEffect(() => {
    setData(roles);
  }, [roles]);

  const handleSearch = (e) => {
    const value = (e.target.value || "").trim().toUpperCase();
    if (value) {
      setData(
        roles.filter(
          (role) => role?.name?.toUpperCase?.()?.indexOf(value) > -1,
        ),
      );
    } else {
      setData(roles);
    }
  };

  const handleDelete = (roleId) => {
    warning()
    .then((isDeleted) => {
      if (isDeleted) {
          dispatch(deleteRole(roleId));
          alert("Deleted!", "Role has been deleted!", "success");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = (role) => {
    dispatch(openRoleDialog(role));
  };

  const handleCreate = () => {
    dispatch(openRoleDialog());
  };

  const handleToggleStatus = (role) => {
    dispatch(toggleRoleStatus(role._id));
  };

  const handleViewPermissions = (role) => {
    setSelectedRole(role);
    setPermissionDialogOpen(true);
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Access Roles</h3>
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
                  Access Roles
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
                  placeholder="Search by role name..."
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
                    <th>Created</th>
                    <th>Updated</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {data?.length > 0 ? (
                    data.map((role, index) => (
                      <tr key={role._id || index}>
                        <td>{index + 1}</td>
                        {/* <td>{(page - 1) * limit + index + 1}</td> */}
                        <td>{role.name}</td>
                        <td>
                          {role.createdAt
                            ? dayjs(role.createdAt).format("DD MMM, YYYY")
                            : "–"}
                        </td>
                        <td>
                          {role.updatedAt
                            ? dayjs(role.updatedAt).format("DD MMM, YYYY")
                            : "–"}
                        </td>
                        <td>
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={!!role.isActive}
                              onChange={() => handleToggleStatus(role)}
                            />
                            <span className="slider"></span>
                          </label>
                        </td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <Tooltip title="View permissions">
                              <button
                                style={{
                                  background: "#0f766e",
                                  color: "#99f6e4",
                                  border: "none",
                                }}
                                type="button"
                                className="btn-sm edit-btn"
                                onClick={() => handleViewPermissions(role)}
                              >
                                <i className="fa fa-eye"></i>
                              </button>
                            </Tooltip>
                            {canEdit && (
                              <Tooltip title="Edit">
                                <button
                                  type="button"
                                  className="btn-sm edit-btn"
                                  onClick={() => handleEdit(role)}
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
                                  onClick={() => handleDelete(role._id)}
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
                      <td colSpan={6} align="center">
                        Nothing to show!!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* <div className="px-5">
              <Pagination
                activePage={page}
                rowsPerPage={limit}
                userTotal={total}
                handleRowsPerPage={handleRowsPerPage}
                handlePageChange={handlePageChange}
              />
            </div> */}
          </div>
        </div>
      </div>
      <RoleDialog />
      <PermissionShowDialog
        open={permissionDialogOpen}
        onClose={() => {
          setPermissionDialogOpen(false);
          setSelectedRole(null);
        }}
        role={selectedRole || {}}
      />
    </>
  );
};

export default RoleTable;
