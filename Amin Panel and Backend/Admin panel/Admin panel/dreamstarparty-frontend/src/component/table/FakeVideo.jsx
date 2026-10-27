import { Tooltip, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useEffect, useState, useRef } from "react";

//jquery
import $ from "jquery";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//action
import { deleteVideo, getFakeVideo } from "../../store/video/action";

//routing
import { Link, useNavigate } from "react-router-dom";

// dayjs
import dayjs from "dayjs";

// base url

import { alert, warning } from "../../util/Alert";

//pagination
import Pagination from "../../pages/Pagination";

//MUI icon

//Date Range Picker
import { DateRangePicker } from "react-date-range";
//Calendar Css
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

//image
import { IconCopy } from "@tabler/icons-react";
import { usePermission } from "../../context/PermissionProvider";
import { Toast } from "../../util/Toast";
import noImage from "../../assets/images/noImage.png";

const FakeVideo = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [date, setDate] = useState([]);
  const [search, setSearch] = useState();
  const [sDate, setsDate] = useState("ALL");
  const [eDate, seteDate] = useState("ALL");
  const [openVideoModal, setOpenVideoModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState("");

  useEffect(() => {
    $("#card").click(() => {
      $("#datePicker").removeClass("show");
    });
  }, []);

  useEffect(() => {
    dispatch(getFakeVideo(null, activePage, rowsPerPage, sDate, eDate));
  }, [dispatch, activePage, rowsPerPage, sDate, eDate, 1]);

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
        getFakeVideo(
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
    $("#datePicker").removeClass("show");
    dispatch(getFakeVideo(null, activePage, rowsPerPage, sDate, eDate, "Fake"));
  };

  const collapsedDatePicker = () => {
    $("#datePicker").toggleClass("collapse");
  };

  const handleVideoDetail = (videoId) => {
    navigate("/admin/video/detail", { state: videoId });
  };

  const handleOpen = () => {

    sessionStorage.removeItem("fakeRelite");
    navigate("/admin/video/dialog");
  };

  const handleEdit = (data) => {

    sessionStorage.setItem("fakeRelite", JSON.stringify(data));
    navigate("/admin/video/dialog");
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
        {props.type !== "fakeVideo" && (
          <div className="row">
            <div className="col-12 col-md-6 order-md-1 order-last">
              <h3 className="mb-3 text-white">Fake Relite</h3>
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
                    Fake Relite
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
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              {/* Left — New button */}
              <div className="d-flex align-items-center gap-2">
                {canCreate && (
                  <button
                    type="button"
                    className="edit-btn"
                    onClick={handleOpen}
                    id="bannerDialog"
                  >
                    <i className="fa fa-plus"></i>
                    <span className="icon_margin">New</span>
                  </button>
                )}
              </div>

              {/* Right — Search */}
              <div className="search-wrapper">
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
              className="collapse mt-5 pt-5"
              aria-expanded="false"
            >
              <div className="container table-responsive">
                <div key={JSON.stringify(date)}>
                  <DateRangePicker
                    onChange={(item) => {
                      setDate([item.selection]);
                      const dayStart = dayjs(item.selection.startDate).format(
                        "M/DD/YYYY",
                      );
                      const dayEnd = dayjs(item.selection.endDate).format(
                        "M/DD/YYYY",
                      );
                      setActivePage(1);
                      setsDate(dayStart);
                      seteDate(dayEnd);
                      props.getPost(
                        null,
                        activePage,
                        rowsPerPage,
                        sDate,
                        eDate,
                        "fake",
                      );
                    }}
                    showSelectionPreview={true}
                    moveRangeOnFirstSelection={false}
                    ranges={date}
                    direction="horizontal"
                  />
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
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Video</th>
                    <th>Username</th>
                    <th className="text-nowrap">Unique Id</th>
                    <th>Location</th>
                    <th>Like</th>
                    <th>Comment</th>
                    <th>Created At</th>
                    <th>Detail</th>
                    {canEdit && <th>Edit</th>}
                    {canDelete && <th>Delete</th>}
                  </tr>
                </thead>
                <tbody>
                  {data?.length > 0 ? (
                    data.map((data, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <div 
                               style={{ position: 'relative', width: '50px', height: '50px', cursor: 'pointer' }}
                               onClick={() => {
                                 setCurrentVideo(data?.video);
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
                          <td className="text-nowrap">
                            {data?.userId?.username
                              ? data?.userId?.username
                              : "-"}{" "}
                            <IconCopy
                              size={16}
                              className="ms-1 text-nowrap"
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                copyToClipboard(
                                  data?.userId?.username
                                    ? data?.userId?.username
                                    : "-",
                                )
                              }
                            />
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
                          <td className="text-nowrap">
                            {data?.location ? data?.location : "-"}
                          </td>
                          <td className="text-danger">{data?.like}</td>
                          <td className="text-success">{data?.comment}</td>
                          <td className="text-nowrap">{data?.date}</td>
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
                          {canEdit && (
                            <td>
                              <Tooltip title="Edit">
                                <button
                                  type="button"
                                  className="btn-sm edit-btn"
                                  onClick={() => handleEdit(data)}
                                >
                                  <i className="fa fa-edit"></i>
                                </button>
                              </Tooltip>
                            </td>
                          )}
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

export default connect(null, { getFakeVideo, deleteVideo })(FakeVideo);
