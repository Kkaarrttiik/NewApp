import { useEffect, useState } from "react";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//action
import { deleteCategory, getCategory } from "../../store/giftCategory/action";

//config
import { baseURL } from "../../util/Config";
//routing
import { Link, useNavigate } from "react-router-dom";
// type
import { OPEN_CATEGORY_DIALOG } from "../../store/giftCategory/types";
// dialog
import GiftCategoryDialog from "../dialog/GiftCategory";
//sweet alerte
import { alert, warning } from "../../util/Alert";

//image
import noImage from "../../assets/images/noImage.png";
import { usePermission } from "../../context/PermissionProvider";
import { Tooltip } from "@mui/material";

import Pagination from "../../pages/Pagination";

const GiftCategoryTable = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activePage, setActivePage] = useState(1);

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  const giftCategory = useSelector((state) => state.giftCategory.giftCategory);

  const { can } = usePermission();
  const canCreate = can("admin/giftCategory", "Create");
  const canEdit = can("admin/giftCategory", "Edit");
  const canDelete = can("admin/giftCategory", "Delete");

  useEffect(() => {
    setData(giftCategory);
  }, [giftCategory]);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
  };

  const handleSearch = (e) => {
    const value = e.target.value.trim().toUpperCase();
    if (value) {
      const data = giftCategory.filter((data) => {
        return (
          data?.name?.toUpperCase()?.indexOf(value) > -1 ||
          data?.giftCount?.toString()?.indexOf(value) > -1
        );
      });
      setData(data);
    } else {
      return setData(giftCategory);
    }
  };

  const handleOpen = () => {

    dispatch({ type: OPEN_CATEGORY_DIALOG });
  };

  const handleDelete = (categoryId) => {

    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
          props.deleteCategory(categoryId);
          alert("Deleted!", `Category has been deleted!`, "success");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = (data) => {

    dispatch({ type: OPEN_CATEGORY_DIALOG, payload: data });
  };

  const openGifts = (data) => {

    sessionStorage.setItem("Category", JSON.stringify(data));
    navigate("/admin/giftCategory/gift");
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Category</h3>
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
                  Category
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <div className="main-wrapper">
        {/* ── FILTER BAR ── */}
        <div className="row mb-4">
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
                    placeholder="Search by name"
                    className="search-input"
                    onChange={handleSearch}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col">
            <div className="table-card">
              <div style={{ overflowX: "auto", width: "100%" }}>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Gifts</th>
                      {canEdit && <th>Edit</th>}
                      {canDelete && <th>Delete</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {data.length > 0 ? (
                      data
                        .slice(
                          (activePage - 1) * rowsPerPage,
                          activePage * rowsPerPage,
                        )
                        .map((data, index) => {
                          return (
                            <tr key={index}>
                              <td>
                                {(activePage - 1) * rowsPerPage + index + 1}
                              </td>
                              <td>
                                <img
                                  src={
                                    data.image ? baseURL + data.image : noImage
                                  }
                                  width="50"
                                  height="50"
                                  className="rounded-circle"
                                  alt=""
                                  onClick={() => openGifts(data)}
                                  style={{
                                    objectFit: "cover",
                                    cursor: "pointer",
                                  }}
                                />
                              </td>
                              <td
                                onClick={() => openGifts(data)}
                                style={{ cursor: "pointer" }}
                              >
                                {data.name}
                              </td>
                              <td>
                                {data.giftCount ? data.giftCount : "0"} Gifts
                              </td>
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
              <div className="px-5">
                <Pagination
                  activePage={activePage}
                  rowsPerPage={rowsPerPage}
                  userTotal={data.length}
                  handleRowsPerPage={handleRowsPerPage}
                  handlePageChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <GiftCategoryDialog />
    </>
  );
};

export default connect(null, { getCategory, deleteCategory })(
  GiftCategoryTable,
);
