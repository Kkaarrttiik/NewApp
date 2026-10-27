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
import { deleteVideo, getVideo } from "../../store/video/action";

//routing
import { Link, useNavigate } from "react-router-dom";

// dayjs
import dayjs from "dayjs";

// base url
import { baseURL } from "../../util/Config";

import { usePermission } from "../../context/PermissionProvider";
import { alert, warning } from "../../util/Alert";

//pagination
import Pagination from "../../pages/Pagination";

//MUI icon
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

//Date Range Picker
import { DateRangePicker } from "react-date-range";
//Calendar Css
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

//image
import { IconCopy } from "@tabler/icons-react";
import noImage from "../../assets/images/noImage.png";
import { Toast } from "../../util/Toast";

const VideoTable = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [limit, setLimit] = useState("");
  const [search, setSearch] = useState();
  const [date, setDate] = useState([]);
  const [sDate, setsDate] = useState("ALL");
  const [eDate, seteDate] = useState("ALL");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showModal, setShowModal] = useState(false);
  const [openVideoModal, setOpenVideoModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState("");

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
    dispatch(getVideo(null, activePage, rowsPerPage, sDate, eDate));
  }, [dispatch, activePage, rowsPerPage]);

  const { video, totalVideo } = useSelector((state) => state.video);

  const { can } = usePermission();
  const canCreate = can("admin/mainVideo", "Create");
  const canEdit = can("admin/mainVideo", "Edit");
  const canDelete = can("admin/mainVideo", "Delete");

  useEffect(() => {
    setData(video);
  }, [video]);

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
    setData(video);
  }, [date, video]);
  // }, [date, video]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = parseInt(urlParams.get("page"));
    const limitNum = parseInt(urlParams.get("limit"));

    if (!isNaN(page) && page > 0) {
      setActivePage(page);
    }
    if (!isNaN(limitNum) && limitNum > 0) {
      setRowsPerPage(limitNum);
      setLimit(limitNum);
    }

    if (page && limitNum) {
      dispatch(getVideo(null, page, limitNum, sDate, eDate));
    }
  }, [window.location.search]);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
  };

  const searchTimeout = useRef(null);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      dispatch(
        getVideo(
          null,
          1,
          rowsPerPage,
          sDate,
          eDate,
          value,
        ),
      );
      setActivePage(1);
    }, 1000);
  };

  const handleVideoDetail = (videoId) => {
    // sessionStorage.setItem(
    //   "videoDetail",
    //   JSON.stringify({
    //     currentPage: activePage,
    //     currentRowsPerPage: rowsPerPage,
    //   })
    // );

    // >>>>>>> Stashed changes
    // navigate({
    //   pathname: `/admin/video/detail`,
    //   state: { id: videoId },
    // });

    navigate("/admin/video/detail", { state: videoId });
  };

  const handleDelete = (videoId) => {

    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
          props.deleteVideo(videoId);
          alert("Deleted!", `Relite has been deleted!`, "success");
        }
      })
      .catch((err) => console.log(err));
  };

  const getAllVideo = () => {
    setActivePage(1);
    setsDate("ALL");
    seteDate("ALL");
    $("#datePicker").css("display", "none");
    dispatch(getVideo(null, 1, rowsPerPage, "ALL", "ALL"));
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

  const handleApplyFilter = () => {
    const datePicker = $("#datePicker");
    datePicker.css("display", "none");
    const dayStart = dayjs(date[0].startDate).format("YYYY/M/DD");
    const dayEnd = dayjs(date[0].endDate).format("YYYY/M/DD");
    setsDate(dayStart);
    seteDate(dayEnd);
    setActivePage(1);
    dispatch(getVideo(null, 1, rowsPerPage, dayStart, dayEnd));
  };

  const copyToClipboard = (Text) => {
    navigator.clipboard.writeText(Text);
    Toast("success", "Copied successfully!");
  };

  return (
    <>
      <style>{`
        .video-thumbnail-container:hover .play-icon-overlay {
          opacity: 1 !important;
        }
      `}</style>
      <div className="page-title">
        {props.type !== "realVideo" && (
          <div className="row">
            <div className="col-12 col-md-6 order-md-1 order-last">
              <h3 className="mb-3 text-white">Relite</h3>
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
                    Relite
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* ── SEPARATE SEARCH/ACTION BAR ── */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="filter-bar">
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between flex-wrap gap-2">
              {/* Left — Action buttons */}
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <button className="edit-btn" onClick={getAllVideo}>
                  All
                </button>
                <button className="edit-btn" onClick={collapsedDatePicker}>
                  Analytics
                  <ExpandMoreIcon />
                </button>
                <p style={{ paddingLeft: 10, margin: 0 }} className="my-2">
                  {sDate !== "ALL" && sDate + " to " + eDate}
                </p>
              </div>

              {/* Right — Search */}
              <div className="search-wrapper w-100 w-md-auto">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="search"
                  placeholder="Search by username or uniqueId"
                  aria-describedby="button-addon4"
                  className="search-input"
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            {/* Date Picker */}
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
                      getAllVideo();
                      $("#datePicker").css("display", "none");
                    }}
                  >
                    Clear
                  </button>
                  <button
                    className="applyBtn"
                    onClick={handleApplyFilter}
                  >
                    Apply
                  </button>
                </div>
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
              // className="table-card-body"
            >
              <table className="table table-striped table-center">
                <thead className="text-center">
                  <tr>
                    <th>No.</th>
                    <th>Video</th>
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
                <tbody className="text-center">
                  {data.length > 0 ? (
                    data.map((data, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td
                            // style={{
                            //   display: "flex",
                            //   alignItems: "center",
                            //   justifyContent: "center",
                            // }}
                          >
                            <div 
                               style={{ position: 'relative', width: '50px', height: '50px', cursor: 'pointer', float: 'left' }}
                               onClick={() => {
                                 const videoSrc = data?.video ? (String(data.video).startsWith("http") ? data.video : baseURL + data.video) : "";
                                 setCurrentVideo(videoSrc);
                                 setOpenVideoModal(true);
                               }}
                               className="video-thumbnail-container"
                            >
                               <img
                                 height="50px"
                                 width="50px"
                                 src={data?.screenshot ? data.screenshot : noImage}
                                 alt="thumbnail"
                                 style={{
                                   boxShadow: "0 5px 15px 0 rgb(105 103 103 / 0%)",
                                   border: "2px solid #1e2640",
                                   borderRadius: 10,
                                   objectFit: "cover",
                                 }}
                               />
                               <div className="play-icon-overlay" style={{
                                 position: 'absolute',
                                 top: 0, left: 0, width: '100%', height: '100%',
                                 display: 'flex', alignItems: 'center', justifyContent: 'center',
                                 backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 10, opacity: 0, transition: 'opacity 0.3s'
                               }}>
                                 <i className="fas fa-play text-white" style={{ fontSize: '18px' }}></i>
                               </div>
                            </div>
                          </td>
                          <td>
                            {data?.userId?.name
                              ? data?.userId?.name
                              : "-"}
                            {/* <IconCopy
                              size={16}
                              className="ms-1"
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                copyToClipboard(
                                  data?.userId?.name
                                    ? data?.userId?.name
                                    : "-",
                                )
                              }
                            /> */}
                          </td>
                          <td>
                            {data?.userId?.uniqueId &&
                            data.userId.uniqueId !== "-" ? (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {data.userId.uniqueId}
                                <IconCopy
                                  size={16}
                                  className="ms-1"
                                  style={{ cursor: "pointer" }}
                                  onClick={() =>
                                    copyToClipboard(data.userId.uniqueId)
                                  }
                                />
                              </div>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td>{data.location ? data.location : "-"}</td>
                          <td className="text-danger">{data.like}</td>
                          <td className="text-success">{data.comment}</td>
                          <td>{data.date}</td>
                          <td>
                            <Tooltip title="View Profile">
                              <button
                                style={{
                                  background: "#0f766e",
                                  color: "#99f6e4",
                                  border: "none",
                                }}
                                type="button"
                                className="btn-sm edit-btn"
                                onClick={() => handleVideoDetail(data?._id)}
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
                                  className="btn-sm delete-btn"
                                  onClick={() => handleDelete(data._id)}
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
            <div className="px-5">
              <Pagination
                activePage={activePage}
                rowsPerPage={rowsPerPage}
                userTotal={totalVideo}
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
                  getAllVideo();
                  setShowModal(false);
                }}
              >
                Clear
              </button>
              <button
                className="applyBtn"
                onClick={() => {
                  handleApplyFilter();
                  setShowModal(false);
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Modal */}
      <Dialog
        open={openVideoModal}
        onClose={() => setOpenVideoModal(false)}
        fullWidth
        maxWidth="sm"
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
            Video Preview
          </h6>
          <IconButton
            onClick={() => setOpenVideoModal(false)}
            size="small"
          >
            <Close className="text-white" />
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ padding: "0" }}>
          <div className="d-flex flex-column align-items-center" style={{ padding: '20px' }}>
            <video
              src={currentVideo}
              controls
              autoPlay
              style={{
                width: "100%",
                maxHeight: "60vh",
                borderRadius: "10px",
                objectFit: "contain",
                backgroundColor: "#000"
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default connect(null, { getVideo, deleteVideo })(VideoTable);
