import { Tooltip } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../../pages/Pagination";
import {
  deleteLanguage,
  downloadTranslation,
  getLanguage,
  toggleLanguage,
} from "../../store/Language/action";
import { warning } from "../../util/Alert";
import { baseURL } from "../../util/Config";
import LanguageDialog from "../dialog/LanaguageDialog";
import TranslationInfoDialog from "../dialog/TranslationInfoDialogue";
import UploadCSVDialogue from "../dialog/UploadCSVDialogue";
import { usePermission } from "../../context/PermissionProvider";

const LanguageIconDisplay = ({ item, baseURL }) => {
  const [error, setError] = useState(false);

  if (!item.languageIcon || error) {
    return <LanguageIcon />;
  }

  return (
    <img
      src={baseURL + item.languageIcon}
      alt="icon"
      style={{
        height: "130%",
        width: "130%",
        objectFit: "cover",
      }}
      onError={() => setError(true)}
    />
  );
};

const LanguageTable = () => {
  const dispatch = useDispatch();
  const { languages, total } = useSelector((state) => state.language);
  const { can } = usePermission();
  const canCreate = can("admin/language", "Create");
  const canEdit = can("admin/language", "Edit");
  const canDelete = can("admin/language", "Delete");

  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState(null);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [infoData, setInfoData] = useState(null);

  const [openUploadDialog, setOpenUploadDialog] = useState(false);

  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getLanguage({ start: activePage, limit: rowsPerPage }));
  }, [dispatch, activePage, rowsPerPage]);

  const searchTimeout = useRef(null);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      setActivePage(1);
      dispatch(
        getLanguage({ start: 1, limit: rowsPerPage, search: value.trim() }),
      );
    }, 1000);
  };

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
  };

  const handleDownload = () => {
    dispatch(downloadTranslation());
  };

  const handleDelete = (code) => {
    const confirm = warning();
    confirm
    .then((isDeleted) => {
      if (isDeleted) {
          dispatch(deleteLanguage(code));
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      {/* TITLE */}
      {/* TOP BAR */}
      {/* ── PAGE TITLE ── */}
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">App Language</h3>
          </div>
          <div className="col-12 col-md-6 order-md-2 order-first">
            <nav
              aria-label="breadcrumb"
              className="breadcrumb-header float-start float-lg-end"
            >
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/admin/dashboard" className="text-white">
                    Dashboard
                  </a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  App Language
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      {/* ── FILTER BAR ── */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="filter-bar">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              {/* Left — Action buttons */}
              <div className="d-flex align-items-center gap-2 flex-wrap">
                {canCreate && (
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setOpenDialog(true);
                    }}
                  >
                    <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Add
                    Language
                  </button>
                )}
                {canEdit && (
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setOpenUploadDialog(true);
                    }}
                  >
                    ⬆ Upload File
                  </button>
                )}
                {canEdit && (
                  <button className="edit-btn" onClick={handleDownload}>
                    ⬇ Download File
                  </button>
                )}
              </div>

              {/* Right — Search */}
              <div className="search-wrapper">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="search"
                  placeholder="Search by language title, code or localized title"
                  className="search-input"
                  value={search}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="row mt-4">
        <div className="col">
          <div className="table-card">
            {/* <div className="table-card-body"> */}
            <div style={{ overflowX: "auto", width: "100%" }}>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Icon</th>
                    <th>Title</th>
                    <th>Code</th>
                    <th>Localized Title</th>
                    {canEdit && <th>Active</th>}
                    {canEdit && <th>Default</th>}
                    <th>Errors</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {languages.length > 0 ? (
                    languages.map((item, index) => (
                      <tr key={item._id}>
                        <td>{(activePage - 1) * rowsPerPage + index + 1}</td>

                        {/* ICON */}
                        <td>
                          <div
                            style={{
                              height: 40,
                              width: 40,
                              borderRadius: "50%",
                              background: "#1e2640",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#fff",
                              fontWeight: "bold",
                              overflow: "hidden", // in case image overflow
                              border: "1px solid #1e2640",
                            }}
                          >
                            <LanguageIconDisplay item={item} baseURL={baseURL} />
                          </div>
                        </td>

                        <td>{item.languageTitle}</td>

                        <td>{item.languageCode || item.code}</td>

                        <td>
                          {item.localLanguageTitle || item.localizedTitle}
                        </td>

                        {/* ACTIVE SWITCH */}
                        {canEdit && (
                          <td>
                            <label className="switch">
                              <input
                                type="checkbox"
                                checked={item.isActive}
                                onChange={() => {
                                  dispatch(
                                    toggleLanguage(
                                      item.languageCode || item.code,
                                      1,
                                    ),
                                  );
                                }}
                              />
                              <span className="slider"></span>
                            </label>
                          </td>
                        )}

                        {/* DEFAULT */}
                        {canEdit && (
                          <td>
                            <label className="switch">
                              <input
                                type="checkbox"
                                checked={item.isDefault}
                                onChange={() => {
                                  dispatch(
                                    toggleLanguage(
                                      item.languageCode || item.code,
                                      2,
                                    ),
                                  );
                                }}
                              />
                              <span className="slider"></span>
                            </label>
                          </td>
                        )}

                        {/* ERRORS */}
                        <td>
                          <span className="badge bg-danger">{item.errors}</span>
                        </td>

                        {/* ACTION */}
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            {canEdit && (
                              <Tooltip title="Edit">
                                <button
                                  className="btn-sm edit-btn"
                                  onClick={() => {
                                    setEditData(item);
                                    setOpenDialog(true);
                                  }}
                                >
                                  <i className="fa fa-edit"></i>
                                </button>
                              </Tooltip>
                            )}

                            {canDelete && (
                              <Tooltip title="Delete">
                                <button
                                  className="btn-sm delete-btn"
                                  onClick={() => {
                                    const code = item.languageCode || item.code;
                                    handleDelete(code);
                                  }}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </Tooltip>
                            )}

                            {}
                            <Tooltip title="Info">
                              <button
                                style={{
                                  background: "#0f766e",
                                  color: "#99f6e4",
                                  border: "none",
                                }}
                                type="button"
                                className="btn-sm edit-btn"
                                onClick={() => {
                                  setInfoData(item);
                                  setOpenInfoDialog(true);
                                }}
                              >
                                <i className="fa fa-eye"></i>
                              </button>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" align="center">
                        No Languages Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <LanguageDialog
                open={openDialog}
                handleClose={() => {
                  setOpenDialog(false);
                  setEditData(null);
                }}
                editData={editData}
              />

              <TranslationInfoDialog
                open={openInfoDialog}
                handleClose={() => {
                  setOpenInfoDialog(false);
                  setInfoData(null);
                }}
                language={infoData}
              />

              <UploadCSVDialogue
                open={openUploadDialog}
                handleClose={() => setOpenUploadDialog(false)}
              />
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
    </>
  );
};

export default LanguageTable;
