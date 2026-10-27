import { useEffect, useState, useRef } from "react";

//dayjs

//jquery
import $ from "jquery";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//action
import { getUser, handleBlockUnblockSwitch } from "../../store/user/action";

//routing
import { Link, useNavigate } from "react-router-dom";

//MUI
import { Tooltip } from "@mui/material";

// import arraySort from "array-sort";

//image
import Male from "../../assets/images/male.png";

//pagination
import Pagination from "../../pages/Pagination";

//Date Range Picker
//Calendar Css
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

//MUI icon
import { IconCopy } from "@tabler/icons-react";
import Rcoin from "../../assets/images/rcoin.webp";
import { usePermission } from "../../context/PermissionProvider";
import { getHost } from "../../store/host/action";
import { Toast } from "../../util/Toast";

const Host = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [data, setData] = useState([]);

  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("ALL");
  const [rCoinSort, setRcoinSort] = useState("asc");
  const searchTimeout = useRef(null);
  const { can } = usePermission();
  const canCreate = can("admin/host", "Create");
  const canEdit = can("admin/host", "Edit");
  const canDelete = can("admin/host", "Delete");

  useEffect(() => {
    dispatch(getHost(activePage, rowsPerPage, search));
  }, [dispatch, activePage, rowsPerPage]);

  const { host, total } = useSelector((state) => state.host);

  useEffect(() => {
    setData(host);
  }, [host]);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
  };

  const handleBlockUnblockSwitch_ = (userId) => {
    props.handleBlockUnblockSwitch(userId);
  };

  const handleUserInfo = (user) => {
    sessionStorage.removeItem("userFollow");
    sessionStorage.setItem("user", JSON.stringify(user));
    navigate("/admin/user/detail");
  };
  const handleUserHistory = (user) => {
    sessionStorage.setItem("user", JSON.stringify(user));
    navigate("/admin/user/history");
  };

  const handleRcoinSort = () => {
    setRcoinSort((prev) => (prev === "asc" ? "desc" : "asc"));
    dispatch(
      getHost(activePage, rowsPerPage, search, rCoinSort ? rCoinSort : null),
    );
  };

    const handleSearchChange = (e) => {
    const value = e.target.value;
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      const apiSearchValue = value.length === 0 ? "ALL" : value;
      setSearch(apiSearchValue);
      setActivePage(1);
      dispatch(getHost(1, rowsPerPage, apiSearchValue));
    }, 1000);
  };

  // set default image

  $(document).ready(function () {
    $("img").bind("error", function () {
      // Set the default image
      $(this).attr("src", Male);
    });
  });

  const copyToClipboard = (Text) => {
    navigator.clipboard.writeText(Text);
    Toast("success", "Copied successfully!");
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-light" style={{ color: "#e4eeff" }}>
              Host
            </h3>
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
                <li className="breadcrumb-item active " aria-current="page">
                  Host
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
              {/* Left — Action buttons placeholder */}
              <div className="d-flex align-items-center gap-2">
                {/* Add buttons here if needed */}
              </div>

              {/* Right — Search */}
              <div className="search-wrapper">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="search"
                  id="searchBar"
                  autoComplete="off"
                  placeholder="Search by name,uniqueId or country"
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
              className="table-card-body"
            >
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>UniqueId</th>
                    <th>Gender</th>
                    <th onClick={handleRcoinSort} style={{ whiteSpace:"nowrap", cursor: "pointer" }}>
                      RCoin {rCoinSort ? " ▼" : " ▲"}
                    </th>
                    <th>Country</th>
                    <th>Level</th>
                    {canEdit && <th>isBlock</th>}
                    <th>Agency</th>
                    <th>Info</th>
                    <th>History</th>
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
                              src={data.image ? data.image : Male}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = Male;
                              }}
                              style={{
                                boxShadow: "0 5px 15px 0 rgb(105 103 103 / 0%)",
                                border: "2px solid #fff",
                                borderRadius: 10,
                                objectFit: "cover",
                                display: "block",
                              }}
                              className="mx-auto"
                            />
                          </td>
                          <td>{data.name ? data.name : "-"}</td>
                          <td>
                            {data?.uniqueId && data.uniqueId !== "-" ? (
                              <>
                                {data.uniqueId}
                                <IconCopy
                                  size={16}
                                  className="ms-1"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => copyToClipboard(data.uniqueId)}
                                />
                              </>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td>
                            {data?.gender ? (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  justifyContent: "center",
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
                            {data.rCoin ? data.rCoin : "0"}
                          </td>
                          <td className="text-success">
                            {data.country ? data.country : "-"}
                          </td>
                          <td className="text-warning">
                            {data?.level?.name ? data?.level?.name : "-"}
                          </td>
                          {canEdit && (
                            <td>
                              <label className="switch">
                                <input
                                  type="checkbox"
                                  checked={data?.isBlock}
                                  onChange={() => {
                                    handleBlockUnblockSwitch_(data?._id);
                                  }}
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
                          <td className="text-capitalize">
                            {data?.agency?.name ? data?.agency?.name : "-"}
                          </td>
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
                      <td colSpan="12" align="center">
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
    </>
  );
};

export default connect(null, { getUser, handleBlockUnblockSwitch })(Host);
