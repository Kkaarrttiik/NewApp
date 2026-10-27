import React, { useEffect, useState, useRef } from "react";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//action
import { deleteHashtag, getHashtag } from "../../store/hashtag/action";

//routing
import { Link } from "react-router-dom";
//MUI
import { Tooltip } from "@mui/material";
// type
import { OPEN_HASHTAG_DIALOG } from "../../store/hashtag/types";
// dialog
import HashtagDialog from "../dialog/Hashtag";

//sweet alert
import { usePermission } from "../../context/PermissionProvider";
import { alert, warning } from "../../util/Alert";

import arraySort from "array-sort";
import Pagination from "../../pages/Pagination";

const TablePaginationActions = React.lazy(() => import("./TablePagination"));

const HashtagTable = (props) => {
  const dispatch = useDispatch();

  const { can } = usePermission();
  const canCreate = can("admin/hashtag", "Create");
  const canEdit = can("admin/hashtag", "Edit");
  const canDelete = can("admin/hashtag", "Delete");

  const [postSort, setPostSort] = useState(true);
  const [videoSort, setVideoSort] = useState(true);
  const [search, setSearch] = useState();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activePage, setActivePage] = useState(1);

  useEffect(() => {
    dispatch(getHashtag({ start: page, limit: rowsPerPage }));
  }, [dispatch, rowsPerPage, page]);

  const { hashtag, total } = useSelector((state) => state.hashtag);

  useEffect(() => {
    setData(hashtag);
  }, [hashtag]);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
    setPage(pageNumber);
  };

  const searchTimeout = useRef(null);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      dispatch(
        getHashtag({
          start: 1,
          limit: rowsPerPage,
          value: value,
        }),
      );
      setActivePage(1);
      setPage(1);
    }, 1000);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
  };

  // const handleSearch = (e) => {
  //   const value = e.target.value.toUpperCase()
  //     ? e.target.value.trim().toUpperCase()
  //     : e.target.value.trim();
  //   if (value) {
  //     const data = hashtag.filter((data) => {
  //       return data?.hashtag?.toUpperCase()?.indexOf(value) > -1;
  //     });
  //     setData(data);
  //   } else {
  //     return setData(hashtag);
  //   }
  // };

  const handleDelete = (hashtagId) => {

    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
          props.deleteHashtag(hashtagId);
          alert("Deleted!", `Hashtag has been deleted!`, "success");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = (data) => {

    dispatch({ type: OPEN_HASHTAG_DIALOG, payload: data });
  };

  const handleOpen = () => {

    dispatch({ type: OPEN_HASHTAG_DIALOG });
  };

  const handleVideoSort = () => {
    setVideoSort(!videoSort);
    arraySort(data, "videoCount", { reverse: videoSort });
  };
  const handlePostSort = () => {
    setPostSort(!postSort);
    arraySort(data, "postCount", { reverse: postSort });
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Hashtag</h3>
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
                  Hashtag
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
                  placeholder="Search by hashtag"
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
                    <th>Hashtag</th>
                    <th onClick={handlePostSort} style={{ cursor: "pointer" }}>
                      Post {postSort ? " ▼" : " ▲"}
                    </th>
                    <th onClick={handleVideoSort} style={{ cursor: "pointer" }}>
                      Video {videoSort ? " ▼" : " ▲"}
                    </th>
                    {canEdit && <th>Edit</th>}
                    {canDelete && <th>Delete</th>}
                  </tr>
                </thead>
                <tbody>
                  {data?.length > 0 ? (
                    data.map((data, index) => {
                      return (
                        <tr key={index}>
                          <td>{(activePage - 1) * rowsPerPage + index + 1}</td>
                          <td>{data.hashtag}</td>
                          <td>{data.postCount}</td>
                          <td>{data.videoCount}</td>
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
                      <td colSpan="6" align="center">
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
      <HashtagDialog />
    </>
  );
};

export default connect(null, { getHashtag, deleteHashtag })(HashtagTable);
