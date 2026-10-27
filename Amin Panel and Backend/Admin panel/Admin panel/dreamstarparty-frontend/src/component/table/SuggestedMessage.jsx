import { useEffect, useState, useRef } from "react";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//action

//routing
import { Link } from "react-router-dom";
//MUI
import { Tooltip } from "@mui/material";
// type
import { OPEN_SG_DIALOG } from "../../store/suggestMessage/types";

// dialog

//sweet alert
import { usePermission } from "../../context/PermissionProvider";
import {
  deleteSuggestMsg,
  getSuggestedMsgs,
} from "../../store/suggestMessage/action";
import { alert, warning } from "../../util/Alert";
import SuggestMsgDialog from "../dialog/SuggestMsgDialog";
import dayjs from "dayjs";

const SuggestMessageTable = (props) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const { can } = usePermission();
  const canCreate = can("admin/suggestMessage", "Create");
  const canEdit = can("admin/suggestMessage", "Edit");
  const canDelete = can("admin/suggestMessage", "Delete");

  useEffect(() => {
    dispatch(getSuggestedMsgs());
  }, [dispatch]);

  const { suggestMessages } = useSelector((state) => state.suggestMessage);

  useEffect(() => {
    setData(suggestMessages);
  }, [suggestMessages]);

  const searchTimeout = useRef(null);

  const handleSearchChange = (e) => {
    const value = e.target.value.toUpperCase()
      ? e.target.value.trim().toUpperCase()
      : e.target.value.trim();

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      if (value) {
        const filteredData = suggestMessages.filter((data) => {
          return data?.message?.toUpperCase()?.indexOf(value) > -1;
        });
        setData(filteredData);
      } else {
        setData(suggestMessages);
      }
    }, 1000);
  };

  const handleDelete = (msgId) => {
    const data = warning();
    data
    .then((isDeleted) => {
      if (isDeleted) {
          props.deleteSuggestMsg(msgId);
          alert("Deleted!", `Suggested Message has been deleted!`, "success");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = (data) => {
    dispatch({ type: OPEN_SG_DIALOG, payload: data });
  };

  const handleOpen = () => {
    dispatch({ type: OPEN_SG_DIALOG });
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Suggested Message</h3>
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
                  Suggested Message
                </li>
              </ol>
            </nav>
          </div>
        </div>
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
                  placeholder="Search by message"
                  aria-describedby="button-addon4"
                  className="search-input"
                  onChange={handleSearchChange}
                />
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
                <thead className="text-white">
                  <tr>
                    <th>No.</th>
                    <th>Message</th>
                    <th>Created At</th>
                    {canEdit && <th>Edit</th>}
                    {canDelete && <th>Delete</th>}
                  </tr>
                </thead>
                <tbody className="text-center">
                  {data?.length > 0 ? (
                    data?.map((data, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{data.message}</td>
                          <td>{dayjs(data?.createdAt).format("DD-MM-YYYY")}</td>
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
                      <td colSpan="7" align="center">
                        Nothing to show!!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <SuggestMsgDialog />
    </>
  );
};

export default connect(null, {
  getSuggestedMsgs,
  deleteSuggestMsg,
})(SuggestMessageTable);
