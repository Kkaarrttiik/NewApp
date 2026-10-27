import { Tooltip } from "@mui/material";
import { IconCopy } from "@tabler/icons-react";
import dayjs from "dayjs";
import $ from "jquery";
import { useEffect, useState, useRef } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Diamond from "../assets/images/diamond.png";
import Male from "../assets/images/male.png";
import CoinSellerAdd from "../component/dialog/CoinSellerAdd";
import CoinSellerAddCoin from "../component/dialog/CoinSellerAddCoin";
import CoinSellerLessCoin from "../component/dialog/CoinSellerLessCoin";
import MobileNumberModel from "../component/dialog/MobileNumberModel";
import { usePermission } from "../context/PermissionProvider";
import {
  deleteCoinSeller,
  getCoinSeller,
  showCoinSeller,
} from "../store/coinSeller/action";
import {
  ADD_MOBILE_OPEN_DIALOGUE,
  ADD_MONEY_OPEN_DIALOGUE,
  LESS_MONEY_OPEN_DIALOGUE,
  OPEN_COINSELLER_DIALOGUE,
} from "../store/coinSeller/type";
import Pagination from "./Pagination";
import { formatNumber } from "../util/formatNumber";
import { Toast } from "../util/Toast";

const CoinSeller = (props) => {
  const { coinSeller, total } = useSelector((state) => state.coinSeller);
  const [data, setData] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [search, setSearch] = useState("");
  const searchTimeout = useRef(null);
  const { can } = usePermission();
  const canCreate = can("admin/coinSeller", "Create");
  const canEdit = can("admin/coinSeller", "Edit");
  const canDelete = can("admin/coinSeller", "Delete");

  const dispatch = useDispatch();

  useEffect(() => {
    props.getCoinSeller(activePage, rowsPerPage, search);
  }, [activePage, rowsPerPage]);

  useEffect(() => {
    setData(coinSeller);
  }, [coinSeller]);

  // useEffect(() => {
  //   handleSearch();
  // }, [search, coinSeller]);

  const handleBlockUnblockSwitch_ = (data) => {
    props.liveCut(data.liveStreamingId, data?.liveUserId?._id, data?.username);
  };

  const navigate = useNavigate();

  const handleUserInfo = (user) => {
    navigate({ pathname: "/admin/user/detail", state: user });
  };

  const handleUserHistory = (user) => {
    navigate("/admin/coinSeller/history", { state: user });
  };

  $(document).ready(function () {
    $("img").bind("error", function () {
      $(this).attr("src", Male);
    });
  });

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
  };

  const handleOpen = () => {
    dispatch({ type: OPEN_COINSELLER_DIALOGUE });
  };

  const handleEdit = (data) => {
    dispatch({ type: OPEN_COINSELLER_DIALOGUE, payload: data });
  };

  const handleShow_ = (value) => {
    props.showCoinSeller(value);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      setActivePage(1);
      props.getCoinSeller(1, rowsPerPage, value);
    }, 1000);
  };

  const handleDisable = (value) => {

    props.deleteCoinSeller(value);
  };

  const handleGiveCoin = (value) => {
    dispatch({ type: ADD_MONEY_OPEN_DIALOGUE, payload: value });
  };

  const handleLessCoin = (value) => {
    dispatch({ type: LESS_MONEY_OPEN_DIALOGUE, payload: value });
  };

  const handleGiveMobile = (value) => {
    dispatch({ type: ADD_MOBILE_OPEN_DIALOGUE, payload: value });
  };

  const copyToClipboard = (Text) => {
    navigator.clipboard.writeText(Text);
    Toast("success", "Copied successfully!");
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Coin Seller</h3>
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
                  CoinSeller
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
              {/* Left — New button */}

              <div className="d-flex align-items-center gap-2">
                {canCreate && (
                  <button
                    type="button"
                    className="edit-btn"
                    onClick={handleOpen}
                    id="CoinSellerAdd"
                  >
                    <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> New
                  </button>
                )}
              </div>

              {/* Right — Search */}
              <div className="search-wrapper">
                <i
                  className="fas fa-search search-icon"
                  onClick={() =>
                    props.getCoinSeller(activePage, rowsPerPage, search)
                  }
                ></i>
                <input
                  type="search"
                  id="searchBar"
                  autoComplete="off"
                  placeholder="Search by name or uniqueId"
                  className="search-input"
                  value={search}
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
                    <th>Image</th>
                    <th>Name</th>
                    <th>Unique Id</th>
                    <th>Coin</th>
                    <th className="text-nowrap">Spend Coin</th>
                    {canEdit && <th className="text-nowrap">Mobile Number</th>}
                    <th className="text-nowrap">Created At</th>
                    {canEdit && <th className="text-nowrap">Give Coin</th>}
                    {canEdit && <th className="text-nowrap">Less Coin</th>}
                    {canEdit && <th className="text-nowrap">Is Active</th>}
                    <th>History</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((data, index) => {
                      return (
                        <tr key={index}>
                          <td>{(activePage - 1) * rowsPerPage + index + 1}</td>
                          <td>
                            <img
                              height="50px"
                              width="50px"
                              alt="app"
                              src={data?.user?.image ? data?.user?.image : ""}
                              style={{
                                border: "2px solid #1e2640",
                                borderRadius: 10,
                                objectFit: "cover",
                                display: "block",
                              }}
                            />
                          </td>
                          <td className="text-nowrap">
                            {data?.user?.name ? data?.user?.name : "-"}
                          </td>
                          <td className="text-nowrap">
                            {data?.user?.uniqueId &&
                            data.user.uniqueId !== "-" ? (
                              <>
                                {data.user.uniqueId}
                                <IconCopy
                                  size={16}
                                  className="ms-1"
                                  style={{ cursor: "pointer" }}
                                  onClick={() =>
                                    copyToClipboard(data.user.uniqueId)
                                  }
                                />
                              </>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="text-nowrap">
                            <img
                              src={Diamond}
                              width="15"
                              height="15"
                              style={{
                                verticalAlign: "middle",
                                marginRight: "1px",
                              }}
                            />
                            {formatNumber(data?.coin)}
                          </td>
                          <td>
                            <img
                              src={Diamond}
                              width="15"
                              height="15"
                              style={{
                                verticalAlign: "middle",
                                marginRight: "1px",
                              }}
                            />
                            {formatNumber(data?.spendCoin)}
                          </td>
                          {canEdit && (
                            <td>
                              <div
                                className="showEditNumber"
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <span className="text-nowrap">
                                  {data?.mobileNumber
                                    ? (data?.countryCode
                                        ? "+" + data?.countryCode + " "
                                        : "") + data?.mobileNumber
                                    : "-"}
                                </span>
                                <Tooltip title="Mobile Number">
                                  <i
                                    className="fa fa-pen fa-lg text-primary"
                                    style={{
                                      marginLeft: "16px",
                                      fontSize: "14px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleGiveMobile(data)}
                                  ></i>
                                </Tooltip>
                              </div>
                            </td>
                          )}
                          <td className="text-nowrap">
                            {dayjs(data?.createdAt).format("DD MMM YYYY")}
                          </td>
                          {canEdit && (
                            <td>
                              <Tooltip title="Give Coin">
                                <button
                                  type="button"
                                  className="btn-sm edit-btn"
                                  onClick={() => handleGiveCoin(data)}
                                >
                                  <i className="fa fa-edit fa-lg"></i>
                                </button>
                              </Tooltip>
                            </td>
                          )}
                          {canEdit && (
                            <td>
                              <Tooltip title="Less Coin">
                                <button
                                  type="button"
                                  className="btn-sm delete-btn"
                                  onClick={() => handleLessCoin(data)}
                                >
                                  <i className="fa fa-edit fa-lg"></i>
                                </button>
                              </Tooltip>
                            </td>
                          )}
                          {canEdit && (
                            <td>
                              <label className="switch">
                                <input
                                  type="checkbox"
                                  checked={data?.isActive}
                                  onChange={() => handleDisable(data?._id)}
                                />
                                <span className="slider"></span>
                              </label>
                            </td>
                          )}
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
                      <td colSpan="20" align="center">
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

      <CoinSellerAdd />
      <CoinSellerAddCoin />
      <CoinSellerLessCoin />
      <MobileNumberModel />
    </>
  );
};

export default connect(null, {
  getCoinSeller,
  deleteCoinSeller,
  showCoinSeller,
})(CoinSeller);
