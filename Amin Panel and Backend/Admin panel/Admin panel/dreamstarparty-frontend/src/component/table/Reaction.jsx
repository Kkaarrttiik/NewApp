/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from "react";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//action
import { deleteReaction, getReaction } from "../../store/reaction/action";

//config
//routing
import { Link, useNavigate } from "react-router-dom";

import { usePermission } from "../../context/PermissionProvider";
import { warning } from "../../util/Alert";

//image
import noImage from "../../assets/images/noImage.png";

import { OPEN_REACTION_DIALOG } from "../../store/reaction/type";
import ReactionDialog from "../dialog/ReactionDialog";

const ReactionTable = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [data, setData] = useState([]);

  useEffect(() => {
    dispatch(getReaction());
  }, [dispatch]);

  const { reaction } = useSelector((state) => state.reaction);
  const { can } = usePermission();
  const canCreate = can("admin/reaction", "Create");
  const canEdit = can("admin/reaction", "Edit");
  const canDelete = can("admin/reaction", "Delete");

  useEffect(() => {
    setData(reaction);
  }, [reaction]);

  const handleDelete = (reactionId) => {
    
    const data = warning();
    data
    .then((isDeleted) => {
      if (isDeleted) {
          props.deleteReaction(reactionId);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = (data) => {
    dispatch({ type: OPEN_REACTION_DIALOG, payload: data });
  };

  const handleOpen = () => {

    dispatch({ type: OPEN_REACTION_DIALOG });
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Reactions</h3>
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
                  Reaction
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      {/* ── FILTER BAR ── */}

      <div className="main-wrapper">
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
                    >
                      <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> New
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="row">
          {data?.length > 0 ? (
            data?.map((data, index) => {
              return (
                <>
                  <div
                    className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3"
                    key={index}
                  >
                    <div className="card contact-card card-bg pointer-cursor">
                      <div className="card-body text-center p-4">
                        <img
                          src={
                            !data?.image.includes("\\") || data.image === ""
                              ? data?.image
                              : noImage
                          }
                          style={{
                            width: "120px",
                            height: "120px",
                            objectFit: "cover",
                          }}
                          alt=""
                          className="mx-auto mb-3"
                        />
                        <h4 className="text-white font-weight-bold mb-4 text-capitalize">{data?.name}</h4>
                        <div className="d-flex gap-3 justify-content-center">
                          {canEdit && (
                            <button
                              type="button"
                              className="btn-circle edit-btn"
                              onClick={(e) => { e.stopPropagation(); handleEdit(data); }}
                            >
                              <i className="fa fa-edit fa-lg"></i>
                            </button>
                          )}
                          {canDelete && (
                            <button
                              type="button"
                              className="btn-circle delete-btn"
                              onClick={(e) => { e.stopPropagation(); handleDelete(data._id); }}
                            >
                              <i className="fas fa-trash fa-lg"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" align="center">
                Nothing to show!!
              </td>
            </tr>
          )}
        </div>
      </div>
      <ReactionDialog />
    </>
  );
};

export default connect(null, { getReaction, deleteReaction })(ReactionTable);
