import { useEffect, useState, useRef } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import $ from "jquery";
import SVGA from "svgaplayerweb";
import noImage from "../../assets/images/noImage.png";
import { usePermission } from "../../context/PermissionProvider";
import {
  deleteAdmissionSVGA,
  getAdmissionSVGA,
} from "../../store/AdmissionCar/action";
import { OPEN_DIALOGUE_ADMISSION_CAR } from "../../store/AdmissionCar/type";
import { warning } from "../../util/Alert";
import { baseURL } from "../../util/Config";
import AdmissionCarDialogue from "../dialog/AdmissionCarDialogue";

import { Cancel } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";

const AdmissionCar = (props) => {
  const dispatch = useDispatch();

  const { admissionSVGA } = useSelector((state) => state.admissionSVGA);
  const { can } = usePermission();
  const canCreate = can("admin/entryEffect", "Create");
  const canEdit = can("admin/entryEffect", "Edit");
  const canDelete = can("admin/entryEffect", "Delete");

  const [data, setData] = useState([]);

  useEffect(() => {
    dispatch(getAdmissionSVGA("svga"));
  }, [dispatch]);

  useEffect(() => {
    setData(admissionSVGA);
  }, [admissionSVGA]);

  const searchTimeout = useRef(null);

  const handleSearch = (e) => {
    const value = e.target.value.toUpperCase()
      ? e.target.value.trim().toUpperCase()
      : e.target.value.trim();

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      if (value) {
        const filteredData = admissionSVGA.filter((item) => {
          return (
            item?.name?.toUpperCase()?.indexOf(value) > -1
          );
        });
        setData(filteredData);
      } else {
        setData(admissionSVGA);
      }
    }, 1000);
  };

  const handleOpen = () => {
    dispatch({
      type: OPEN_DIALOGUE_ADMISSION_CAR,
      payload: { data: null, type: "open" },
    });
  };

  const handleEdit = (data) => {

    dispatch({
      type: OPEN_DIALOGUE_ADMISSION_CAR,
      payload: { data: data, type: "edit" },
    });
  };

  const handleDelete = (id) => {
    
    const data = warning();
    data
    .then((isDeleted) => {
      if (isDeleted) {
          props.deleteAdmissionSVGA(id);
        }
      })
      .catch((err) => console.log(err));
  };

  // set default image

  $(document).ready(function () {
    $("img").bind("error", function () {
      // Set the default image
      $(this).attr("src", `${baseURL}storage/male.png`);
    });
  });

  return (
    <div style={{ overflowY: "hidden", overflowX: "hidden" }}>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Entry Effect</h3>
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
                  Admission Car
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      {/* ── SEARCH/ACTION BAR ── */}
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
                    id="bannerDialog"
                    onClick={handleOpen}
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
                  placeholder="Search by name"
                  aria-describedby="button-addon4"
                  className="search-input"
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CARDS GRID ── */}
      <div className="row mt-4">
        {data?.length > 0 ? (
          data.map((data, index) => {
            const isImageSvga = data?.image?.split(".").pop() === "svga";
            const isImageVideoSvga = data?.imageVideo?.split(".").pop() === "svga";
            const hasSvga = isImageSvga || isImageVideoSvga;

            return (
              <div className="col-12 col-md-6 col-lg-4 mb-4" key={index}>
                <div
                  style={{
                    boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,77,141,0.3)";
                    e.currentTarget.style.boxShadow = `0 10px 30px rgba(255,77,141,0.25)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#1F2937";
                    e.currentTarget.style.boxShadow =
                      "0 10px 25px rgba(0,0,0,0.4)";
                  }}
                  className="card contact-card h-100 card-bg"
                >
                  <div className="card-body">
                    <div className="d-flex flex-column align-items-center gap-3 text-center">
                      <div className="flex-shrink-0 position-relative">
                        {!isImageSvga ? (
                          <div className="position-relative">
                            <img
                              src={data.image ? baseURL + data.image : noImage}
                              style={{
                                width: "150px",
                                height: "250px",
                                objectFit: "cover",
                                borderRadius: "10px",
                              }}
                              alt=""
                            />
                          </div>
                        ) : (
                          <div className="position-relative">
                            <img
                              src={data.thumbnail ? baseURL + data.thumbnail : (data.imageVideo ? baseURL + data.imageVideo : noImage)}
                              style={{
                                width: "150px",
                                height: "150px",
                                objectFit: "cover",
                                borderRadius: "10px",
                              }}
                              alt=""
                            />
                          </div>
                        )}
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
                              className="edit-btn btn-circle m-b-xs"
                              onClick={() => handleEdit(data)}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                          )}
                          {canDelete && (
                            <button
                              type="button"
                              className="btn-circle delete-btn m-b-xs"
                              onClick={() => handleDelete(data?._id)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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



      <AdmissionCarDialogue />
    </div>
  );
};

export default connect(null, { getAdmissionSVGA, deleteAdmissionSVGA })(
  AdmissionCar,
);
