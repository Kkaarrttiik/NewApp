import { useEffect, useState } from "react";

//jquery
import $ from "jquery";

//dayjs
import dayjs from "dayjs";

//redux
import { connect, useSelector } from "react-redux";

//action
import { coinPlanHistory } from "../../store/coinPlan/action";

//pagination
import Pagination from "../../pages/Pagination";

//MUI icon
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

//Date Range Picker
import { DateRangePicker } from "react-date-range";
//Calendar Css
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

//routing
import { Link } from "react-router-dom";

import PurchaseCoinPlan from "./history/PurchaseCoinPlan";

const PurchaseCoinPlanTable = (props) => {
  const [data, setData] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const [date, setDate] = useState([
    {
      startDate: firstDay,
      endDate: lastDay,
      key: "selection",
    },
  ]);
  const [sDate, setsDate] = useState("ALL");
  const [eDate, seteDate] = useState("ALL");
  const { history, totalPlan } = useSelector((state) => state.coinPlan);
  const [gateway, setGateway] = useState("ALL");

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxDate = new Date();

  useEffect(() => {
    $("#card").click((e) => {
      if (
        !$(e.target).closest(".rdrDateRangePickerWrapper").length &&
        !$(e.target).closest(".rdrDateInput").length
      ) {
        $("#datePicker").css("display", "none");
      }
    });
  }, []);

  useEffect(() => {
    props.coinPlanHistory(null, activePage, rowsPerPage, sDate, eDate);
  }, [activePage, rowsPerPage]);

  useEffect(() => {
    $("#datePicker").css("display", "none");
    if (gateway === "ALL") {
      setData(history);
    } else {
      setData(history.filter((item) => item.paymentGateway === gateway));
    }
  }, [history, gateway]);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
  };

  const getAllHistory = () => {
    setActivePage(1);
    setGateway("ALL");
    setsDate("ALL");
    seteDate("ALL");
    $("#datePicker").css("display", "none");
    props.coinPlanHistory(null, 1, rowsPerPage, "ALL", "ALL");
  };

  const collapsedDatePicker = () => {
    $("#datePicker").toggle();
  };

  const handleDateFilter = () => {
    setActivePage(1);
    const dayStart = dayjs(date[0].startDate).format("YYYY-MM-DD");
    const dayEnd = dayjs(date[0].endDate).format("YYYY-MM-DD");
    setsDate(dayStart);
    seteDate(dayEnd);
    props.coinPlanHistory(null, 1, rowsPerPage, dayStart, dayEnd);
    $("#datePicker").css("display", "none");
  };

  return (
    <>
      <div className="page-title">
        {props.type !== "coinPlanHistory" && (
          <div className="row">
            <div className="col-12 col-md-6 order-md-1 order-last">
              <h3 className="mb-3 text-white">Purchase Coin Plan History</h3>
            </div>
            <div className="col-12 col-md-6 order-md-2 order-first">
              <nav
                aria-label="breadcrumb"
                className="breadcrumb-header float-start float-lg-end"
              >
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/admin/dashboard" className="text-danger">
                      Dashboard
                    </Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Plan
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        )}
      </div>
      <div className="row">
        <div className="col">
          <div className="card" id="card">
            <div className="card-header pb-0">
              <div className="row my-3">
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-8 float-left">
                  <div className="text-left align-sm-left d-flex flex-wrap justify-content-start gap-2">
                    <button className="btn btn-info" onClick={getAllHistory}>
                      All
                    </button>
                    <div style={{ position: "relative" }}>
                      <button
                        className="collapsed btn btn-info"
                        value="check"
                        onClick={
                          windowWidth <= 576 ? null : collapsedDatePicker
                        }
                        data-bs-toggle={windowWidth <= 576 ? "modal" : ""}
                        data-bs-target={windowWidth <= 576 ? "#dateModal" : ""}
                      >
                        Analytics
                        <ExpandMoreIcon />
                      </button>

                      {windowWidth > 576 && (
                        <div
                          id="datePicker"
                          className="date-picker-wrapper"
                          aria-expanded="false"
                          style={{
                            display: "none",
                            position: "absolute",
                            zIndex: 9999,
                            top: "110%",
                            left: 0,
                            width: "auto",
                            backgroundColor: "#181821",
                            borderRadius: "12px",
                            boxShadow: "0 10px 50px rgba(0,0,0,0.8)",
                            border: "1px solid #2e303a",
                          }}
                        >
                          <div className="container p-0">
                            <div key={JSON.stringify(date)}>
                              <DateRangePicker
                                maxDate={maxDate}
                                onChange={(item) => {
                                  setDate([item.selection]);
                                }}
                                showSelectionPreview={true}
                                moveRangeOnFirstSelection={false}
                                ranges={date}
                                direction="horizontal"
                                editableDateInputs={true}
                              />
                              <div className="mt-3 p-3 d-flex gap-2 justify-content-end">
                                <button
                                  className="cancelBtn"
                                  onClick={getAllHistory}
                                >
                                  Clear
                                </button>
                                <button
                                  className="applyBtn"
                                  onClick={handleDateFilter}
                                >
                                  Apply
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <p style={{ paddingLeft: 10 }} className="my-2">
                      {sDate !== "ALL" && sDate + " to " + eDate}
                    </p>
                  </div>
                </div>
                <div className="col-12 col-md-6 col-lg-4 mt-3 mt-md-0">
                  <div className="d-flex justify-content-md-end justify-content-start w-100">
                    <div className="search-wrapper w-100" style={{ maxWidth: windowWidth <= 768 ? "100%" : "250px", position: "relative" }}>
                      <select
                        className="search-input w-100"
                        style={{ appearance: "none", cursor: "pointer", paddingRight: "30px" }}
                        value={gateway}
                        onChange={(e) => {
                          setGateway(e.target.value);
                          setActivePage(1);
                        }}
                      >
                        <option value="ALL">Select Payment Gateways</option>
                        {[...new Set(history.map((item) => item.paymentGateway).filter(Boolean))].map((gw) => (
                          <option key={gw} value={gw}>
                            {gw}
                          </option>
                        ))}
                      </select>
                      <i className="fas fa-chevron-down search-icon" style={{ right: "15px", left: "auto" }}></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="card-body card-overflow pt-0"> */}
            <div className="table-responsive">
              <PurchaseCoinPlan data={data} />
            </div>
            <div className="px-5">
              <Pagination
                activePage={activePage}
                rowsPerPage={rowsPerPage}
                userTotal={totalPlan}
                handleRowsPerPage={handleRowsPerPage}
                handlePageChange={handlePageChange}
              />
            </div>
            {/* </div> */}
          </div>
        </div>
      </div>
      {/*DateRangePicker Modal for Mobile */}
      <div
        className="modal fade"
        id="dateModal"
        tabIndex="-1"
        aria-labelledby="dateModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div
            className="modal-content"
            style={{
              backgroundColor: "#181821",
              borderRadius: "12px",
              border: "1px solid #2e303a",
            }}
          >
            <div className="modal-header border-0">
              <h5 className="modal-title text-white" id="dateModalLabel">
                Select Date Range
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body p-0 overflow-hidden">
              <div key={JSON.stringify(date)}>
                <DateRangePicker
                  maxDate={maxDate}
                  onChange={(item) => {
                    setDate([item.selection]);
                  }}
                  showSelectionPreview={true}
                  moveRangeOnFirstSelection={false}
                  ranges={date}
                  direction="vertical"
                />
              </div>
            </div>
            <div className="modal-footer border-0 d-flex gap-2">
              <button
                className="cancelBtn"
                onClick={() => {
                  getAllHistory();
                  window.$("#dateModal").modal("hide");
                }}
              >
                Clear
              </button>
              <button
                className="applyBtn"
                onClick={() => {
                  handleDateFilter();
                  window.$("#dateModal").modal("hide");
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { coinPlanHistory })(PurchaseCoinPlanTable);
