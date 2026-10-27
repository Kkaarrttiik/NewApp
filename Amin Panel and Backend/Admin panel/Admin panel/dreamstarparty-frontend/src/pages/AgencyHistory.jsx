import { useEffect, useState } from "react";
import { Close } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";

//react-redux
import { useDispatch, useSelector } from "react-redux";

//routing
import { Link } from "react-router-dom";

//jquery
import $ from "jquery";

//dayjs
import dayjs from "dayjs";

import { getAgencyHistory } from "../store/agency/action";

//MUI icon

//Date Range Picker
import { IconCopy } from "@tabler/icons-react";
import { DateRangePicker } from "react-date-range";
import { Toast } from "../util/Toast";

const AgencyHistory = () => {
  const dispatch = useDispatch();
  const { agencyHistory, agencyHistoryTotal } = useSelector(
    (state) => state.agency,
  );
  const [data, setData] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [date, setDate] = useState([]);
  const [sDate, setsDate] = useState("ALL");
  const [eDate, seteDate] = useState("ALL");
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
    dispatch(getAgencyHistory(sDate, eDate, activePage, rowsPerPage));
  }, [activePage, rowsPerPage]);

  useEffect(() => {
    setData(agencyHistory);
  }, [agencyHistory]);

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
    setData(agencyHistory);
  }, [date, agencyHistory]);

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

  const handleDateFilter = () => {
    setActivePage(1);
    $("#datePicker").css("display", "none");
    dispatch(getAgencyHistory(sDate, eDate, activePage, rowsPerPage));
  };

  const getAllAgencyHistory = () => {
    setActivePage(1);
    setsDate("ALL");
    seteDate("ALL");
    $("#datePicker").css("display", "none");
    dispatch(getAgencyHistory("ALL", "ALL", 1, rowsPerPage));
  };

  const copyToClipboard = (Text) => {
    navigator.clipboard.writeText(Text);
    Toast("success", "Copied successfully!");
  };

  return (
    <>
      <div className="row">
        <div className="col-12 col-md-6 order-md-1 order-last">
          <h3 className="mb-3 text-white">Agency History</h3>
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
                Agency History
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ── FILTER BAR ── */}
      <div className="row mb-3 mt-2">
        <div className="col-12">
          <div className="filter-bar">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <button
                id="datePickerToggleButton"
                className="edit-btn collapsed"
                value="check"
                data-toggle="collapse"
                data-target="#datePicker"
                onClick={collapsedDatePicker}
              >
                Analytics
              </button>
              <p style={{ paddingLeft: 10 }} className="my-2 text-secondary">
                {sDate !== "ALL" && sDate + " to " + eDate}
              </p>
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
                    onChange={(item) => {
                      setDate([item.selection]);
                      const dayStart = dayjs(item.selection.startDate).format(
                        "YYYY/M/DD",
                      );
                      const dayEnd = dayjs(item.selection.endDate).format(
                        "YYYY/M/DD",
                      );
                      setsDate(dayStart);
                      seteDate(dayEnd);
                    }}
                    showSelectionPreview={true}
                    moveRangeOnFirstSelection={false}
                    ranges={date}
                    direction="horizontal"
                  />
                </div>
                <div className="mt-3 d-flex gap-2 justify-content-end">
                  <button
                    className="cancelBtn"
                    onClick={() => {
                      getAllAgencyHistory();
                      $("#datePicker").css("display", "none");
                    }}
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
                    <th>Agency Name</th>
                    <th>Agency Code</th>
                    <th>Agency Earning</th>
                    <th>Host Earning</th>
                    <th>Host Count</th>
                    <th>CreatedAt</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.length > 0 ? (
                    data?.map((data, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{data?.agencyName ? data?.agencyName : "-"}</td>
                          <td>
                            {data?.agencyCode ? data?.agencyCode : "-"}
                            {data?.agencyCode && (
                            <IconCopy
                              size={16}
                              className="ms-1"
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                copyToClipboard(
                                  data?.agencyCode ? data?.agencyCode : "-",
                                )
                              }
                            />
                            )}
                          </td>
                          <td>
                            {data?.totalAgencyEarning
                              ? data?.totalAgencyEarning.toFixed(0)
                              : 0}
                          </td>
                          <td>
                            {data?.totalHostEarning
                              ? data?.totalHostEarning.toFixed(0)
                              : 0}
                          </td>
                          <td>{data?.hostCount ? data?.hostCount : "-"}</td>
                          <td>
                            {dayjs(data?.createdAt).format("DD MMM, YYYY")}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="10" align="center">
                        Nothing to show!!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* </div> */}
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
                onChange={(item) => {
                  setDate([item.selection]);
                  const dayStart = dayjs(item.selection.startDate).format(
                    "YYYY/M/DD",
                  );
                  const dayEnd = dayjs(item.selection.endDate).format(
                    "YYYY/M/DD",
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
                  getAllAgencyHistory();
                  setShowModal(false);
                }}
              >
                Clear
              </button>
              <button
                className="applyBtn"
                onClick={() => {
                  handleDateFilter();
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

export default AgencyHistory;
