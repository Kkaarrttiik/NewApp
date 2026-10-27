import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Close } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import dayjs from "dayjs";
import $ from "jquery";
import React, { useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import { useDispatch, useSelector } from "react-redux";
import Diamond from "../../../assets/images/diamond.png";
import Pagination from "../../../pages/Pagination";
import {
  getGameHistory,
  resetGameCoin,
} from "../../../store/GameHistory/action";

const TeenPatti = () => {
  const { gameHistory, total, adminCoin } = useSelector(
    (state) => state.gameHistory,
  );
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [date, setDate] = useState([
    {
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // First day of current month
      endDate: new Date(), // Current date
      key: "selection",
    },
  ]);
  const [sDate, setsDate] = useState(
    dayjs(new Date(new Date().getFullYear(), new Date().getMonth(), 1)).format(
      "YYYY-MM-DD",
    ),
  );
  const [eDate, seteDate] = useState(dayjs(new Date()).format("YYYY-MM-DD"));

  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showModal, setShowModal] = useState(false);

  const maxDate = new Date();

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
    dispatch(getGameHistory(activePage, rowsPerPage, sDate, eDate));
  }, [dispatch, activePage, rowsPerPage, sDate, eDate]);

  useEffect(() => {
    setData(gameHistory);
  }, [gameHistory]);

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
    if (date.length === 0) {
      setDate([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: "selection",
        },
      ]);
    }
    setData(gameHistory);
  }, [date, gameHistory]);

  const getAllUser = () => {
    setActivePage(1);
    setsDate("ALL");
    seteDate("ALL");
    $("#datePicker").css("display", "none");
    dispatch(getGameHistory(activePage, rowsPerPage, sDate, eDate));
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
    setActivePage(1);
    setRowsPerPage(value);
  };

  const handleResetCoin = () => {
    dispatch(resetGameCoin());
  };

  const handleDateChange = (item) => {
    setDate([item.selection]);
  };

  const applyDateFilter = () => {
    const dayStart = dayjs(date[0].startDate).format("YYYY-MM-DD");
    const dayEnd = dayjs(date[0].endDate).format("YYYY-MM-DD");
    setActivePage(1);
    setsDate(dayStart);
    seteDate(dayEnd);
    dispatch(getGameHistory(activePage, rowsPerPage, dayStart, dayEnd));

    // Close the date picker
    $("#datePicker").css("display", "none");
  };

  return (
    <>
      {/* ── FILTER BAR ── */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="filter-bar">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              {/* Left — buttons */}
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <button
                  className="btn btn-sm"
                  style={{
                    background: "#1a1f2e",
                    color: "#c8cfe0",
                    border: "1px solid #2a3050",
                    borderRadius: 6,
                  }}
                  onClick={handleResetCoin}
                >
                  Reset Diamond
                </button>
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
                  data-bs-toggle="collapse"
                  data-bs-target="#datePicker"
                  onClick={collapsedDatePicker}
                >
                  Analytics
                  <ExpandMoreIcon style={{ fontSize: 18, marginLeft: 4 }} />
                </button>
                <p style={{ paddingLeft: 10 }} className="my-2 text-secondary">
                  {sDate !== "ALL" && sDate + " to " + eDate}
                </p>
              </div>

              {/* Right — Admin Total Diamonds */}
              <div className="d-flex align-items-center">
                <span style={{ color: "#9CA3AF", fontSize: 13 }}>
                  Admin Total Diamonds :
                  <span style={{ color: "#6ea8fe" }}>
                    &nbsp;&nbsp;{adminCoin}
                  </span>
                </span>
              </div>
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
                    maxDate={maxDate}
                    onChange={handleDateChange}
                    showSelectionPreview={true}
                    moveRangeOnFirstSelection={false}
                    ranges={date}
                    direction="horizontal"
                  />
                  <div className="mt-3 d-flex gap-2 justify-content-end">
                    <button
                      className="cancelBtn"
                      onClick={() => {
                        getAllUser();
                        $("#datePicker").css("display", "none");
                      }}
                    >
                      Clear
                    </button>
                    <button
                      className="applyBtn"
                      onClick={applyDateFilter}
                    >
                      Apply
                    </button>
                  </div>
                </div>
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
              <table className="table" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Admin Diamond</th>
                    <th>Win/Lose</th>
                    <th>winner Diamond Minus</th>
                    <th>Total Add Diamond</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Info</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.length > 0 ? (
                    data?.map((data, index) => {
                      var gameDate = data?.date ? data?.date.split(",") : [];
                      return (
                        <>
                          <tr
                            data-bs-toggle="collapse"
                            data-bs-target={`#demo${index}`}
                            className="accordion-toggle pointer-cursor"
                          >
                            <td>{index + 1}</td>
                            <td className="text-success">
                              <img
                                src={Diamond}
                                width="15"
                                height="15"
                                style={{
                                  verticalAlign: "middle",
                                  marginRight: "1px",
                                }}
                              />{" "}
                              {data?.updatedAdminCoin}
                            </td>
                            <td
                              className={
                                data?.totalAdd + data?.winnerCoinMinus > 0
                                  ? "text-success"
                                  : "text-danger"
                              }
                            >
                              {data?.totalAdd + data?.winnerCoinMinus > 0
                                ? data?.totalAdd + data?.winnerCoinMinus
                                : Math.abs(
                                    data?.totalAdd + data?.winnerCoinMinus,
                                  )}
                            </td>
                            <td className="text-danger">
                              <img
                                src={Diamond}
                                width="15"
                                height="15"
                                style={{
                                  verticalAlign: "middle",
                                  marginRight: "1px",
                                }}
                              />{" "}
                              {parseInt(data?.winnerCoinMinus)}
                            </td>
                            <td className="text-warning">
                              <img
                                src={Diamond}
                                width="15"
                                height="15"
                                style={{
                                  verticalAlign: "middle",
                                  marginRight: "1px",
                                }}
                              />{" "}
                              {data?.totalAdd}
                            </td>
                            <td className="text-info">{gameDate[0]}</td>
                            <td className="text-primary">{gameDate[1]}</td>
                            <td className="pointer-cursor">
                              <i className="fas fa-info-circle fa-lg"></i>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan="8" className="hiddenRow">
                              <div
                                id={`demo${index}`}
                                className="accordian-body collapse"
                              >
                                <h6 className="text-danger">Frame History</h6>
                                <table className="w-100">
                                  <thead>
                                    <tr>
                                      <th>No</th>
                                      <th>select Frame</th>
                                      <th>bit</th>
                                      <th>card</th>
                                    </tr>
                                  </thead>
                                  <tbody
                                    style={{
                                      maxHeight: 100,
                                      overflowY: "auto",
                                    }}
                                  >
                                    {data?.cardCoin?.length > 0 ? (
                                      data?.cardCoin.map((report, no) => (
                                        <tr key={no} className="border-top">
                                          <td
                                            className={`${report?.winner ? "text-success" : "text-danger"} fw-bold`}
                                          >
                                            {no + 1}
                                          </td>
                                          <td
                                            className={`${report?.winner ? "text-success" : "text-danger"} fw-bold`}
                                          >
                                            {report?.selectFrame}
                                          </td>
                                          <td
                                            className={`${report?.winner ? "text-success" : "text-danger"} fw-bold`}
                                          >
                                            {report?.bit}
                                          </td>
                                          <td
                                            className={`${report?.winner ? "text-success" : "text-danger"} fw-bold`}
                                          >
                                            {report?.card}
                                          </td>
                                        </tr>
                                      ))
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
                            </td>
                          </tr>
                        </>
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
                maxDate={maxDate}
                onChange={handleDateChange}
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
                  getAllUser();
                  setShowModal(false);
                }}
              >
                Clear
              </button>
              <button
                className="applyBtn"
                onClick={() => {
                  applyDateFilter();
                  setShowModal(false);
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TeenPatti;
