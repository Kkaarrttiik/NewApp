import { useEffect, useState } from "react";
//redux
import { connect, useDispatch, useSelector } from "react-redux";
//action
import { deleteGift, getGift } from "../../store/gift/action";

//config
import { baseURL } from "../../util/Config";
//routing
import { Link, useNavigate } from "react-router-dom";
// type
import { OPEN_SVGA_DIALOG } from "../../store/gift/types";
// dialog
import GiftDialog from "../dialog/Gift/Edit";
//sweet alert
import { usePermission } from "../../context/PermissionProvider";
import { warning } from "../../util/Alert";

//all gift
import AllGift from "../../pages/AllGift";

//image
import noImage from "../../assets/images/noImage.png";

import SVGA from "svgaplayerweb";
import AddSvgaDialogue from "../dialog/AddSvgaDialogue";

const GiftTable = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [data, setData] = useState([]);

  const category = JSON.parse(sessionStorage.getItem("Category"));

  const GiftClick = sessionStorage.getItem("GiftClick");

  useEffect(() => {
    GiftClick === null
      ? dispatch(getGift(category._id))
      : dispatch(getGift("ALL"));
  }, [GiftClick]);

  const gift = useSelector((state) => state.gift.gift);

  const { can } = usePermission();
  const canCreate = can("admin/gift", "Create");
  const canEdit = can("admin/gift", "Edit");
  const canDelete = can("admin/gift", "Delete");

  useEffect(() => {
    setData(gift);
  }, [gift]);

  useEffect(() => {
    data?.map((admissionSVGA, index) => {
      if (admissionSVGA.image.split(".").pop() === "svga") {
        const player = new SVGA.Player(`div[attr="${index}"]`);
        const parser = new SVGA.Parser();

        parser.load(baseURL + admissionSVGA.image, (videoItem) => {
          player.setVideoItem(videoItem);
          player.startAnimation();
        });
      }
    });
  }, [data]);

  const handleSearch = (e) => {
    const value = e.target.value.toUpperCase()
      ? e.target.value.trim().toUpperCase()
      : e.target.value.trim();
    if (value) {
      const data = gift.filter((data) => {
        return (
          data?.coin?.toString()?.indexOf(value) > -1 ||
          data?.category?.name?.toUpperCase()?.indexOf(value) > -1
        );
      });
      setData(data);
    } else {
      return setData(gift);
    }
  };

  const handleDelete = (giftId) => {

    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
          props.deleteGift(giftId);
          // alert("Deleted!", `Gift has been deleted!`, "success");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = (data) => {
    dispatch({ type: OPEN_SVGA_DIALOG, payload: data });
  };

  const handleOpen = () => {
    dispatch({ type: OPEN_SVGA_DIALOG });
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">
              {GiftClick === null && category.name} Gifts
            </h3>
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
                <li className="breadcrumb-item">
                  <Link to="/admin/giftCategory" className="text-white">
                    Category
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Gift
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      {/* ── FILTER BAR ── */}
      {canCreate && (
        <div className="row">
          <div className="col-12">
            <div className="filter-bar">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div className="d-flex align-items-center gap-2">
                  <div>
                    <button
                      className="edit-btn dropdown-toggle"
                      type="button"
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      New
                    </button>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton1"
                      style={{
                        backgroundColor: "#131929",
                        marginTop: "10px",
                        border: "1px solid #1e2640",
                      }}
                    >
                      <li>
                        <a
                          className="dropdown-item"
                          style={{ color: "#c8cfe0", cursor: "pointer" }}
                          onClick={handleOpen}
                        >
                          SVGA
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          style={{ color: "#c8cfe0", cursor: "pointer" }}
                          onClick={() => {
                            GiftClick === null
                              ? navigate("/admin/giftCategory/gift/dialog")
                              : navigate("/admin/gift/dialog");
                          }}
                        >
                          Image, GIF
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── GIFT CARDS ── */}
      <div className="row">
        {data.length > 0 ? (
          data.map((data, index) => {
            return (
              <>
                {GiftClick === null ? (
                  <div
                    className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3"
                    key={index}
                  >
                    <div className="card contact-card card-bg pointer-cursor">
                      <div className="card-body text-center p-4">
                        {data.image.split(".").pop() !== "svga" ? (
                          <img
                            src={data.image ? baseURL + data.image : noImage}
                            style={{
                              width: "120px",
                              height: "120px",
                              objectFit: "cover",
                            }}
                            alt=""
                            className="rounded-circle mx-auto mb-3 shadow"
                          />
                        ) : (
                          <div
                            id="svga"
                            attr={index}
                            style={{
                              width: "120px",
                              height: "120px",
                              objectFit: "contain",
                            }}
                            className="rounded-circle mx-auto mb-3 shadow"
                          ></div>
                        )}
                        <h4 className="text-white font-weight-bold mb-4">Coin: {data.coin}</h4>
                        {GiftClick !== null && (
                          <h6 className="mb-3">{data.category?.name}</h6>
                        )}
                        <div className="d-flex gap-3 justify-content-center">
                          {canEdit && (
                            <button
                              type="button"
                              className="btn-circle edit-btn"
                              onClick={(e) => { e.stopPropagation(); handleEdit(data); }}
                            >
                              <i className="fa fa-edit"></i>
                            </button>
                          )}
                          {canDelete && (
                            <button
                              type="button"
                              className="btn-circle delete-btn"
                              onClick={(e) => { e.stopPropagation(); handleDelete(data._id); }}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="row order-md-1 order-last mt-4">
                      <h3 className="mb-3 text-white">{data.name} Gifts</h3>
                      <AllGift data={data} />
                    </div>
                  </>
                )}
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

      <GiftDialog />
      <AddSvgaDialogue />
    </>
  );
};

export default connect(null, { getGift, deleteGift })(GiftTable);
