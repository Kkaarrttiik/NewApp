import React, { useEffect, useState } from "react";

// redux
import { connect, useDispatch, useSelector } from "react-redux";

// actions (mirrors banner but for broadcastgame)
import {
  deleteBroadcastGame,
  getBroadcastGame,
  handleVIPSwitchBroadcastGame,
} from "../../store/BroadcastGame/action";

// config
import { baseURL } from "../../util/Config";

// routing
import { Link } from "react-router-dom";

// MUI
import { Tooltip } from "@mui/material";

// types (mirrors banner but for broadcastgame)
import { OPEN_BROADCASTGAME_DIALOG } from "../../store/BroadcastGame/types";

// dialog (mirrors banner but for broadcastgame)
import BroadcastGameDialog from "../dialog/BroadcastGameDialogue";

// sweet alert helpers
import { alert, warning } from "../../util/Alert";

import $ from "jquery";

// image fallback
import noImage from "../../assets/images/noImage.png";
import { usePermission } from "../../context/PermissionProvider";

const TablePaginationActions = React.lazy(() => import("./TablePagination"));

const BroadcastGameTable = (props) => {
  const dispatch = useDispatch();

  const { can } = usePermission();
  const canCreate = can("admin/broadcastgame", "Create");
  const canEdit = can("admin/broadcastgame", "Edit");
  const canDelete = can("admin/broadcastgame", "Delete");

  const [data, setData] = useState([]);

  useEffect(() => {
    dispatch(getBroadcastGame());
  }, [dispatch]);

  const broadcastgame = useSelector(
    (state) => state.broadcastgame.broadcastgame,
  );

  useEffect(() => {
    setData(broadcastgame);
  }, [broadcastgame]);

  $(document).ready(function () {
    $("img").bind("error", function () {
      $(this).attr("src", noImage);
    });
  });

  const handleSearch = (e) => {
    const value = e.target.value.trim().toUpperCase();
    if (value) {
      const filtered = broadcastgame.filter((row) => {
        return row?.URL?.toUpperCase()?.indexOf(value) > -1;
      });
      setData(filtered);
    } else {
      setData(broadcastgame);
    }
  };
  const handleIsTop = (id) => {
    dispatch(handleVIPSwitchBroadcastGame(id));
  };

  const handleOpen = () => {
    dispatch({ type: OPEN_BROADCASTGAME_DIALOG });
  };

  const handleDelete = (id) => {
    const ask = warning();
    ask
    .then((isDeleted) => {
      if (isDeleted) {
          props.deleteBroadcastGame(id);
          alert("Deleted!", "Broadcast game has been deleted!", "success");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = (row) => {
    dispatch({ type: OPEN_BROADCASTGAME_DIALOG, payload: row });
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Broadcast Game</h3>
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
                  Broadcast Game
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
                    id="broadcastGameDialog"
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
                    <th>URL</th>
                    {canEdit && <th>Is Active</th>}
                    {(canEdit || canDelete) && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {data?.length > 0 ? (
                    data.map((row, index) => (
                      <tr key={row?._id || index}>
                        <td>{index + 1}</td>
                        <td className="d-flex justify-content-center">
                          <img
                            height="100px"
                            width="100px"
                            alt="broadcastgame"
                            src={
                              row?.imageUrl ? baseURL + row?.imageUrl : noImage
                            }
                            style={{
                              border: "2px solid #1e2640",
                              borderRadius: 10,
                              display: "block",
                              objectFit: "cover",
                            }}
                          />
                        </td>
                        <td>
                          <a
                            target="_blank"
                            href={row?.redirectUrl ? row?.redirectUrl : "#"}
                            style={{ color: "#6ea8fe" }}
                          >
                            {row?.redirectUrl ? row?.redirectUrl : "-"}
                          </a>
                        </td>

                        {canEdit && (
                          <td>
                            <label className="switch">
                              <input
                                type="checkbox"
                                checked={row?.isActive}
                                onChange={() => handleIsTop(row?._id)}
                              />
                              <span className="slider"></span>
                            </label>
                          </td>
                        )}
                        {(canEdit || canDelete) && (
                          <td>
                            <div className="d-flex align-items-center justify-content-center gap-2">
                              {canEdit && (
                                <Tooltip title="Edit">
                                  <button
                                    type="button"
                                    className="btn-sm edit-btn"
                                    onClick={() => handleEdit(row)}
                                  >
                                    <i className="fa fa-edit fa-lg"></i>
                                  </button>
                                </Tooltip>
                              )}
                              {canDelete && (
                                <Tooltip title="Delete">
                                  <button
                                    type="button"
                                    className="btn-sm delete-btn"
                                    onClick={() => handleDelete(row?._id)}
                                  >
                                    <i className="fas fa-trash-alt fa-lg"></i>
                                  </button>
                                </Tooltip>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" align="center">
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

      <BroadcastGameDialog />
    </>
  );
};

export default connect(null, { getBroadcastGame, deleteBroadcastGame })(
  BroadcastGameTable,
);
