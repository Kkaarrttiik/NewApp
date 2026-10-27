import React, { useEffect, useState, useRef } from "react";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//action
import {
  deleteFakeComment,
  getFakeComment,
} from "../../store/fakeComment/action";

//routing
import { Link } from "react-router-dom";

//MUI
import { Tooltip } from "@mui/material";

//sweet alert
import { usePermission } from "../../context/PermissionProvider";
import { alert, warning } from "../../util/Alert";

//image
import Pagination from "../../pages/Pagination";
import { OPEN_COMMENT_DIALOG } from "../../store/fakeComment/type";
import FakeCommentDialog from "../dialog/FakeCommentDialog";

const TablePaginationActions = React.lazy(() => import("./TablePagination"));

const FakeComment = (props) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activePage, setActivePage] = useState(1);

  const { can } = usePermission();
  const canCreate = can("admin/comment", "Create");
  const canEdit = can("admin/comment", "Edit");
  const canDelete = can("admin/comment", "Delete");

  useEffect(() => {
    dispatch(getFakeComment({ start: page, limit: rowsPerPage }));
  }, [dispatch, rowsPerPage, page]);

  const { comment, total } = useSelector((state) => state.Comment);

  useEffect(() => {
    setData(comment);
  }, [comment]);

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
    const value = e.target.value.trim().toUpperCase();

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      if (value) {
        const filteredData = comment.filter((item) => {
          return item?.comment?.toUpperCase()?.indexOf(value) > -1;
        });
        setData(filteredData);
      } else {
        setData(comment);
      }
    }, 1000);
  };

  const handleOpen = () => {

    dispatch({ type: OPEN_COMMENT_DIALOG });
  };

  const handleDelete = (commentId) => {

    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
          props.deleteFakeComment(commentId);
          alert("Deleted!", `comment has been deleted!`, "success");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = (data) => {

    dispatch({ type: OPEN_COMMENT_DIALOG, payload: data });
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Comment</h3>
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
                  Comment
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
                  placeholder="Search by comment"
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
                      <th>Comment</th>
                      {canEdit && <th>Edit</th>}
                      {canEdit && <th>Delete</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {data?.length > 0 ? (
                      data?.map((data, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{data.comment}</td>
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
      <FakeCommentDialog />
    </>
  );
};

export default connect(null, { deleteFakeComment, getFakeComment })(
  FakeComment,
);
