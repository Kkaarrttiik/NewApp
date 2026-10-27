import React, { useEffect, useState } from "react";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//action
import { deleteGame, getGame, updateGameStatus } from "../../store/game/action";

//config

//routing
import { Link } from "react-router-dom";

//MUI
import { Tooltip } from "@mui/material";

// type

//sweet alert
import { usePermission } from "../../context/PermissionProvider";
import { alert, warning } from "../../util/Alert";

//image
import dayjs from "dayjs";
import noImage from "../../assets/images/noImage.png";
import { OPEN_GAME_DIALOG } from "../../store/game/types";
import { getSetting } from "../../store/setting/action";
import GameDialog from "../dialog/GameDialog";

const TablePaginationActions = React.lazy(() => import("./TablePagination"));

const GameTable = (props) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activePage, setActivePage] = useState(1);

  const settingId = useSelector((state) => state?.setting?.setting?._id);
  const { can } = usePermission();
  const canCreate = can("admin/game", "Create");
  const canEdit = can("admin/game", "Edit");
  const canDelete = can("admin/game", "Delete");

  useEffect(() => {
    dispatch(getGame());
  }, [dispatch]);

  const game = useSelector((state) => state.game.game);

  useEffect(() => {
    setData(game);
  }, [game]);

  useEffect(() => {
    dispatch(getSetting());
  }, [dispatch]);

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

  const handleOpen = () => {
    dispatch({ type: OPEN_GAME_DIALOG });
  };

  const handleDelete = (id) => {
    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
          props.deleteGame(settingId, id);
          alert("Deleted!", `Game has been deleted!`, "success");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleUpdateGameStatus = (id) => {
    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
          props.updateGameStatus(id);
          alert("Updated!", `Game status has been updated!`, "success");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = (data) => {
    dispatch({ type: OPEN_GAME_DIALOG, payload: data });
  };

  // const handleRowsPerPage = (value) => {
  //   setActivePage(1);
  //   setRowsPerPage(value);
  // };

  // const handlePageChange = (pageNumber) => {
  //   setActivePage(pageNumber);
  // };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Game</h3>
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
                  Game
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
                      <th>Name</th>
                      <th>Link</th>
                      <th className="text-nowrap">Min win Percent (%)</th>
                      <th className="text-nowrap">Max win Percent (%)</th>
                      {canEdit && <th>Active</th>}
                      <th className="text-nowrap">Created At</th>
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
                            <td>
                              <img
                                height="50px"
                                width="50px"
                                alt="app"
                                src={data.image ? data?.image : noImage}
                                style={{
                                  border: "2px solid #1e2640",
                                  borderRadius: 10,
                                  objectFit: "cover",
                                  display: "block",
                                }}
                              />
                            </td>
                            <td>{data?.name}</td>
                            <td>
                              <a
                                target="_blank"
                                href={data?.link}
                                style={{ color: "#6ea8fe" }}
                              >
                                {data?.link}
                              </a>
                            </td>
                            <td>{data?.minWinPercent + " %"}</td>
                            <td>{data?.maxWinPercent + " %"}</td>
                            {canEdit && (
                              <td>
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    checked={data.isActive}
                                    onChange={() =>
                                      handleUpdateGameStatus(data._id)
                                    }
                                  />
                                  <span className="slider"></span>
                                </label>
                              </td>
                            )}
                            <td>
                              {dayjs(data?.createdAt).format("DD MMM,YYYY")}
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
                        <td colSpan="7" align="center">
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
      <GameDialog />
    </>
  );
};

export default connect(null, { getGame, deleteGame, updateGameStatus })(
  GameTable,
);
