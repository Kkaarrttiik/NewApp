import { useEffect, useState, useRef } from "react";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//action
import {
  AccessibleFunctionLevel,
  deleteLevel,
  getLevel,
} from "../../store/level/action";

//routing
import { Link } from "react-router-dom";
//MUI
import { Tooltip } from "@mui/material";
// type
import { OPEN_LEVEL_DIALOG } from "../../store/level/types";

// dialog
import LevelDialog from "../dialog/Level";

//sweet alert
import { usePermission } from "../../context/PermissionProvider";
import { alert, warning } from "../../util/Alert";
import { baseURL } from "../../util/Config";

import arraySort from "array-sort";

//image
import noImage from "../../assets/images/noImage.png";
import Rcoin from "../../assets/images/rcoin.webp";
import Pagination from "../../pages/Pagination";

const LevelTable = (props) => {
  const dispatch = useDispatch();
  const [coinSort, setCoinSort] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activePage, setActivePage] = useState(1);
  const { can } = usePermission();
  const canCreate = can("admin/level", "Create");
  const canEdit = can("admin/level", "Edit");
  const canDelete = can("admin/level", "Delete");

  useEffect(() => {
    dispatch(getLevel({ start: page, limit: rowsPerPage }));
  }, [dispatch, page, rowsPerPage]);

  const { level, total } = useSelector((state) => state.level);

  useEffect(() => {
    setData(level);
  }, [level]);

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
        const filteredData = level.filter((item) => {
          return (
            item?.name?.toUpperCase()?.indexOf(value) > -1 ||
            item?.coin?.toString()?.indexOf(value) > -1
          );
        });
        setData(filteredData);
      } else {
        setData(level);
      }
    }, 1000);
  };

  const handleDelete = (levelId) => {
    const data = warning();
    data
    .then((isDeleted) => {
      if (isDeleted) {
          props.deleteLevel(levelId);
          alert("Deleted!", `Level has been deleted!`, "success");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = (data) => {
    dispatch({ type: OPEN_LEVEL_DIALOG, payload: data });
  };

  const handleOpen = () => {
    dispatch({ type: OPEN_LEVEL_DIALOG });
  };

  const handleCoinSort = () => {
    setCoinSort(!coinSort);
    arraySort(data, "coin", { reverse: coinSort });
  };

  const handleAccessFunction = (id, name) => {
    const data = {
      levelId: id,
      fieldName: name,
    };
    props.AccessibleFunctionLevel(data);
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Level</h3>
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
                  Level
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
                  placeholder="Search by level name or coin"
                  className="search-input"
                  onChange={handleSearch}
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
                      <th>Image</th>
                      <th>Level Name</th>
                      <th
                        onClick={handleCoinSort}
                        style={{ cursor: "pointer" }}
                      >
                        Coin {coinSort ? " ▼" : " ▲"}
                      </th>
                      {canEdit && <th>Accessible Function</th>}
                      {canEdit && <th>Edit</th>}
                      {canDelete && <th>Delete</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {data?.length > 0 ? (
                      data?.map((data, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              <img
                                height="50px"
                                width="50px"
                                alt="app"
                                src={
                                  data.image ? baseURL + data.image : noImage
                                }
                                style={{
                                  border: "2px solid #1e2640",
                                  borderRadius: 10,
                                  objectFit: "cover",
                                  display: "block",
                                }}
                                className="mx-auto"
                              />
                            </td>
                            <td>{data.name}</td>
                            <td>
                              <img
                                src={Rcoin}
                                width="15px"
                                height="15px"
                                style={{
                                  verticalAlign: "middle",
                                  marginRight: "1px",
                                }}
                              />{" "}
                              {data.coin}
                            </td>
                            {canEdit && (
                              <td>
                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`liveStreaming-${data._id}`}
                                    checked={
                                      Object.keys(
                                        data.accessibleFunction,
                                      ).includes("liveStreaming") &&
                                      data.accessibleFunction.liveStreaming
                                    }
                                    onChange={() =>
                                      handleAccessFunction(
                                        data._id,
                                        "liveStreaming",
                                      )
                                    }
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor={`liveStreaming-${data._id}`}
                                  >
                                    LiveStreaming
                                  </label>
                                </div>
                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`freeCall-${data._id}`}
                                    checked={
                                      Object.keys(
                                        data.accessibleFunction,
                                      ).includes("freeCall") &&
                                      data.accessibleFunction.freeCall
                                    }
                                    onChange={() =>
                                      handleAccessFunction(data._id, "freeCall")
                                    }
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor={`freeCall-${data._id}`}
                                  >
                                    Free Call
                                  </label>
                                </div>
                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`cashOut-${data._id}`}
                                    checked={
                                      Object.keys(
                                        data.accessibleFunction,
                                      ).includes("cashOut") &&
                                      data.accessibleFunction.cashOut
                                    }
                                    onChange={() =>
                                      handleAccessFunction(data._id, "cashOut")
                                    }
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor={`cashOut-${data._id}`}
                                  >
                                    Redeem [cashout]
                                  </label>
                                </div>
                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`uploadPost-${data._id}`}
                                    checked={
                                      Object.keys(
                                        data.accessibleFunction,
                                      ).includes("uploadPost") &&
                                      data.accessibleFunction.uploadPost
                                    }
                                    onChange={() =>
                                      handleAccessFunction(
                                        data._id,
                                        "uploadPost",
                                      )
                                    }
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor={`uploadPost-${data._id}`}
                                  >
                                    Upload Social Post
                                  </label>
                                </div>
                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`uploadVideo-${data._id}`}
                                    checked={
                                      Object.keys(
                                        data.accessibleFunction,
                                      ).includes("uploadVideo") &&
                                      data.accessibleFunction.uploadVideo
                                    }
                                    onChange={() =>
                                      handleAccessFunction(
                                        data._id,
                                        "uploadVideo",
                                      )
                                    }
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor={`uploadVideo-${data._id}`}
                                  >
                                    Upload Video
                                  </label>
                                </div>
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
                        <td colSpan="7" align="center">
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
      <LevelDialog />
    </>
  );
};

export default connect(null, {
  getLevel,
  deleteLevel,
  AccessibleFunctionLevel,
})(LevelTable);
