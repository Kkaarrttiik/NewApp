import React, { useEffect, useState, useRef } from "react";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//action
import {
  deleteVIPPlan,
  getVIPPlan,
  handleRenewalSwitch,
  isTop,
} from "../../store/vipPlan/action";

//routing
import { Link } from "react-router-dom";
//MUI
import { Tooltip } from "@mui/material";
// type
import { OPEN_VIP_PLAN_DIALOG } from "../../store/vipPlan/type";
// dialog
import VIPPlanDialog from "../dialog/VIPPlan";
//alert
import { usePermission } from "../../context/PermissionProvider";
import { getSetting } from "../../store/setting/action";
import { alert, warning } from "../../util/Alert";

import Pagination from "../../pages/Pagination";

const VIPPlanTable = (props) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activePage, setActivePage] = useState(1);

  const { setting } = useSelector((state) => state.setting);

  const { can } = usePermission();
  const canCreate = can("admin/mainPlan", "Create");
  const canEdit = can("admin/mainPlan", "Edit");
  const canDelete = can("admin/mainPlan", "Delete");

  useEffect(() => {
    dispatch(getVIPPlan());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getSetting());
  }, [dispatch]);

  const vipPlan = useSelector((state) => state.vipPlan.vipPlan);

  useEffect(() => {
    setData(vipPlan);
  }, [vipPlan]);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
  };

  const searchTimeout = useRef(null);

  const handleSearchChange = (e) => {
    const value = e.target.value.toUpperCase()
      ? e.target.value.trim().toUpperCase()
      : e.target.value.trim();

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    searchTimeout.current = setTimeout(() => {
      if (value) {
        const filteredData = vipPlan.filter((data) => {
          return (
            data?.tag?.toUpperCase()?.indexOf(value) > -1 ||
            data?.dollar?.toString()?.indexOf(value) > -1 ||
            data?.diamonds?.toString()?.indexOf(value) > -1
          );
        });
        setData(filteredData);
      } else {
        setData(vipPlan);
      }
    }, 1000);
  };

  const handleOpen = () => {

    dispatch({ type: OPEN_VIP_PLAN_DIALOG });
  };

  const handleEdit = (data) => {

    dispatch({ type: OPEN_VIP_PLAN_DIALOG, payload: data });
  };

  const handleDelete = (vipPlanId) => {

    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
          props.deleteVIPPlan(vipPlanId);
          alert("Deleted!", `Plan has been deleted!`, "success");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleIsTop = (id) => {

    props.isTop(id);
  };

  return (
    <>
      <div className="page-title">
        {props.type !== "vipPlan" && (
          <div className="row">
            <div className="col-12 col-md-6 order-md-1 order-last">
              <h3 className="mb-3 text-white">VIP Plan</h3>
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
                    Plan
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* ── FILTER BAR ── */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="filter-bar">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
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
              <div className="search-wrapper">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="search"
                  placeholder="Search by amount or tag"
                  className="search-input"
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
                      <th>Validity</th>
                      <th>{`Amount (${setting?.currency?.symbol || "$"})`}</th>
                      <th>Tag</th>
                      {canEdit && <th>Is Top</th>}
                      {canEdit && <th>Edit</th>}
                      {canDelete && <th>Delete</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {data.length > 0 ? (
                      data?.slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage).map((data, index) => {
                        return (
                          <tr key={index}>
                            <td>{(activePage - 1) * rowsPerPage + index + 1}</td>
                            <td>
                              {data.validity} &nbsp;{data.validityType}
                            </td>
                            <td>
                              {data.dollar} {setting?.currency?.symbol || "$"}
                            </td>
                            <td>{data.tag ? data.tag : "-"}</td>
                            {canEdit && (
                              <td>
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    checked={data.isTop}
                                    onChange={() => handleIsTop(data._id)}
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
                            {canDelete && (
                              <td>
                                <Tooltip title="Delete">
                                  <button
                                    type="button"
                                    className="btn-sm delete-btn"
                                    onClick={() => handleDelete(data._id)}
                                  >
                                    <i className="fas fa-trash-alt fa-lg"></i>
                                  </button>
                                </Tooltip>
                              </td>
                            )}
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
              <div className="px-5">
                <Pagination
                  activePage={activePage}
                  rowsPerPage={rowsPerPage}
                  userTotal={data.length}
                  handleRowsPerPage={handleRowsPerPage}
                  handlePageChange={handlePageChange}
                />
              </div>
            {/* </div> */}
          </div>
        </div>
      </div>
      <VIPPlanDialog />
    </>
  );
};

export default connect(null, {
  getVIPPlan,
  handleRenewalSwitch,
  deleteVIPPlan,
  isTop,
})(VIPPlanTable);
