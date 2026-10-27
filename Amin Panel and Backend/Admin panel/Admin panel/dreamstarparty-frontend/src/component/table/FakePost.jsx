import { Tooltip } from "@mui/material";
import { useEffect, useState, useRef } from "react";

//jquery
import $ from "jquery";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//action
import { deletePost, getFakePost, insertPost } from "../../store/post/action";

//routing
import { Link, useNavigate } from "react-router-dom";

//pagination
import Pagination from "../../pages/Pagination";

// dayjs
import dayjs from "dayjs";

// base url
import { baseURL } from "../../util/Config";

//alert
import { alert, warning } from "../../util/Alert";

//MUI icon

//image

//Date Range Picker
import { DateRangePicker } from "react-date-range";

//Calendar Css
import { IconCopy } from "@tabler/icons-react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { usePermission } from "../../context/PermissionProvider";
import { Toast } from "../../util/Toast";

const FakePost = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { post, totalPost } = useSelector((state) => state.post);

  const { can } = usePermission();
  const canCreate = can("admin/mainPost", "Create");
  const canEdit = can("admin/mainPost", "Edit");
  const canDelete = can("admin/mainPost", "Delete");

  const [data, setData] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState("");

  const [date, setDate] = useState([]);
  const [sDate, setsDate] = useState("ALL");
  const [eDate, seteDate] = useState("ALL");

  useEffect(() => {
    setData(post);
  }, [post]);

  useEffect(() => {
    $("#card").click(() => {
      $("#datePicker").removeClass("show");
    });
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(
        getFakePost(null, activePage, rowsPerPage, sDate, eDate, "Fake"),
      );
    }, 100);
    return () => clearTimeout(timeout);
  }, [activePage, rowsPerPage, sDate, eDate]);

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
  }, [date]);
  // }, [date, post]);

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
      dispatch(getFakePost(null, page, limitNum, sDate, eDate, "Fake"));
    }
  }, [window.location.search, dispatch, sDate, eDate]);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    if (value !== "" && !isNaN(value) && value > 0) {
      setLimit(value);
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
      dispatch(
        getFakePost(
          null,
          1,
          rowsPerPage,
          sDate,
          eDate,
          "Fake",
          value,
        ),
      );
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

  // const getAllPost = () => {
  //   setActivePage(1);
  //   setsDate('ALL');
  //   seteDate('ALL');
  //   $('#datePicker').removeClass('show');
  //   dispatch(getFakePost(null, activePage, rowsPerPage, sDate, eDate, 'Fake'));
  // };

  // const collapsedDatePicker = () => {
  //   $('#datePicker').toggleClass('collapse');
  // };

  const handleOpen = () => {

    sessionStorage.removeItem("fakePost");
    navigate("/admin/post/dialog");
  };

  const handleEdit = (data) => {

    sessionStorage.setItem("fakePost", JSON.stringify(data));
    navigate("/admin/post/dialog");
  };

  const copyToClipboard = (Text) => {
    navigator.clipboard.writeText(Text);
    Toast("success", "Copied successfully!");
  };

  return (
    <>
      <div className="page-title">
        {props.type !== "fakePost" && (
          <div className="row">
            <div className="col-12 col-md-6 order-md-1 order-last">
              <h3 className="mb-3 text-white">Fake Social Post</h3>
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
                    Fake Post
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
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div className="d-flex align-items-center gap-2">
                {canCreate && (
                  <button
                    type="button"
                    className="edit-btn"
                    onClick={handleOpen}
                    id="bannerDialog"
                  >
                    <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> New
                  </button>
                )}
              </div>
              <div className="search-wrapper">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="search"
                  placeholder="Search by name, uniqueId or location"
                  className="search-input"
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            {/* Date picker */}
            <div
              id="datePicker"
              className="collapse mt-3"
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
                  {data.length > 0 ? (
                    data.map((data, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <img
                              className="mx-auto"
                              height="50px"
                              width="50px"
                              alt="app"
                              src={baseURL + data?.post}
                              style={{
                                border: "2px solid #1e2640",
                                borderRadius: 10,
                                objectFit: "cover",
                                display: "block",
                              }}
                            />
                          </td>
                          <td className="text-nowrap">
                            {data?.userId?.username}
                            <IconCopy
                              size={16}
                              className="ms-1"
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                copyToClipboard(data?.userId?.username)
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
                          <td className="text-nowrap">{data?.location}</td>
                          <td className="text-danger">{data?.like}</td>
                          <td className="text-success">{data?.comment}</td>
                          <td className="text-nowrap">{data.date}</td>
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
                                    JSON.stringify({
                                      ...data,
                                      currentPage: activePage,
                                      currentRowsPerPage: rowsPerPage,
                                    }),
                                  );
                                  navigate("/admin/post/detail");
                                }}
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
                                  className="edit-btn"
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
                                  className="delete-btn"
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
    </>
  );
};

export default connect(null, { getFakePost, deletePost, insertPost })(FakePost);
