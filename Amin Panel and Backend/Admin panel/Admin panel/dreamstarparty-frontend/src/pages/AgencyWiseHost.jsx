import { useEffect, useState, useRef } from "react";

//dayjs

//jquery
import $ from "jquery";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//action
import {
  getAgencyWiseHost,
  handleBlockUnblockSwitch,
  redeemEnableHost,
} from "../store/agency/action";

//routing
import { Link, useNavigate } from "react-router-dom";

//MUI

// import arraySort from "array-sort";

//image
import Male from "../assets/images/male.png";

//pagination
import Pagination from "./Pagination";

//Date Range Picker
//Calendar Css
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

//MUI icon
import { useLocation } from "react-router-dom";
import { Toast } from "../util/Toast";
import { IconCopy } from "@tabler/icons-react";

const AgencyWiseHost = (props) => {
  const navigate = useNavigate();
  const maxDate = new Date();
  const dispatch = useDispatch();

  // const [coinSort, setCoinSort] = useState(true);
  // const [followerSort, setFollowerSort] = useState(true);
  // const [followingSort, setFollowingSort] = useState(true);
  const [data, setData] = useState([]);

  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("ALL");
  const searchTimeout = useRef(null);

  const [date, setDate] = useState([]);
  const [sDate, setsDate] = useState("ALL");
  const [eDate, seteDate] = useState("ALL");
  const location = useLocation();

  useEffect(() => {
    $("#card").click(() => {
      $("#datePicker");
    });
  }, []);

  useEffect(() => {
    dispatch(
      getAgencyWiseHost(location?.state?._id, activePage, rowsPerPage, search),
    );
  }, [dispatch, activePage, rowsPerPage, search]);

  const { agencyWiseHost, totalAgencyWiseHost } = useSelector(
    (state) => state.agency,
  );
  useEffect(() => {
    setData(agencyWiseHost);
  }, [agencyWiseHost]);

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
    sessionStorage.setItem("user", JSON.stringify(user));
    navigate("/admin/user/detail");
  };
  const handleUserHistory = (user) => {
    sessionStorage.setItem("user", JSON.stringify(user));
    navigate("/admin/user/history");
  };

  const getAllUser = () => {
    setActivePage(1);
    setsDate("ALL");
    seteDate("ALL");
    $("#datePicker");
    dispatch(getAgencyWiseHost(activePage, rowsPerPage, sDate, eDate));
  };

  const collapsedDatePicker = () => {
    $("#datePicker").toggleClass("collapse");
  };

  const handleEnabledRedeem = (id) => {
    dispatch(redeemEnableHost(id));
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
        <div className="row mb-3">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <button
              className="btn btn-danger custom-btn"
              onClick={() => navigate(-1)}
            >
              <i className="fas fa-chevron-left"></i> Go Back
            </button>
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
                  Agency
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Agency Wise Users
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
              {/* Left — Title */}
              <h6
                style={{
                  color: "#c8cfe0",
                  textTransform: "capitalize",
                  fontSize: "16px",
                  margin: 0,
                }}
              >
                {`${location?.state?.name}'s Host`}
              </h6>

              {/* Right — Search */}
              <div className="search-wrapper">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="search"
                  id="searchBar"
                  autoComplete="off"
                  placeholder="Search by name or uniqueId"
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
          <div className="table-card" id="card">
            {/* <div className="table-card-body"> */}
            <div style={{ overflowX: "auto", width: "100%" }}>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>User</th>
                    <th className="text-nowrap">Unique Id</th>
                    <th className="text-nowrap">Mobile Number</th>
                    <th>Age</th>
                    <th>Diamond</th>
                    <th>Coin</th>
                    <th>Country</th>
                    <th>Level</th>
                    <th>Follower</th>
                    <th>Following</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.length > 0 ? (
                    data?.map((data, index) => {
                      return (
                        <tr key={index}>
                          <td>{(activePage - 1) * rowsPerPage + index + 1}</td>
                          <td className="d-flex align-items-center gap-2 text-nowrap">
                            <img
                              height="50px"
                              width="50px"
                              alt="app"
                              src={data?.image ? data?.image : Male}
                              style={{
                                border: "2px solid #1e2640",
                                borderRadius: 10,
                                objectFit: "cover",
                                display: "block",
                              }}
                            />
                            <span className="d-flex align-items-center">
                              {data?.name ? data?.name : "-"}
                            </span>
                          </td>
                          <td className="text-nowrap">
                            {data?.uniqueId ? data?.uniqueId : "-"}
                            <IconCopy
                              size={16}
                              className="ms-1"
                              style={{ cursor: "pointer" }}
                              onClick={() => copyToClipboard(data.uniqueId)}
                            />
                          </td>
                          <td>
                            {data?.mobileNumber ? data?.mobileNumber : "-"}
                          </td>
                          <td>{data?.age ? data?.age : "-"}</td>
                          <td className="text-info">
                            {data?.diamond ? data?.diamond : "-"}
                          </td>
                          <td className="text-danger">
                            {data?.rCoin ? data?.rCoin : "0"}
                          </td>
                          <td className="text-success">
                            {data?.country ? data?.country : "-"}
                          </td>
                          <td className="text-warning">
                            {data?.level?.name ? data?.level?.name : "-"}
                          </td>
                          <td>{data?.followers ? data?.followers : "0"}</td>
                          <td>{data?.following ? data?.following : "0"}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="16" align="center">
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
                userTotal={totalAgencyWiseHost}
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

export default connect(null, { getAgencyWiseHost, handleBlockUnblockSwitch })(
  AgencyWiseHost,
);
