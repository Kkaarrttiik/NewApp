import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

import { Doughnut, Line } from "react-chartjs-2";

import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

//dayjs
import dayjs from "dayjs";

//datepicker
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

// action
import { connect, useDispatch, useSelector } from "react-redux";
import { usePermission } from "../context/PermissionProvider";
import { getAnalytic, getDashboard } from "../store/dashboard/action";
import { getSetting } from "../store/setting/action";
import { Box, TextField } from "@mui/material";
import { formatNumber } from "../util/formatNumber";

// Register the date adapter

const Dashboard = (props) => {
  let label = [];
  let data = [];
  let data1 = [];
  const dispatch = useDispatch();
  const [type, setType] = useState("USER");

  const dashboard = useSelector((state) => state.dashboard.dashboard);
  const analytic = useSelector((state) => state.dashboard.analytic);
  const setting = useSelector((state) => state.setting.setting);

  const { can } = usePermission();
  const canShowUser = can("admin/user", "List");
  const canShowPlanHistory = can("admin/planHistory", "List");
  const canShowPost = can("admin/mainPost", "List");
  const canShowVideo = can("admin/mainVideo", "List");
  const canShowReportedUser = can("admin/reportedUser", "List");

  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1); // Previous month's first day
  var lastDay = new Date(date.getFullYear(), date.getMonth(), 0); // Previous month's last day

  const startDate = dayjs(firstDay).format("YYYY-MM-DD");
  const endDate = dayjs(lastDay).format("YYYY-MM-DD");
  const [sDate, setSDate] = useState("ALL");
  const [eDate, setEDate] = useState("ALL");
  const [dateRangeStr, setDateRangeStr] = useState("");
  const [analyticData, setAnalyticData] = useState([]);

  const [selectedDateRange, setSelectedDateRange] = useState([
    { startDate: new Date(), endDate: new Date(), key: "selection" },
  ]);
  const [openDatePicker1, setOpenDatePicker1] = useState(false);
  const [openDatePicker2, setOpenDatePicker2] = useState(false);
  const datePickerRef1 = useRef(null);
  const datePickerRef2 = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (datePickerRef1.current && !datePickerRef1.current.contains(e.target)) {
        setOpenDatePicker1(false);
      }
      if (datePickerRef2.current && !datePickerRef2.current.contains(e.target)) {
        setOpenDatePicker2(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    dispatch(getDashboard());
    dispatch(getSetting());
    dispatch(getAnalytic("USER", sDate, eDate));
  }, [dispatch]);

  useEffect(() => {
    setAnalyticData(analytic);
  }, [analytic]);

  if (analyticData.length > 0) {
    if (type === "REVENUE" && analyticData.length === 1) {
      analyticData[0]?.coinRevenue?.map((date) => {
        label.push(date._id);
      });

      analyticData[0]?.vipRevenue?.map((date) => {
        label.push(date._id);
      });
      const uniqLabel = [...new Set(label)];

      uniqLabel.map((data__) => {
        const count = analyticData[0]?.coinRevenue?.find(
          (element) => element._id === data__,
        );
        console.log("count: ", count);
        if (count) {
          data.push(count?.dollar || 0);
        } else {
          data.push(0);
        }
        const count_ = analyticData[0]?.vipRevenue?.find(
          (element) => element._id === data__,
        );
        if (count_) {
          data1.push(count_?.dollar || 0);
        } else {
          data1.push(0);
        }
      });
    } else {
      analyticData.map((data_) => {
        label.push(data_._id);
        data.push(data_.count);
      });
    }
  }

  const handleAnalytic = (type) => {
    setSDate("ALL");
    setEDate("ALL");
    setType(type);
    if (type !== "ACTIVE USER") {
      dispatch(getAnalytic(type, sDate, eDate));
    }
  };
  const labelFormate = label?.map((item) => dayjs(item).format("DD-MM-YYYY"));
  const chartData = {
    labels: labelFormate,
    datasets: [
      {
        label: type?.toUpperCase(),
        data: data,
        fill: true,
        backgroundColor: "rgba(255, 99, 132, 0.1)",
        borderColor: "rgb(255, 99, 132)",
        lineTension: 0.5,
      },
    ],
  };
  const multiLineChartData = {
    labels: labelFormate,
    datasets: [
      {
        label: "Coin Revenue",
        data: data,
        fill: true,
        backgroundColor: "rgba(255, 99, 132, 0.1)",
        borderColor: "rgb(255, 99, 132)",
        lineTension: 0.5,
      },
      {
        label: "VIP Revenue",
        data: data1,
        fill: true,
        backgroundColor: "rgb(205,235,255,0.1)",
        borderColor: "#68B9F0",
        lineTension: 0.5,
      },
    ],
  };

  const pieChartData = {
    maintainAspectRatio: false,
    responsive: false,
    labels: ["Total User", "Active User"],
    datasets: [
      {
        data: [dashboard.totalUser, dashboard.activeUser],
        backgroundColor: ["#e8538f", "#fc9494"],
        hoverBackgroundColor: ["#e8538f", "#fc9494"],
      },
    ],
  };

  //Apply button function for analytic
  // const handleApply = (event, picker) => {
  //   picker.element.val(
  //     picker.startDate.format("YYYY-MM-DD") +
  //       " - " +
  //       picker.endDate.format("YYYY-MM-DD"),
  //   );
  //   const dayStart = dayjs(picker.startDate).format("YYYY-MM-DD");

  //   const dayEnd = dayjs(picker.endDate).format("YYYY-MM-DD");

  //   setSDate(dayStart);
  //   setEDate(dayEnd);

  //   dispatch(getAnalytic(type, dayStart, dayEnd));
  // };
  const handleApply = () => {
    const start = dayjs(selectedDateRange[0].startDate).format("YYYY-MM-DD");
    const end = dayjs(selectedDateRange[0].endDate).format("YYYY-MM-DD");

    const formatted = `${start} - ${end}`;

    setDateRangeStr(formatted);

    setSDate(start);
    setEDate(end);

    setOpenDatePicker1(false);
    setOpenDatePicker2(false);

    dispatch(getAnalytic(type, start, end));
  };

  //Cancel button function for analytic
  const handleCancel = () => {
    // picker.element.val("");
    setDateRangeStr("");
    setSDate("ALL");
    setEDate("ALL");
    setOpenDatePicker1(false);
    setOpenDatePicker2(false);

    // dispatch(getAnalytic(type, startDate, endDate));
    dispatch(getAnalytic(type, "ALL", "ALL"));
  };

  const commonOptions = { responsive: true, maintainAspectRatio: false };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Dashboard</h3>
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
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12">
          <div className="row">
            {canShowUser && (
              <div className="col-lg-3 col-md-4 col-sm-6">
                <Link
                  to={"/admin/user"}
                  style={{
                    boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,77,141,0.3)";
                    e.currentTarget.style.boxShadow = `0 10px 30px rgba(255,77,141,0.25)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#1F2937";
                    e.currentTarget.style.boxShadow =
                      "0 10px 25px rgba(0,0,0,0.4)";
                  }}
                  className="card stats-card"
                >
                  <div
                    className="card-body pointer-cursor"
                    onClick={() => handleAnalytic("USER")}
                  >
                    <div className="stats-info">
                      <h5 className="card-title">
                        {dashboard.totalUser ? formatNumber(dashboard.totalUser) : 0}
                        {/* <span className="stats-change stats-change-danger">-8%</span> */}
                      </h5>
                      <p className="stats-text">Total User</p>
                    </div>
                    <div className="stats-icon change-danger">
                      <i className="material-icons">people_alt</i>
                    </div>
                  </div>
                </Link>
              </div>
            )}
            {canShowUser && (
              <div className="col-lg-3 col-md-4 col-sm-6">
                <Link
                  style={{
                    boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,77,141,0.3)";
                    e.currentTarget.style.boxShadow = `0 10px 30px rgba(255,77,141,0.25)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#1F2937";
                    e.currentTarget.style.boxShadow =
                      "0 10px 25px rgba(0,0,0,0.4)";
                  }}
                  to={"/admin/user"}
                  className="card stats-card"
                >
                  <div
                    className="card-body pointer-cursor"
                    onClick={() => handleAnalytic("TODAY NEW USER")}
                  >
                    <div className="stats-info">
                      <h5 className="card-title">
                        {dashboard.todayNewUser ? formatNumber(dashboard.todayNewUser) : 0}
                        {/* <span className="stats-change stats-change-danger">-8%</span> */}
                      </h5>
                      <p className="stats-text">Today New User</p>
                    </div>
                    <div className="stats-icon change-success">
                      <i className="material-icons">perm_identity</i>
                    </div>
                  </div>
                </Link>
              </div>
            )}
            {canShowUser && (
              <div className="col-lg-3 col-md-4 col-sm-6">
                <Link
                  style={{
                    boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,77,141,0.3)";
                    e.currentTarget.style.boxShadow = `0 10px 30px rgba(255,77,141,0.25)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#1F2937";
                    e.currentTarget.style.boxShadow =
                      "0 10px 25px rgba(0,0,0,0.4)";
                  }}
                  to={"/admin/user"}
                  state={{ userType: "activeUser" }}
                  className="card stats-card"
                >
                  <div
                    className="card-body pointer-cursor"
                    onClick={() => handleAnalytic("ACTIVE USER")}
                  >
                    <div className="stats-info">
                      <h5 className="card-title">
                        {dashboard.activeUser ? formatNumber(dashboard.activeUser) : 0}
                      </h5>
                      <p className="stats-text">Total Active User</p>
                    </div>
                    <div className="stats-icon change-pink">
                      <i className="material-icons">group</i>
                    </div>
                  </div>
                </Link>
              </div>
            )}
            {canShowUser && (
              <div className="col-lg-3 col-md-4 col-sm-6">
                <Link
                  style={{
                    boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,77,141,0.3)";
                    e.currentTarget.style.boxShadow = `0 10px 30px rgba(255,77,141,0.25)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#1F2937";
                    e.currentTarget.style.boxShadow =
                      "0 10px 25px rgba(0,0,0,0.4)";
                  }}
                  to={"/admin/user"}
                  state={{ userType: "isVIP" }}
                  className="card stats-card"
                >
                  <div
                    className="card-body pointer-cursor"
                    onClick={() => handleAnalytic("VIP")}
                  >
                    <div className="stats-info">
                      <h5 className="card-title">
                        {dashboard.vipUser ? formatNumber(dashboard.vipUser) : 0}
                      </h5>
                      <p className="stats-text">Total VIP User</p>
                    </div>
                    <div className="stats-icon change-danger">
                      <i className="material-icons">settings_accessibility</i>
                    </div>
                  </div>
                </Link>
              </div>
            )}
            {canShowPlanHistory && (
              <div className="col-lg-3 col-md-4 col-sm-6">
                <Link
                  style={{
                    boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,77,141,0.3)";
                    e.currentTarget.style.boxShadow = `0 10px 30px rgba(255,77,141,0.25)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#1F2937";
                    e.currentTarget.style.boxShadow =
                      "0 10px 25px rgba(0,0,0,0.4)";
                  }}
                  to={"/admin/planHistory"}
                  className="card stats-card"
                >
                  <div
                    className="card-body pointer-cursor"
                    onClick={() => handleAnalytic("REVENUE")}
                  >
                    <div className="stats-info">
                      <h5 className="card-title">
                        {dashboard.revenue ? formatNumber(dashboard.revenue?.dollar) || 0 : 0}
                        {` ${setting.currency?.symbol || "$"}`}
                        {/* <span className="stats-change stats-change-danger">-8%</span> */}
                      </h5>
                      <p className="stats-text">Total Revenue</p>
                    </div>
                    <div className="stats-icon change-success">
                      <i className="material-icons">account_balance_wallet</i>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {canShowPost && (
              <div className="col-lg-3 col-md-4 col-sm-6">
                <Link
                  style={{
                    boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,77,141,0.3)";
                    e.currentTarget.style.boxShadow = `0 10px 30px rgba(255,77,141,0.25)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#1F2937";
                    e.currentTarget.style.boxShadow =
                      "0 10px 25px rgba(0,0,0,0.4)";
                  }}
                  to={"/admin/post"}
                  className="card stats-card"
                >
                  <div
                    className="card-body pointer-cursor"
                    onClick={() => handleAnalytic("POST")}
                  >
                    <div className="stats-info">
                      <h5 className="card-title">
                        {dashboard.post ? formatNumber(dashboard.post) : 0}
                      </h5>
                      <p className="stats-text">Total Post</p>
                    </div>
                    <div className="stats-icon change-pink">
                      <i className="material-icons">post_add</i>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {canShowVideo && (
              <div className="col-lg-3 col-md-4 col-sm-6">
                <Link
                  style={{
                    boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,77,141,0.3)";
                    e.currentTarget.style.boxShadow = `0 10px 30px rgba(255,77,141,0.25)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#1F2937";
                    e.currentTarget.style.boxShadow =
                      "0 10px 25px rgba(0,0,0,0.4)";
                  }}
                  to={"/admin/video"}
                  className="card stats-card"
                >
                  <div
                    className="card-body pointer-cursor"
                    onClick={() => handleAnalytic("VIDEO")}
                  >
                    <div className="stats-info">
                      <h5 className="card-title">
                        {dashboard.video ? formatNumber(dashboard.video) : 0}
                      </h5>
                      <p className="stats-text">Total Video</p>
                    </div>
                    <div className="stats-icon change-danger">
                      <i className="material-icons">voice_chat</i>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {canShowReportedUser && (
              <div className="col-lg-3 col-md-4 col-sm-6">
                <Link
                  style={{
                    boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,77,141,0.3)";
                    e.currentTarget.style.boxShadow = `0 10px 30px rgba(255,77,141,0.25)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#1F2937";
                    e.currentTarget.style.boxShadow =
                      "0 10px 25px rgba(0,0,0,0.4)";
                  }}
                  to={"/admin/reportedUser"}
                  className="card stats-card"
                >
                  <div
                    className="card-body pointer-cursor"
                    onClick={() => handleAnalytic("REPORT")}
                  >
                    <div className="stats-info">
                      <h5 className="card-title">
                        {dashboard.report ? formatNumber(dashboard.report) : 0}
                      </h5>
                      <p className="stats-text">Total Report User</p>
                    </div>
                    <div className="stats-icon change-success">
                      <i className="material-icons">next_plan</i>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* chart */}
      <h4 className="text-white mt-3">{type}</h4>
      {/* <div className="d-flex justify-content-end">
        <DateRangePicker
          initialSettings={{
            autoUpdateInput: false,
            locale: {
              cancelLabel: "Clear",
            },
            maxDate: new Date(),
            buttonClasses: ["btn btn-dark"],
          }}
          onApply={handleApply}
          onCancel={handleCancel}
        >
          <input
            type="text"
            readOnly
            className="form-control float-left text-center"
            placeholder="Select Date"
            style={{ width: 195, fontWeight: 700 }}
          />
        </DateRangePicker>
      </div>

      {data?.length > 0 ? (
        type === "ACTIVE USER" ? (
          <div className="pie mt-3">
            <Doughnut data={pieChartData} options={{ responsive: true }} />
          </div>
        ) : type === "REVENUE" ? (
          <div className="pie mt-3">
            <div className="d-flex justify-content-end">
              <DateRangePicker
                initialSettings={{
                  autoUpdateInput: false,
                  locale: {
                    cancelLabel: "Clear",
                  },
                  maxDate: new Date(),
                  buttonClasses: ["btn btn-dark"],
                }}
                onApply={handleApply}
                onCancel={handleCancel}
              >
                <input
                  type="text"
                  readOnly
                  className="form-control float-left"
                  placeholder="Select Date"
                  style={{ width: 180, fontWeight: 700 }}
                />
              </DateRangePicker>
            </div>
            <Line data={multiLineChartData} options={{ responsive: true }} />
          </div>
        ) : (
          <div className="rows mt-3">
            <Line data={chartData} options={{ responsive: true }} />
          </div>
        )
      ) : (
        <p className="text-center">Chart not Available</p>
      )} */}

      <Box display="flex" justifyContent="flex-end" position="relative" ref={datePickerRef1}>
        <TextField
          value={dateRangeStr}
          placeholder="Select Date"
          size="small"
          onClick={() => setOpenDatePicker1(!openDatePicker1)}
          InputProps={{ readOnly: true }}
          sx={{
            width: 200,
            fontWeight: 700,
            borderRadius: 1,
            "& .MuiInputBase-root": {
              "&.Mui-focused fieldset": {
                borderColor: "#2d2d3f",
              },
              "&:hover fieldset": {
                borderColor: "#2d2d3f",
              },
              borderColor: "#2d2d3f",
              color: "#fff !important",
              cursor: "pointer",
            },
          }}
        />
        {openDatePicker1 && (
          <div
            style={{
              position: "absolute",
              zIndex: 9999,
              top: "110%",
              right: 0,
              backgroundColor: "#181821",
              borderRadius: "12px",
              boxShadow: "0 10px 50px rgba(0,0,0,0.8)",
              border: "1px solid #2e303a",
              padding: "10px",
            }}
          >
            <DateRangePicker
              maxDate={new Date()}
              onChange={(item) => setSelectedDateRange([item.selection])}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              retainEndDateOnFirstSelection={true}
              ranges={selectedDateRange}
              direction="horizontal"
              rangeColors={["#1a6fd4"]}
            />
            <div className="d-flex justify-content-end mt-2 gap-2">
              <button className="cancelBtn" onClick={handleCancel}>
                Clear
              </button>
              <button className="applyBtn" onClick={handleApply}>
                Apply
              </button>
            </div>
          </div>
        )}
      </Box>

      {data?.length > 0 ? (
        type === "ACTIVE USER" ? (
          <Box mt={3} sx={{ width: "100%", height: { xs: 250, md: 350 } }}>
            <Doughnut data={pieChartData} options={commonOptions} />
          </Box>
        ) : type === "REVENUE" ? (
          <Box mt={3}>
            <Box display="flex" justifyContent="flex-end" mb={2} position="relative" ref={datePickerRef2}>
              <TextField
                value={dateRangeStr}
                placeholder="Select Date"
                size="small"
                onClick={() => setOpenDatePicker2(!openDatePicker2)}
                InputProps={{ readOnly: true }}
                sx={{
                  width: 200,
                  fontWeight: 700,
                  borderRadius: 1,
                  "& .MuiInputBase-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "#2d2d3f",
                    },
                    "&:hover fieldset": {
                      borderColor: "#2d2d3f",
                    },
                    borderColor: "#2d2d3f",
                    color: "#fff !important",
                    cursor: "pointer",
                  },
                }}
              />
              {openDatePicker2 && (
                <div
                  style={{
                    position: "absolute",
                    zIndex: 9999,
                    top: "110%",
                    right: 0,
                    backgroundColor: "#181821",
                    borderRadius: "12px",
                    boxShadow: "0 10px 50px rgba(0,0,0,0.8)",
                    border: "1px solid #2e303a",
                    padding: "10px",
                  }}
                >
                  <DateRangePicker
                    maxDate={new Date()}
                    onChange={(item) => setSelectedDateRange([item.selection])}
                    showSelectionPreview={true}
                    moveRangeOnFirstSelection={false}
                    retainEndDateOnFirstSelection={true}
                    ranges={selectedDateRange}
                    direction="horizontal"
                    rangeColors={["#1a6fd4"]}
                  />
                  <div className="d-flex justify-content-end mt-2 gap-2">
                    <button className="cancelBtn" onClick={handleCancel}>
                      Clear
                    </button>
                    <button className="applyBtn" onClick={handleApply}>
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </Box>

            <Box sx={{ width: "100%", height: { xs: 250, md: 400 } }}>
              <Line data={multiLineChartData} options={commonOptions} />
            </Box>
          </Box>
        ) : (
          <Box mt={3} sx={{ width: "100%", height: { xs: 250, md: 400 } }}>
            <Line data={chartData} options={commonOptions} />
          </Box>
        )
      ) : (
        <Box textAlign="center">Chart not Available</Box>
      )}
    </>
  );
};

export default connect(null, { getDashboard, getSetting, getAnalytic })(
  Dashboard,
);
