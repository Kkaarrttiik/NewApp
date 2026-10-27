import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useEffect, useState, useRef } from "react";

//jquery
import $ from "jquery";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//action
import { deletePost, getPost } from "../../store/post/action";

//routing
import { Link, useNavigate } from "react-router-dom";

//pagination
import Pagination from "../../pages/Pagination";

// dayjs
import dayjs from "dayjs";

// base url
import { baseURL } from "../../util/Config";

//alert
import { usePermission } from "../../context/PermissionProvider";
import { alert, warning } from "../../util/Alert";

//MUI icon
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

//image
import noImage from "../../assets/images/noImage.png";

//Date Range Picker
import { DateRangePicker } from "react-date-range";
//Calendar Css
import { IconCopy } from "@tabler/icons-react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { Toast } from "../../util/Toast";

const PostTable = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { can } = usePermission();
  const canCreate = can("admin/mainPost", "Create");
  const canEdit = can("admin/mainPost", "Edit");
  const canDelete = can("admin/mainPost", "Delete");
  const { post, totalPost } = useSelector((state) => state.post);

  const [data, setData] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
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
    const handleOutsideClick = (e) => {
      if (
        !$(e.target).closest(".rdrDateRangePickerWrapper").length &&
        !$(e.target).closest(".rdrDateInput").length &&
        !$(e.target).closest("#datePicker").length &&
        !$(e.target).closest(".edit-btn").length
      ) {
        $("#datePicker").css("display", "none");
      }
    };
    $(document).on("click", handleOutsideClick);
    return () => {
      $(document).off("click", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    dispatch(getPost(null, activePage, rowsPerPage, sDate, eDate));
  }, [dispatch, activePage, rowsPerPage]);

  useEffect(() => {
    setData(post);
  }, [post]);

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
    setData(post);
  }, [date, post]);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    if (value !== "" && !isNaN(value) && value > 0) {
      setRowsPerPage(value);
    } else {
      console.error("Invalid rowsPerPage value:", value);
    }
  };

  const searchTimeout = useRef(null);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      dispatch(getPost(null, 1, rowsPerPage, sDate, eDate, value));
      setActivePage(1);
    }, 1000);
  };

  const handleDelete = (postId) => {

    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
          props.deletePost(postId);
          alert("Deleted!", `Post has been deleted!`, "success");
        }
      })
      .catch((err) => console.log(err));
  };

  const getAllPost = () => {
    setActivePage(1);
    setsDate("ALL");
    seteDate("ALL");
    $("#datePicker").removeClass("show");
    dispatch(getPost(null, 1, rowsPerPage, "ALL", "ALL"));
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

  const handleDateFilter = () => {
    $("#datePicker").css("display", "none");
    const dayStart = dayjs(date[0].startDate).format("YYYY/M/DD");
    const dayEnd = dayjs(date[0].endDate).format("YYYY/M/DD");
    setsDate(dayStart);
    seteDate(dayEnd);
    setActivePage(1);
    dispatch(getPost(null, 1, rowsPerPage, dayStart, dayEnd));
  };

  const copyToClipboard = (Text) => {
    navigator.clipboard.writeText(Text);
    Toast("success", "Copied successfully!");
  };

  return (
    <>
      <div className="page-title">
        {props.type !== "realPost" && (
          <div className="row">
            <div className="col-12 col-md-6 order-md-1 order-last">
              <h3 className="mb-3 text-white">Social Post</h3>
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
                    Social Post
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* ── FILTER BAR ── */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="filter-bar">
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between flex-wrap gap-2">
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <button
                  className="edit-btn"
                  style={{ marginRight: 5 }}
                  onClick={getAllPost}
                >
                  All
                </button>
                <button
                  className="edit-btn collapsed"
                  value="check"
                  data-toggle="collapse"
                  data-target="#datePicker"
                  onClick={collapsedDatePicker}
                >
                  Analytics
                  <ExpandMoreIcon style={{ fontSize: 18, marginLeft: 4 }} />
                </button>
                <p style={{ paddingLeft: 10 }} className="my-2 text-secondary">
                  {sDate !== "ALL" && sDate + " to " + eDate}
                </p>
              </div>
              <div className="search-wrapper w-100 w-md-auto">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="search"
                  placeholder="Search by username, uniqueId or location"
                  className="search-input"
                  onChange={handleSearchChange}
                />
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
                    onChange={(item) => {
                      setDate([item.selection]);
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
                      getAllPost();
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
          <div className="table-card" id="card">
            {/* <div className="table-card-body"> */}
            <div style={{ overflowX: "auto", width: "100%" }}>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Post</th>
                    <th>Username</th>
                    <th>Unique Id</th>
                    <th>Location</th>
                    <th>Like</th>
                    <th>Comment</th>
                    <th>Created At</th>
                    <th>Detail</th>
                    {canDelete && <th>Delete</th>}
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
                              src={data?.post ? baseURL + data?.post : noImage}
                              style={{
                                border: "2px solid #1e2640",
                                borderRadius: 10,
                                objectFit: "cover",
                                display: "block",
                              }}
                            />
                          </td>
                          <td>
                            {data?.userId?.name}
                            <IconCopy
                              size={16}
                              className="ms-1"
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                copyToClipboard(data?.userId?.name)
                              }
                            />
                          </td>
                          <td>
                            {data?.userId?.uniqueId &&
                            data?.userId?.uniqueId !== "-" ? (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {data?.userId?.uniqueId}
                                <IconCopy
                                  size={16}
                                  className="ms-1"
                                  style={{ cursor: "pointer" }}
                                  onClick={() =>
                                    copyToClipboard(data?.userId?.uniqueId)
                                  }
                                />
                              </div>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td>{data?.location}</td>
                          <td className="text-danger">{data?.like}</td>
                          <td className="text-success">{data?.comment}</td>
                          <td>{dayjs(data?.date).format("DD MMM YYYY ")}</td>
                          <td>
                            <Tooltip title="View Profile">
                              <button
                                style={{
                                  background: "#0f766e",
                                  color: "#99f6e4",
                                  border: "none",
                                }}
                                type="button"
                                className="edit-btn"
                                onClick={() => {
                                  sessionStorage.setItem(
                                    "PostDetail",
                                    JSON.stringify(data),
                                  );
                                  navigate("/admin/post/detail");
                                }}
                              >
                                <i className="fa fa-eye"></i>
                              </button>
                            </Tooltip>
                          </td>
                          {canDelete && (
                            <td>
                              <Tooltip title="Delete">
                                <button
                                  type="button"
                                  className="delete-btn"
                                  onClick={() => handleDelete(data?._id)}
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
                      <td colSpan="10" align="center">
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
                userTotal={totalPost}
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
                onChange={(item) => {
                  setDate([item.selection]);
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
                  getAllPost();
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

export default connect(null, { getPost, deletePost })(PostTable);
