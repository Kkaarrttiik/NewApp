import { useEffect, useState, useRef } from "react";
//jquery
import $ from "jquery";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//routing
import { Link, useNavigate } from "react-router-dom";

//MUI
import { Tooltip } from "@mui/material";

// import arraySort from "array-sort";

//image
import Male from "../../assets/images/male.png";

import { usePermission } from "../../context/PermissionProvider";

//pagination
import Pagination from "../../pages/Pagination";

//Calendar Css
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
//action
import Rcoin from "../../assets/images/rcoin.webp";
import {
  getFakeUser,
  handleBlockUnblockSwitch,
} from "../../store/FakeUser/Action";
import { OPEN_SPINNER_PROGRESS } from "../../store/spinner/types";
import { baseURL } from "../../util/Config";

const FakeUser = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { can } = usePermission();
  const canCreate = can("admin/fakeUser", "Create");
  const canEdit = can("admin/fakeUser", "Edit");
  const canDelete = can("admin/fakeUser", "Delete");
  const [data, setData] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("ALL");
  const [date, setDate] = useState([]);
  const [sDate, setsDate] = useState("ALL");
  const [eDate, seteDate] = useState("ALL");
  const [diamondSort, setDiamondSort] = useState("asc");
  const [type, setType] = useState(() => {
    return localStorage.getItem("userReqTab") || "fakeAudioLive";
  });
  const searchTimeout = useRef(null);

  useEffect(() => {
    $("#card").click(() => {
      $("#datePicker").removeClass("show");
    });
  }, []);

  useEffect(() => {
    dispatch({ type: OPEN_SPINNER_PROGRESS });
    dispatch(getFakeUser(activePage, rowsPerPage, search, sDate, eDate, type));
  }, [dispatch, activePage, rowsPerPage, sDate, eDate, type]);

  const { user, totalUser } = useSelector((state) => state.fakeUser);
  useEffect(() => {
    setData(user);
  }, [user]);

  const handleLiveType = (newType) => {
    setType(newType);
    localStorage.setItem("userReqTab", newType);
  };

  useEffect(() => {
    if (date.length === 0) {
      setDate([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: "selection",
        },
      ]);
    }
    $("#datePicker").removeClass("show");
    setData(user);
  }, [date, user]);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
  };

  // set default image
  $(document).ready(function () {
    $("img").bind("error", function () {
      // Set the default image
      $(this).attr("src", `${baseURL}storage/male.png`);
    });
  });

  const handleBlockUnblockSwitch_ = (userId) => {
    props.handleBlockUnblockSwitch(userId);
  };

  const handleUserInfo = (user) => {
    sessionStorage.removeItem("userFollow");
    sessionStorage.setItem(
      "user",
      JSON.stringify({ ...user, source: "fakeUser" }),
    );
    navigate("/admin/user/detail");
  };

  const handleUserHistory = (user) => {
    sessionStorage.setItem(
      "user",
      JSON.stringify({
        ...user,
        source: "fakeUser",
      }),
    );
    navigate("/admin/user/history");
  };

  const getAllUser = () => {
    setActivePage(1);
    setsDate("ALL");
    seteDate("ALL");
    $("#datePicker").removeClass("show");
    dispatch(getFakeUser(activePage, rowsPerPage, search, sDate, eDate, type));
  };

  const handleAddFakeUser = () => {
    sessionStorage.removeItem("fakeUser");
    navigate("/admin/fake/fakeUserdialog");
  };
  const handleAddFakeAudioUser = () => {
    sessionStorage.removeItem("fakeUser");
    navigate("/admin/fake/fakeAudioUserdialog");
  };

  const handleAddFakePkUser = () => {
    sessionStorage.removeItem("fakeUser");
    navigate("/admin/fake/fakePkUserdialog");
  };

  const handleEdit = (data) => {
    sessionStorage.setItem("fakeUser", JSON.stringify(data));
    navigate("/admin/fake/fakeUserdialog");
  };

  const handleEditFakeAudioLive = (data) => {
    sessionStorage.setItem("fakeUser", JSON.stringify(data));
    navigate("/admin/fake/fakeAudioUserdialog");
  };
  const handleEditPkUser = (data) => {
    sessionStorage.setItem("fakeUser", JSON.stringify(data));
    navigate("/admin/fake/fakePkUserdialog");
  };

  const handleDiamondSort = () => {
    setDiamondSort((prev) => (prev === "asc" ? "desc" : "asc"));
    dispatch(
      getFakeUser(
        activePage,
        rowsPerPage,
        search,
        sDate,
        eDate,
        type,
        diamondSort ? "diamondSort" : null,
      ),
    );
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Fake User</h3>
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
                  Fake User
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end mb-3">
        <button style={{ backgroundColor: "#0f766e" }} className="edit-btn">
          Audio Live
        </button>
      </div>
      {/* ── FILTER BAR ── */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="filter-bar">
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between flex-wrap gap-2">
              {/* Left */}
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <div>
                  {canCreate && (
                    <button
                      className="edit-btn dropdown-toggle"
                      type="button"
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="fas fa-plus fa-lg me-2"></i>
                      New
                    </button>
                  )}
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="dropdownMenuButton1"
                    style={{
                      backgroundColor: "#131929",
                      marginTop: "10px",
                      border: "1px solid #1e2640",
                    }}
                  >
                    <li
                      className="dropdown-item"
                      style={{ color: "#c8cfe0", cursor: "pointer" }}
                      onClick={() => handleAddFakeAudioUser()}
                    >
                      Audio Live User
                    </li>
                  </ul>
                </div>

                <button className="edit-btn" onClick={getAllUser}>
                  All
                </button>

                <p style={{ paddingLeft: 10 }} className="my-2 text-secondary">
                  {sDate !== "ALL" && sDate + " to " + eDate}
                </p>
              </div>

              {/* Right — Search */}
              <div className="search-wrapper w-100 w-md-auto">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="search"
                  id="searchBar"
                  autoComplete="off"
                  placeholder="Search by name or country"
                  className="search-input"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (searchTimeout.current) {
                      clearTimeout(searchTimeout.current);
                    }
                    searchTimeout.current = setTimeout(() => {
                      const apiSearchValue = value.length === 0 ? "ALL" : value;
                      setSearch(apiSearchValue);
                      setActivePage(1);
                      dispatch(
                        getFakeUser(
                          1,
                          rowsPerPage,
                          apiSearchValue,
                          sDate,
                          eDate,
                          type
                        )
                      );
                    }, 1000);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TABLE CARD ── */}
      <div className="row mt-4">
        <div className="col">
          <div className="table-card" id="card">
            <div className="table-card-body">
              <div style={{ overflowX: "auto", width: "100%" }}>
                {type === "fakeAudioLive" ? (
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>No.</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Gender</th>
                        <th>RCoin</th>
                        <th>Country</th>
                        <th>Follower</th>
                        <th>Following</th>
                        {canEdit && <th>isBlock</th>}
                        {canEdit && <th>Edit</th>}
                        <th>Info</th>
                        <th>History</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.length > 0 ? (
                        data.map((data, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <img
                                  height="50px"
                                  width="50px"
                                  alt="app"
                                  src={data.image ? data.image : Male}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = Male;
                                  }}
                                  style={{
                                    border: "2px solid #1e2640",
                                    borderRadius: 10,
                                    objectFit: "cover",
                                    display: "block",
                                  }}
                                />
                              </td>
                              <td className="text-nowrap">{data?.name ? data?.name : "-"}</td>
                              <td>
                                {data?.gender ? (
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "3px",
                                    }}
                                  >
                                    {data.gender.toLowerCase() === "male" && (
                                      <i className="material-icons text-primary">
                                        male
                                      </i>
                                    )}
                                    {data.gender.toLowerCase() === "female" && (
                                      <i className="material-icons text-danger">
                                        female
                                      </i>
                                    )}
                                    <span className="text-capitalize">
                                      {data.gender}
                                    </span>
                                  </div>
                                ) : (
                                  "-"
                                )}
                              </td>
                              <td className="text-danger">
                                <img
                                  src={Rcoin}
                                  width="15px"
                                  height="15px"
                                  style={{
                                    verticalAlign: "middle",
                                    marginRight: "1px",
                                  }}
                                />{" "}
                                {data.rCoin}
                              </td>
                              <td className="text-success text-nowrap">{data.country}</td>
                              <td>{data.followers}</td>
                              <td>{data.following}</td>
                              {canEdit && (
                                <td>
                                  <label className="switch">
                                    <input
                                      type="checkbox"
                                      checked={data.isBlock}
                                      onChange={() =>
                                        handleBlockUnblockSwitch_(data._id)
                                      }
                                    />
                                    <span className="slider">
                                      <p
                                        style={{
                                          fontSize: 12,
                                          marginLeft: `${data.isBlock ? "-24px" : "35px"}`,
                                          color: "#000",
                                          marginTop: "6px",
                                        }}
                                      ></p>
                                    </span>
                                  </label>
                                </td>
                              )}
                              {canEdit && (
                                <td>
                                  <Tooltip title="Edit">
                                    <button
                                      type="button"
                                      className="btn-sm edit-btn"
                                      onClick={() =>
                                        handleEditFakeAudioLive(
                                          data,
                                          "fakeAudioLive",
                                        )
                                      }
                                    >
                                      <i className="fas fa-edit fa-lg"></i>
                                    </button>
                                  </Tooltip>
                                </td>
                              )}
                              <td>
                                <Tooltip title="Info">
                                  <button
                                    type="button"
                                    className="btn-sm edit-btn"
                                    onClick={() => handleUserInfo(data)}
                                  >
                                    <i className="fas fa-info-circle fa-lg"></i>
                                  </button>
                                </Tooltip>
                              </td>
                              <td>
                                <Tooltip title="History">
                                  <button
                                    type="button"
                                    className="btn btn-sm"
                                    style={{
                                      background: "#0f766e",
                                      color: "#99f6e4",
                                      border: "none",
                                    }}
                                    onClick={() => handleUserHistory(data)}
                                  >
                                    <i className="fas fa-history fa-lg"></i>
                                  </button>
                                </Tooltip>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="13" align="center">
                            Nothing to show!!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                ) : (
                  <></>
                )}
              </div>
              <div className="px-5">
                <Pagination
                  activePage={activePage}
                  rowsPerPage={rowsPerPage}
                  userTotal={totalUser}
                  handleRowsPerPage={handleRowsPerPage}
                  handlePageChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { getFakeUser, handleBlockUnblockSwitch })(
  FakeUser,
);
