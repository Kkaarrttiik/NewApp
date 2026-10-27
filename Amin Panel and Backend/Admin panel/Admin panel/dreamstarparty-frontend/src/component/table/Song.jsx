import React, { useEffect, useState, useRef } from "react";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//action
import { deleteSong, getSong } from "../../store/song/action";

//config
import { baseURL } from "../../util/Config";
//routing
import { Link, useNavigate } from "react-router-dom";
//MUI
import { Tooltip } from "@mui/material";

//sweet alert
import { usePermission } from "../../context/PermissionProvider";
import { alert, warning } from "../../util/Alert";

//image
import noImage from "../../assets/images/noImage.png";
import Pagination from "../../pages/Pagination";

const TablePaginationActions = React.lazy(() => import("./TablePagination"));

const GiftTable = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activePage, setActivePage] = useState(1);

  const { can } = usePermission();
  const canCreate = can("admin/song", "Create");
  const canEdit = can("admin/song", "Edit");
  const canDelete = can("admin/song", "Delete");

  useEffect(() => {
    dispatch(getSong({ start: page, limit: rowsPerPage }));
  }, [dispatch, rowsPerPage, page]);

  const { song, total } = useSelector((state) => state.song);

  useEffect(() => {
    setData(song);
  }, [song]);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
    setPage(pageNumber);
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
        const filteredData = song.filter((data) => {
          return (
            data?.singer?.toUpperCase()?.indexOf(value) > -1 ||
            data?.title?.toUpperCase()?.indexOf(value) > -1
          );
        });
        setData(filteredData);
      } else {
        setData(song);
      }
    }, 1000);
  };

  const handleDelete = (songId) => {

    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
          props.deleteSong(songId);
          alert("Deleted!", `Song has been deleted!`, "success");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = (data) => {

    sessionStorage.setItem("SongDetail", JSON.stringify(data));
    navigate("/admin/song/dialog");
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Song</h3>
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
                  Song
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
                    onClick={() => {
                      sessionStorage.removeItem("SongDetail");
                      navigate("/admin/song/dialog");
                    }}
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
                  placeholder="Search by title or singer"
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
                    <th>Image</th>
                    <th>Title</th>
                    <th>Singer</th>
                    <th>Song</th>
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
                              src={data.image ? baseURL + data.image : noImage}
                              style={{
                                border: "2px solid #1e2640",
                                borderRadius: 10,
                                objectFit: "cover",
                                display: "block",
                              }}
                            />
                          </td>
                          <td>{data.title}</td>
                          <td>{data.singer}</td>
                          <td>
                            <audio controls style={{ height: 42 }}>
                              <source
                                src={baseURL + data.song}
                                type="audio/ogg"
                              />
                            </audio>
                          </td>
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
    </>
  );
};

export default connect(null, { getSong, deleteSong })(GiftTable);
