import { useEffect, useState } from "react";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//routing
import { Link } from "react-router-dom";

//MUI
import { Tooltip } from "@mui/material";

//action
import {
  deleteBdPaymentMethod,
  getBdPaymentMethod,
  toggleBdPaymentMethod,
} from "../../store/bdPaymentMethod/action";

//types
import { OPEN_BD_PAYMENT_METHOD_DIALOG } from "../../store/bdPaymentMethod/types";

//sweet alert
import { alert, warning } from "../../util/Alert";

import { usePermission } from "../../context/PermissionProvider";
import Pagination from "../../pages/Pagination";
import BdPaymentMethodDialog from "../dialog/BdPaymentMethodDialog";

const BdPaymentMethod = (props) => {
  const dispatch = useDispatch();
  const { can } = usePermission();
  const canCreate = can("admin/bdPaymentMethod", "Create");
  const canEdit = can("admin/bdPaymentMethod", "Edit");
  const canDelete = can("admin/bdPaymentMethod", "Delete");

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activePage, setActivePage] = useState(1);

  const { bdPaymentMethod, total } = useSelector(
    (state) => state.bdPaymentMethod,
  );

  useEffect(() => {
    dispatch(getBdPaymentMethod(page, rowsPerPage));
  }, [page, rowsPerPage]);

  useEffect(() => {
    setData(bdPaymentMethod);
  }, [bdPaymentMethod]);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setPage(1);
    setRowsPerPage(value);
  };

  const handleSearch = (e) => {
    const value = e.target.value.trim().toUpperCase();
    if (value) {
      const filtered = bdPaymentMethod.filter(
        (item) => item?.name?.toUpperCase()?.indexOf(value) > -1,
      );
      setData(filtered);
    } else {
      setData(bdPaymentMethod);
    }
  };

  const handleOpen = () => {
    dispatch({ type: OPEN_BD_PAYMENT_METHOD_DIALOG });
  };

  const handleEdit = (item) => {
    dispatch({ type: OPEN_BD_PAYMENT_METHOD_DIALOG, payload: item });
  };

  const handleDelete = (id) => {
    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
          props.deleteBdPaymentMethod(id);
          alert("Deleted!", "Payment method has been deleted!", "success");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleToggle = (id) => {
    props.toggleBdPaymentMethod(id);
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">BD Withdrawal</h3>
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
                  BD Withdrawal
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      {/* ── SEPARATE ACTION BAR ── */}
      {canCreate && (
        <div className="row mb-3">
          <div className="col-12">
            <div className="filter-bar">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <button type="button" className="edit-btn" onClick={handleOpen}>
                  <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> New
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SEPARATE TABLE CARD ── */}
      <div className="row mt-4">
        <div className="col">
          <div className="table-card">
            <div className="table-card-body">
              <div style={{ overflowX: "auto", width: "100%" }}>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Name</th>
                      <th>Required Details</th>
                      {canEdit && <th>Is Active</th>}
                      {(canEdit || canDelete) && <th>Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {data?.length > 0 ? (
                      data.map((item, index) => (
                        <tr key={item._id}>
                          <td>{(activePage - 1) * rowsPerPage + index + 1}</td>
                          <td>{item.name}</td>
                          <td>
                            <div className="d-flex flex-wrap justify-content-center gap-1">
                              {item.details &&
                                Object.keys(item.details).map((key, i) => (
                                  <span
                                    key={i}
                                    className="badge"
                                    style={{
                                      background: "transparent",
                                      border: "1px solid #1a6fd4",
                                      color: "#6ea8fe",
                                      borderRadius: "20px",
                                      padding: "4px 10px",
                                      fontSize: "12px",
                                    }}
                                  >
                                    {key}
                                  </span>
                                ))}
                            </div>
                          </td>
                          {canEdit && (
                            <td>
                              <label className="switch">
                                <input
                                  type="checkbox"
                                  checked={item.isActive}
                                  onChange={() => handleToggle(item._id)}
                                />
                                <span className="slider"></span>
                              </label>
                            </td>
                          )}
                          {(canEdit || canDelete) && (
                            <td>
                              <div className="d-flex align-items-center justify-content-center gap-2">
                                {canEdit && (
                                  <Tooltip title="Edit">
                                    <button
                                      type="button"
                                      className="btn-sm edit-btn"
                                      onClick={() => handleEdit(item)}
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
                                      onClick={() => handleDelete(item._id)}
                                    >
                                      <i className="fas fa-trash-alt fa-lg"></i>
                                    </button>
                                  </Tooltip>
                                )}
                              </div>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" align="center">
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
      </div>

      <BdPaymentMethodDialog />
    </>
  );
};

export default connect(null, {
  getBdPaymentMethod,
  deleteBdPaymentMethod,
  toggleBdPaymentMethod,
})(BdPaymentMethod);
