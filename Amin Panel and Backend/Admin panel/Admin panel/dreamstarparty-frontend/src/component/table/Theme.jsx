import { useEffect, useState } from "react";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//action
import {
  deleteTheme,
  getTheme,
  isDefault,
} from "../../store/Theme/theme.action";

//config

//routing
import { Link } from "react-router-dom";

//MUI
// import { TablePagination, Tooltip } from "@mui/material";

// type
import { Tooltip } from "@mui/material";
import { usePermission } from "../../context/PermissionProvider";
import { OPEN_THEME_DIALOG } from "../../store/Theme/theme.type";
import { alert, warning } from "../../util/Alert";
// dialog
import ThemeDialog from "../../component/dialog/ThemeDialog";


//image
import dayjs from "dayjs";
import noImage from "../../assets/images/noImage.png";
import { baseURL } from "../../util/Config";

const ThemeTable = (props) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activePage, setActivePage] = useState(1);

  const { can } = usePermission();
  const canCreate = can("admin/theme", "Create");
  const canEdit = can("admin/theme", "Edit");
  const canDelete = can("admin/theme", "Delete");

  useEffect(() => {
    dispatch(getTheme());
  }, [dispatch]);

  const theme = useSelector((state) => state.theme.theme);

  useEffect(() => {
    setData(theme);
  }, [theme]);

  // const handlePageChange = (pageNumber) => {
  //   setActivePage(pageNumber);
  //   setPage(pageNumber);
  // };

  // const handleRowsPerPage = (value) => {
  //   setActivePage(1);
  //   setRowsPerPage(value);
  // };

  const handleOpen = () => {

    dispatch({ type: OPEN_THEME_DIALOG });
  };

  const handleDelete = (id) => {

    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
          props.deleteTheme(id);
          alert("Deleted!", `Theme has been deleted!`, "success");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleIsDefault = (id) => {
    props.isDefault(id);
  };

  const handleEdit = (data) => {

    dispatch({ type: OPEN_THEME_DIALOG, payload: data });
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Theme</h3>
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
                  Theme
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      {/* ── FILTER BAR ── */}
      {canCreate && (
        <div className="row mb-3">
          <div className="col-12">
            <div className="filter-bar">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div className="d-flex align-items-center gap-2">
                  <button
                    type="button"
                    className="edit-btn"
                    onClick={handleOpen}
                    id="StickerDialog"
                  >
                    <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> New
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                    <th>Image</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                    {canEdit && <th>isDefault</th>}
                    {canEdit && <th>Edit</th>}
                    {canDelete && <th>Delete</th>}
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data?.map((data, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td className="d-flex justify-content-center">
                            <img
                              height="50px"
                              width="50px"
                              alt="app"
                              src={data.theme ? baseURL + data.theme : noImage}
                              style={{
                                border: "2px solid #1e2640",
                                borderRadius: 10,
                                objectFit: "cover",
                                display: "block",
                              }}
                            />
                          </td>
                          <td>{dayjs(data.createdAt).format("DD MMM,YYYY")}</td>
                          <td>{dayjs(data.updatedAt).format("DD MMM,YYYY")}</td>
                          {canEdit && (
                            <td>
                              <label className="switch">
                                <input
                                  type="checkbox"
                                  checked={data.isDefault}
                                  onChange={() => {
                                    handleIsDefault(data._id);
                                  }}
                                />
                                <span className="slider"></span>
                              </label>
                            </td>
                          )}
                          {canEdit && (
                            <td>
                              <Tooltip title="Edit">
                                <button
                                  type="button"
                                  className="btn-sm edit-btn"
                                  onClick={() => handleEdit(data)}
                                >
                                  <i className="fa fa-edit fa-lg"></i>
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
                                  <i className="fas fa-trash-alt fa-lg"></i>
                                </button>
                              </Tooltip>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" align="center">
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
      <ThemeDialog />
    </>
  );
};

export default connect(null, { getTheme, deleteTheme, isDefault })(ThemeTable);
