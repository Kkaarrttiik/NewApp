import { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  deleteAvatarFrame,
  getAvatarFrame,
} from "../../store/AvatarFrame/action";
// routing
import $ from "jquery";
import { Link } from "react-router-dom";
import noImage from "../../assets/images/noImage.png";
import { usePermission } from "../../context/PermissionProvider";
import { OPEN_DIALOGUE_AVATAR_FRAME } from "../../store/AvatarFrame/type";
import { alert, warning } from "../../util/Alert";
import { baseURL } from "../../util/Config";
import AvatarDialogue from "../dialog/AvatarDialogue";

const Avatar = (props) => {
  const { avatarFrame } = useSelector((state) => state.avatarFrame);
  const dispatch = useDispatch();
  const { can } = usePermission();
  const canCreate = can("admin/avatarFrame", "Create");
  const canEdit = can("admin/avatarFrame", "Edit");
  const canDelete = can("admin/avatarFrame", "Delete");

  const [data, setData] = useState([]);

  useEffect(() => {
    dispatch(getAvatarFrame("frame"));
  }, [dispatch]);

  useEffect(() => {
    setData(avatarFrame);
  }, [avatarFrame]);

  const handleSearch = (e) => {
    const value = e.target.value.toUpperCase()
      ? e.target.value.trim().toUpperCase()
      : e.target.value.trim();
    if (value) {
      const data = avatarFrame.filter((data) => {
        return (
          data?.diamond?.toString()?.indexOf(value) > -1 ||
          data?.name?.toUpperCase()?.indexOf(value) > -1
        );
      });
      setData(data);
    } else {
      return setData(avatarFrame);
    }
  };

  const handleDelete = (id) => {

    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
          props.deleteAvatarFrame(id);
          alert("Deleted!", `Avatar has been deleted!`, "success");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleOpen = () => {

    dispatch({ type: OPEN_DIALOGUE_AVATAR_FRAME });
  };

  const handleEdit = (data) => {

    dispatch({ type: OPEN_DIALOGUE_AVATAR_FRAME, payload: data });
  };

  // set default image

  $(document).ready(function () {
    $("img").bind("error", function () {
      // Set the default image
      $(this).attr("src", noImage);
    });
  });

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Avatar</h3>
          </div>
          <div className="col-12 col-md-6 order-md-2 order-first">
            <nav
              aria-label="breadcrumb"
              className="breadcrumb-header float-start float-lg-end"
            >
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/admin/dashboard" className="text-danger">
                    Dashboard
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Avatar
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
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
                      id="bannerDialog"
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
            data.map((data, index) => {
              return (
                <>
                  <div className="col-12 col-md-6 col-lg-4 mb-4" key={index}>
                    <div
                      style={{
                        boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(255,77,141,0.3)";
                        e.currentTarget.style.boxShadow = `0 10px 30px rgba(255,77,141,0.25)`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#1F2937";
                        e.currentTarget.style.boxShadow =
                          "0 10px 25px rgba(0,0,0,0.4)";
                      }}
                      className="card card-bg contact-card h-100 card-bg"
                    >
                      <div className="card-body">
                        <div className="d-flex flex-column align-items-center gap-3 text-center">
                          <div className="flex-shrink-0 position-relative">
                            <img
                              src={
                                data?.image ? baseURL + data?.image : noImage
                              }
                              style={{
                                width: "150px",
                                height: "150px",
                                objectFit: "cover",
                                borderRadius: "10px",
                              }}
                              alt=""
                            />
                          </div>
                          <div className="flex-grow-1 w-100">
                            <h4 className="text-white mb-2">{data?.name}</h4>
                            <div className="mb-1 d-flex justify-content-center gap-1">
                              <h4 className="text-white">
                                Diamonds: {data?.diamond}
                              </h4>
                            </div>
                            <div className="mb-1 d-flex justify-content-center gap-1">
                              <h4 className="text-white">
                                Validity:{" "}
                                {data?.validity + " " + data?.validityType}
                              </h4>
                            </div>

                            <div className="d-flex justify-content-center gap-2 mt-3">
                              {canEdit && (
                                <button
                                  type="button"
                                  className="btn-sm edit-btn"
                                  onClick={() => handleEdit(data)}
                                >
                                  <i className="fa fa-edit fa-lg"></i>
                                </button>
                              )}
                              {canDelete && (
                                <button
                                  type="button"
                                  className="btn-sm delete-btn"
                                  onClick={() => handleDelete(data?._id)}
                                >
                                  <i className="fas fa-trash-alt fa-lg"></i>
                                </button>
                              )}
                            </div>
                          </div>
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

      <AvatarDialogue />
    </>
  );
};

export default connect(null, { getAvatarFrame, deleteAvatarFrame })(Avatar);
