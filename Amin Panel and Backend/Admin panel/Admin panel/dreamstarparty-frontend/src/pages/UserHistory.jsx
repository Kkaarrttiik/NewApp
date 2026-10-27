import { useEffect, useState } from "react";
import { Close } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";

//react-router
import { connect, useSelector } from "react-redux";

import { Link, useNavigate } from "react-router-dom";

//action
import { coinPlanHistory } from "../store/coinPlan/action";
import { userHistory } from "../store/user/action";
import { vipPlanHistory } from "../store/vipPlan/action";

//dayjs
import dayjs from "dayjs";

//moment
import moment from "moment";

//jquery
import $ from "jquery";

//MUI icon
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

//Date Range Picker
import { DateRangePicker } from "react-date-range";
//Calendar Css
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

//pagination
import Pagination from "./Pagination";

//purchase plan history table
import PurchaseCoinPlan from "../component/table/history/PurchaseCoinPlan";
import PurchaseVipPlan from "../component/table/history/PurchaseVipPlan";

//image
import ads from "../assets/images/ads.png";
import {
  default as diamond,
  default as Diamond,
} from "../assets/images/diamond.png";
import gift from "../assets/images/ic_gift.png";
import male from "../assets/images/male.png";
import moneybag from "../assets/images/moneybag.png";
import Rcoin from "../assets/images/rcoin.webp";
import videocall from "../assets/images/videocall.png";
import withdraw from "../assets/images/withdraw.png";
import AdmissionCarHistory from "../component/table/AdmissionCarHistory";
import UserGameHistory from "../component/table/UserGameHistory";
import UserCoinSellerHistory from "./UserCoinSellerHistory";

const UserHistory = (props) => {
  const history_ = useNavigate();

  const [date, setDate] = useState([]);
  const [sDate, setsDate] = useState("ALL");
  const [eDate, seteDate] = useState("ALL");
  const [historyType, setHistoryType] = useState("diamond");

  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [data, setData] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showModal, setShowModal] = useState(false);

  const {
    totalHistoryUser,
    history,
    income,
    outgoing,
    liveStreamingIncome,
    totalCallCharge,
  } = useSelector((state) => state.user);

  const { history: coinPlanHistory, totalPlan } = useSelector(
    (state) => state.coinPlan,
  );
  const { history: vipPlanHistory, totalPlan: totalVipPlan } = useSelector(
    (state) => state.vipPlan,
  );

  const user = JSON.parse(sessionStorage.getItem("user"));
  // const userHistory = JSON.parse(sessionStorage.getItem("userHistory"))

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const datePicker = document.getElementById("datePicker");
      const toggleButton = document.getElementById("datePickerToggleButton");
      if (
        datePicker &&
        !datePicker.contains(event.target) &&
        toggleButton &&
        !toggleButton.contains(event.target)
      ) {
        $("#datePicker").css("display", "none");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (historyType !== "coinPlan" && historyType !== "vipPlan") {
      const data = {
        userId: user._id,
        type: historyType,
        start: activePage,
        limit: rowsPerPage,
      };
      if (sDate !== "ALL" && eDate !== "ALL") {
        data.startDate = sDate;
        data.endDate = eDate;
      }
      props.userHistory(data);
    } else if (historyType === "coinPlan") {
      props.coinPlanHistory(user._id, activePage, rowsPerPage, sDate, eDate);
    } else if (historyType === "vipPlan") {
      props.vipPlanHistory(user._id, activePage, rowsPerPage, sDate, eDate);
    }
  }, [activePage, rowsPerPage, historyType]);

  useEffect(() => {
    if (date?.length === 0) {
      setDate([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: "selection",
        },
      ]);
    }
    $("#datePicker").css("display", "none");
    if (historyType !== "coinPlan" && historyType !== "vipPlan") {
      setData(history);
    } else if (historyType === "coinPlan") {
      setData(coinPlanHistory);
    } else if (historyType === "vipPlan") {
      setData(vipPlanHistory);
    }
  }, [date, history, coinPlanHistory, vipPlanHistory]);

  useEffect(() => {
    if (historyType !== "coinPlan" && historyType !== "vipPlan") {
      setData(history);
    } else if (historyType === "coinPlan") {
      setData(coinPlanHistory);
    } else if (historyType === "vipPlan") {
      setData(vipPlanHistory);
    }
  }, [history, coinPlanHistory, vipPlanHistory]);

  const getAllUser = () => {
    setActivePage(1);
    setsDate("ALL");
    seteDate("ALL");
    $("#datePicker").css("display", "none");
    if (historyType !== "coinPlan" && historyType !== "vipPlan") {
      const data = {
        userId: user._id,
        type: historyType,
        start: activePage,
        limit: rowsPerPage,
      };
      props.userHistory(data);
    } else if (historyType === "coinPlan") {
      props.coinPlanHistory(user._id, activePage, rowsPerPage, "ALL", "ALL");
    } else if (historyType === "vipPlan") {
      props.vipPlanHistory(user._id, activePage, rowsPerPage, "ALL", "ALL");
    }
  };

  const collapsedDatePicker = () => {
    if (windowWidth < 575) {
      setShowModal(true);
    } else {
      const datePicker = $("#datePicker");
      if (datePicker.css("display") === "none") {
        datePicker.css("display", "block");
      } else {
        datePicker.css("display", "none");
      }
    }
  };

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setRowsPerPage(value);
    setActivePage(1);
  };

  const handleUserInfo = (user) => {
    sessionStorage.setItem("user", JSON.stringify(user));
    history_.push("/admin/user/detail");
  };

  const handleGoBack = () => {
    const source = user?.source;
    const currentPage = user?.currentPage || 1;
    const currentRowsPerPage = user?.currentRowsPerPage || 10;

    if (source === "fakeUser") {
      history_("/admin/fakeUser");
    } else {
      history_(`/admin/user?page=${currentPage}&limit=${currentRowsPerPage}`);
    }
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">{user?.name}'s History</h3>
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
                <li className="breadcrumb-item">
                  <Link to="/admin/user" className="text-white">
                    User
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  History
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
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
              {/* Left — All + Analytics + Go Back */}
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <button
                  className="edit-btn"
                  style={{ marginRight: 5 }}
                  onClick={getAllUser}
                >
                  All
                </button>
                <button
                  id="datePickerToggleButton"
                  className="edit-btn collapsed"
                  value="check"
                  data-toggle="collapse"
                  data-target="#datePicker"
                  onClick={collapsedDatePicker}
                >
                  Analytics
                  <ExpandMoreIcon style={{ fontSize: 18, marginLeft: 4 }} />
                </button>
                <p style={{ paddingLeft: 4 }} className="my-2 text-secondary">
                  {sDate !== "ALL" && sDate + " to " + eDate}
                </p>
              </div>

              {/* Right — Go Back */}
              <button
                className="btn btn-danger custom-btn"
                onClick={handleGoBack}
              >
                <i className="fas fa-chevron-left"></i> Go Back
              </button>
            </div>

            {/* Date picker */}
            <div
              id="datePicker"
              className="date-picker-wrapper mt-3"
              aria-expanded="false"
              style={{ display: "none" }}
            >
              <div className="container table-responsive">
                <div key={JSON.stringify(date)}>
                  <DateRangePicker
                    onChange={(item) => {
                      setDate([item.selection]);
                    }}
                    showSelectionPreview={true}
                    moveRangeOnFirstSelection={false}
                    ranges={date}
                    direction="horizontal"
                  />
                  <div className="mt-2 p-2 d-flex gap-2 justify-content-end">
                    <button
                      className="cancelBtn"
                      onClick={() => {
                        setsDate("ALL");
                        seteDate("ALL");
                        setActivePage(1);
                        setDate([{ startDate: new Date(), endDate: new Date(), key: "selection" }]);
                        $("#datePicker").css("display", "none");
                        if (historyType !== "coinPlan" && historyType !== "vipPlan") {
                          props.userHistory({ userId: user._id, type: historyType, start: 1, limit: rowsPerPage });
                        } else if (historyType === "coinPlan") {
                          props.coinPlanHistory(user._id, 1, rowsPerPage, "ALL", "ALL");
                        } else if (historyType === "vipPlan") {
                          props.vipPlanHistory(user._id, 1, rowsPerPage, "ALL", "ALL");
                        }
                      }}
                    >
                      Clear
                    </button>
                    <button
                      className="applyBtn"
                      onClick={() => {
                        const dayStart = dayjs(date[0]?.startDate).format("M/DD/YYYY");
                        const dayEnd = dayjs(date[0]?.endDate).format("M/DD/YYYY");
                        setsDate(dayStart);
                        seteDate(dayEnd);
                        setActivePage(1);
                        $("#datePicker").css("display", "none");
                        if (historyType !== "coinPlan" && historyType !== "vipPlan") {
                          props.userHistory({ userId: user._id, type: historyType, startDate: dayStart, endDate: dayEnd, start: 1, limit: rowsPerPage });
                        } else if (historyType === "coinPlan") {
                          props.coinPlanHistory(user._id, 1, rowsPerPage, dayStart, dayEnd);
                        } else if (historyType === "vipPlan") {
                          props.vipPlanHistory(user._id, 1, rowsPerPage, dayStart, dayEnd);
                        }
                      }}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* History type tabs */}
            <div
              className="d-flex flex-wrap gap-2 pt-2"
              style={{ borderTop: "1px solid #1e2640" }}
            >
              {[
                { type: "diamond", label: "Diamond History", color: "#1a6fd4" },
                { type: "rCoin", label: "FMCoin History", color: "#b45309" },
                { type: "call", label: "Call History", color: "#c0392b" },
                {
                  type: "liveStreaming",
                  label: "LiveStreaming History",
                  color: "#1a6fd4",
                },
                {
                  type: "coinPlan",
                  label: "Purchase Diamond Plan",
                  color: "#0f766e",
                },
                {
                  type: "vipPlan",
                  label: "Purchase VIP Plan",
                  color: "#0f766e",
                },
                { type: "gameCoin", label: "Game History", color: "#b45309" },
                { type: "store", label: "Store History", color: "#b45309" },
                { type: "coinSeller", label: "Coin Seller", color: "#b45309" },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => {
                    setHistoryType(item.type);
                    setActivePage(1);
                    setsDate("ALL");
                    seteDate("ALL");
                  }}
                  className="btn btn-sm"
                  style={{
                    background:
                      historyType === item.type ? item.color : "#1a1f2e",
                    color: historyType === item.type ? "#fff" : "#6b7280",
                    border: `1px solid ${historyType === item.type ? item.color : "#2a3050"}`,
                    borderRadius: 6,
                    fontSize: 12,
                    transition: "0.2s",
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          style: {
            backgroundColor: "#131929",
            color: "#fff",
            borderRadius: "15px",
            border: "1px solid #1e2640",
            margin: "10px",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          className="d-flex justify-content-between align-items-center"
          style={{ borderBottom: "1px solid #1e2640", padding: "15px 20px" }}
        >
          <h6 className="m-0 text-white" style={{ fontWeight: 500 }}>
            Select Date Range
          </h6>
          <IconButton
            onClick={() => setShowModal(false)}
            size="small"
            style={{ color: "#fff" }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ padding: "0" }}>
          <div className="d-flex flex-column">
            <div
              className="rdr-mobile-wrapper"
              style={{ maxHeight: "60vh", overflowY: "auto" }}
            >
              <DateRangePicker
                onChange={(item) => {
                  setDate([item.selection]);
                  const dayStart = dayjs(item.selection.startDate).format(
                    "M/DD/YYYY",
                  );
                  const dayEnd = dayjs(item.selection.endDate).format(
                    "M/DD/YYYY",
                  );
                  setsDate(dayStart);
                  seteDate(dayEnd);
                }}
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                ranges={date}
                direction="vertical"
              />
            </div>
            <div className="p-3 d-flex gap-2" style={{ borderTop: "1px solid #1e2640" }}>
              <button
                className="cancelBtn"
                onClick={() => {
                  setsDate("ALL");
                  seteDate("ALL");
                  setActivePage(1);
                  setDate([{ startDate: new Date(), endDate: new Date(), key: "selection" }]);
                  if (historyType !== "coinPlan" && historyType !== "vipPlan") {
                    props.userHistory({ userId: user._id, type: historyType, start: 1, limit: rowsPerPage });
                  } else if (historyType === "coinPlan") {
                    props.coinPlanHistory(user._id, 1, rowsPerPage, "ALL", "ALL");
                  } else if (historyType === "vipPlan") {
                    props.vipPlanHistory(user._id, 1, rowsPerPage, "ALL", "ALL");
                  }
                  setShowModal(false);
                }}
              >
                Clear
              </button>
              <button
                className="applyBtn"
                onClick={() => {
                  const dayStart = sDate;
                  const dayEnd = eDate;
                  setActivePage(1);
                  if (historyType !== "coinPlan" && historyType !== "vipPlan") {
                    const data = {
                      userId: user._id,
                      type: historyType,
                      startDate: dayStart,
                      endDate: dayEnd,
                      start: 1,
                      limit: rowsPerPage,
                    };
                    props.userHistory(data);
                  } else if (historyType === "coinPlan") {
                    props.coinPlanHistory(
                      user._id,
                      1,
                      rowsPerPage,
                      dayStart,
                      dayEnd,
                    );
                  } else if (historyType === "vipPlan") {
                    props.vipPlanHistory(
                      user._id,
                      1,
                      rowsPerPage,
                      dayStart,
                      dayEnd,
                    );
                  }
                  setShowModal(false);
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── TABLE CARD ── */}
      <div className="row mt-4">
        <div className="col">
          <div className="table-card" id="card">
            <div className="table-card-body">
              <div style={{ overflowX: "auto", width: "100%" }}>
                {(historyType === "diamond" || historyType === "rCoin") && (
                  <>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mt-3 gap-2 px-3">
                      {historyType === "diamond" ? (
                        <h4 className="text-white">Diamond History</h4>
                      ) : (
                        <h4 className="text-warning">RCoin History</h4>
                      )}
                      <div className="text-start text-md-end small">
                        <span className="text-danger d-block d-md-inline">
                          Total Income :
                          <span className="text-info">&nbsp;{income}</span>
                        </span>

                        <span className="text-danger d-block d-md-inline ms-md-3">
                          Total Outgoing :
                          <span className="text-info">&nbsp;{outgoing}</span>
                        </span>
                      </div>
                    </div>
                    <table className="table table-striped mt-3">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Detail</th>
                          <th>Diamond</th>
                          <th>RCoin</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.length > 0 ? (
                          data.map((data, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              {data.type === 1 && (
                                <td>
                                  <img
                                    src={diamond}
                                    alt="icon"
                                    height={20}
                                    width={20}
                                  />
                                  FMCoin converted to diamonds
                                </td>
                              )}
                              {data.type === 2 && <td>Diamond purchase</td>}
                              {data?.type === 10 && <td>TeenPatti_Game</td>}
                              {data?.type === 15 && <td>Roulette_Game</td>}
                              {data?.type === 16 && <td>FerryWheel_Game</td>}
                              {data?.type === 17 && <td>CrashRocket_Game</td>}
                              {data.type === 11 ? (
                                <td>Avatar Frame</td>
                              ) : (
                                data.type == 9 && <td>Admission Car</td>
                              )}
                              {data.type === 3 && (
                                <td>
                                  <img
                                    src={videocall}
                                    alt="icon"
                                    height={20}
                                    width={20}
                                  />
                                  Call with&nbsp;
                                  <a
                                    href={() => false}
                                    onClick={() => handleUserInfo(data.userId)}
                                    className="pointer-cursor text-danger"
                                  >
                                    @{data.userName}
                                  </a>
                                </td>
                              )}
                              {data.type === 4 && (
                                <td>
                                  <img
                                    src={ads}
                                    alt="icon"
                                    height={20}
                                    width={20}
                                  />
                                  Watching ads
                                </td>
                              )}
                              {data.type === 5 && (
                                <td>
                                  <img
                                    src={moneybag}
                                    alt="icon"
                                    height={20}
                                    width={20}
                                  />
                                  Login bonus
                                </td>
                              )}
                              {data.type === 6 && (
                                <td>
                                  <img
                                    src={moneybag}
                                    alt="icon"
                                    height={20}
                                    width={20}
                                  />
                                  Referral bonus
                                </td>
                              )}
                              {data.type === 7 && (
                                <td>
                                  <img
                                    src={withdraw}
                                    alt="icon"
                                    height={20}
                                    width={20}
                                  />
                                  CashOut [Redeem]
                                </td>
                              )}
                              {data.type === 8 && (
                                <td>
                                  <img
                                    src={male}
                                    alt="icon"
                                    height={20}
                                    width={20}
                                  />
                                  By Admin
                                </td>
                              )}
                              {data.type === 12 && <td>By Diamond Seller</td>}
                              {data.type === 0 && data.userName === null ? (
                                <td>
                                  <img
                                    src={gift}
                                    alt="icon"
                                    height={20}
                                    width={20}
                                  />
                                  Gift Broadcast during livestream by
                                  {user.name ? " " + user.name : " you"}
                                </td>
                              ) : data.income && data.type === 0 ? (
                                <td>
                                  <img
                                    src={gift}
                                    alt="icon"
                                    height={20}
                                    width={20}
                                  />
                                  gift received by @{data.userName}
                                </td>
                              ) : (
                                !data.income &&
                                data.type === 0 && (
                                  <td
                                    onClick={() => handleUserInfo(data.userId)}
                                    className="pointer-cursor"
                                  >
                                    <img
                                      src={gift}
                                      alt="icon"
                                      height={20}
                                      width={20}
                                    />
                                    gift send to @{data.userName}
                                  </td>
                                )
                              )}
                              {data.diamond ? (
                                data.income ? (
                                  data.diamond !== 0 ? (
                                    <td className="text-success text-nowrap">
                                      <img
                                        src={Diamond}
                                        width="15"
                                        height="15"
                                        style={{
                                          verticalAlign: "middle",
                                          marginRight: "1px",
                                        }}
                                      />{" "}
                                      +{data.diamond}
                                    </td>
                                  ) : (
                                    <td>{data.diamond}</td>
                                  )
                                ) : data.diamond !== 0 ? (
                                  <td className="text-danger text-nowrap">
                                    <img
                                      src={Diamond}
                                      width="15"
                                      height="15"
                                      style={{
                                        verticalAlign: "middle",
                                        marginRight: "1px",
                                      }}
                                    />{" "}
                                    -{data.diamond}
                                  </td>
                                ) : (
                                  <td>
                                    <img
                                      src={Diamond}
                                      width="15"
                                      height="15"
                                      style={{
                                        verticalAlign: "middle",
                                        marginRight: "1px",
                                      }}
                                    />{" "}
                                    {data.diamond}
                                  </td>
                                )
                              ) : (
                                <td>0</td>
                              )}
                              {data.rCoin ? (
                                data.income ? (
                                  data.rCoin !== 0 ? (
                                    <td className="text-success">
                                      <img
                                        src={Rcoin}
                                        width="15px"
                                        height="15px"
                                        style={{
                                          verticalAlign: "middle",
                                          marginRight: "1px",
                                        }}
                                      />{" "}
                                      +{data.rCoin}
                                    </td>
                                  ) : (
                                    <td>{data.rCoin}</td>
                                  )
                                ) : data.rCoin !== 0 ? (
                                  <td className="text-red">-{data.rCoin}</td>
                                ) : (
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
                                    {data.rCoin}
                                  </td>
                                )
                              ) : (
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
                                  0
                                </td>
                              )}
                              <td className="text-nowrap">{data.date}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="12" align="center">
                              Nothing to show!!
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </>
                )}

                {historyType === "call" && (
                  <>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mt-3 gap-2 px-3">
                      <h4 className="text-danger mb-0">Call History</h4>
                      <div className="text-start text-md-end small">
                        <span className="text-danger d-block d-md-inline">
                          Total Call Charge :
                          <span className="text-info">
                            &nbsp;{totalCallCharge}
                          </span>
                        </span>
                      </div>
                    </div>
                    <table className="table table-striped mt-3">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Detail</th>
                          <th>Type</th>
                          <th>Duration</th>
                          <th>Diamond</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.length > 0 ? (
                          data.map((data, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              {data.type === "Outgoing" && user.name && (
                                <td>
                                  <img
                                    src={videocall}
                                    alt="icon"
                                    height={20}
                                    width={20}
                                  />{" "}
                                  {user.name} Called to&nbsp;
                                  <a
                                    href={() => false}
                                    onClick={() => handleUserInfo(data.userId)}
                                    className="pointer-cursor text-danger"
                                  >
                                    @{data.userName}
                                  </a>
                                </td>
                              )}
                              {data.type === "Outgoing" && !user.name && (
                                <td>
                                  <img
                                    src={videocall}
                                    alt="icon"
                                    height={20}
                                    width={20}
                                  />
                                  You Called to &nbsp;
                                  <a
                                    href={() => false}
                                    onClick={() => handleUserInfo(data.userId)}
                                    className="pointer-cursor text-danger"
                                  >
                                    @{data.userName}
                                  </a>
                                </td>
                              )}
                              {data.type === "Incoming" && user.name && (
                                <td>
                                  <a
                                    href={() => false}
                                    onClick={() => handleUserInfo(data.userId)}
                                    className="pointer-cursor text-danger"
                                  >
                                    <img
                                      src={videocall}
                                      alt="diamond"
                                      height={20}
                                      width={20}
                                    />{" "}
                                    @{data.userName}
                                  </a>{" "}
                                  Called {user.name}
                                </td>
                              )}
                              {data.type === "Incoming" && !user.name && (
                                <td>
                                  <a
                                    href={() => false}
                                    onClick={() => handleUserInfo(data.userId)}
                                    className="pointer-cursor text-danger"
                                  >
                                    <img
                                      src={gift}
                                      alt="icon"
                                      height={20}
                                      width={20}
                                    />{" "}
                                    @{data.userName}
                                  </a>{" "}
                                  Called You
                                </td>
                              )}
                              {data.type === "MissedCall" && (
                                <td>
                                  <a
                                    href={() => false}
                                    onClick={() => handleUserInfo(data.userId)}
                                    className="pointer-cursor text-danger"
                                  >
                                    📞 @{data.userName}
                                  </a>{" "}
                                  [MissedCall]
                                </td>
                              )}
                              {data.type === "Outgoing" && (
                                <td className="text-info">{data.type}</td>
                              )}
                              {data.type === "Incoming" && (
                                <td className="text-success">{data.type}</td>
                              )}
                              {data.type === "MissedCall" && (
                                <td className="text-red">{data.type}</td>
                              )}
                              <td>
                                {data.callConnect
                                  ? moment
                                      .utc(
                                        moment(new Date(data.callEndTime)).diff(
                                          moment(new Date(data.callStartTime)),
                                        ),
                                      )
                                      .format("HH:mm:ss")
                                  : "00:00:00"}
                              </td>
                              {data.callConnect && data.type === "Outgoing" ? (
                                <td className="text-red">
                                  <img
                                    src={Diamond}
                                    width="15"
                                    height="15"
                                    style={{
                                      verticalAlign: "middle",
                                      marginRight: "1px",
                                    }}
                                  />
                                  -{data.diamond}
                                </td>
                              ) : (
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
                                  0
                                </td>
                              )}
                              <td>
                                <img
                                  src={Rcoin}
                                  width="15px"
                                  height="15px"
                                  style={{
                                    verticalAlign: "middle",
                                    marginRight: "1px",
                                  }}
                                />
                                {data.date}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="15" align="center">
                              Nothing to show!!
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </>
                )}

                {historyType === "liveStreaming" && (
                  <>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mt-3 gap-2 px-3">
                      <h4 className="text-primary mb-0">
                        LiveStreaming History
                      </h4>
                      <div className="text-start text-md-end small">
                        <span className="text-danger d-block d-md-inline">
                          Total Income :
                          <span className="text-info">
                            &nbsp;{liveStreamingIncome}
                          </span>
                        </span>
                      </div>
                    </div>
                    <table className="table table-striped mt-3">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Date</th>
                          <th>Duration</th>
                          <th>Audio Live</th>
                          <th>Joined User</th>
                          <th>Received Gift</th>
                          <th>Received FMCoin</th>
                          <th>Comments</th>
                          <th>Increased Follower</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.length > 0 ? (
                          data.map((data, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{data.startTime}</td>
                              <td>
                                {data.endTime && data.startTime
                                  ? moment
                                      .utc(
                                        moment(new Date(data.endTime)).diff(
                                          moment(new Date(data.startTime)),
                                        ),
                                      )
                                      .format("HH:mm:ss")
                                  : "00:00:00"}
                              </td>
                              <td className="text-center text-primary">
                                {data.audio === false ? (
                                  <span className="text-danger">False</span>
                                ) : (
                                  <span className="text-success">True</span>
                                )}
                              </td>
                              <td className="text-center text-primary">
                                {data.user}
                              </td>
                              <td className="text-center text-info">
                                {data.gifts}
                              </td>
                              <td className="text-center text-warning">
                                {data.rCoin}
                              </td>
                              <td className="text-center text-success">
                                {data.comments}
                              </td>
                              <td className="text-center text-danger">
                                {data.fans}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="15" align="center">
                              Nothing to show!!
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </>
                )}

                {historyType === "coinPlan" && (
                  <>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mt-3 gap-2 px-3">
                      <h4 className="text-primary mb-0">
                        Purchase Diamond Plan History
                      </h4>
                    </div>
                    <PurchaseCoinPlan data={data} />
                  </>
                )}

                {historyType === "vipPlan" && (
                  <>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mt-3 gap-2 px-3">
                      <h4 className="text-primary mb-0">
                        Purchase Vip Plan History
                      </h4>
                    </div>
                    <PurchaseVipPlan data={data} />
                  </>
                )}

                {historyType === "gameCoin" && (
                  <>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mt-3 gap-2 px-3">
                      <h4 className="text-primary mb-0">Game History</h4>
                    </div>
                    <UserGameHistory data={data} />
                  </>
                )}

                {historyType === "store" && (
                  <>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mt-3 gap-2 px-3">
                      <h4 className="text-primary mb-0">store History</h4>
                    </div>
                    <AdmissionCarHistory data={data} />
                  </>
                )}

                {historyType === "coinSeller" && (
                  <>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mt-3 gap-2 px-3">
                      <h4 className="text-primary mb-0">coin Seller</h4>
                    </div>
                    <UserCoinSellerHistory data={data} />
                  </>
                )}
              </div>
              <div className="px-5">
                <Pagination
                  activePage={activePage}
                  rowsPerPage={rowsPerPage}
                  userTotal={
                    historyType === "coinPlan"
                      ? totalPlan
                      : historyType === "vipPlan"
                        ? totalVipPlan
                        : totalHistoryUser
                  }
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

export default connect(null, { userHistory, coinPlanHistory, vipPlanHistory })(
  UserHistory,
);
