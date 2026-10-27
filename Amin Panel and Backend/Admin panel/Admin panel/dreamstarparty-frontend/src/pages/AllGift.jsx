//redux
import { connect, useDispatch, useSelector } from "react-redux";

//serverpath
import { baseURL } from "../util/Config";

//sweet alert
import { alert, permissionError, warning } from "../util/Alert";

//action
import { deleteGift } from "../store/gift/action";

// type
import { OPEN_GIFT_DIALOG } from "../store/gift/types";

//routing
import { useNavigate } from "react-router-dom";

//image
import noImage from "../assets/images/noImage.png";

import { usePermission } from "../context/PermissionProvider";

const AllGift = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { can } = usePermission();
  const canCreate = can("admin/gift", "Create");
  const canEdit = can("admin/gift", "Edit");
  const canDelete = can("admin/gift", "Delete");

  const handleDelete = (giftId) => {
    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
          props.deleteGift(giftId);
          alert("Deleted!", `Gift has been deleted!`, "success");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = (data) => {
    dispatch({ type: OPEN_GIFT_DIALOG, payload: data });
  };
  return (
    <>
      {props?.data?.gift?.length > 0 ? (
        props?.data?.gift?.map((data, index) => {
          return (
            <>
              <div
                className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4"
                key={index}
                onClick={() => {
                  sessionStorage.setItem("CategoryId", data._id);
                  // navigate("/admin/giftCategory/gift");
                }}
              >
                <div className="card contact-card card-bg pointer-cursor">
                  <div className="card-body text-center p-4">
                    {data?.type === 2 ? (
                      <img
                        src={
                          data?.svgaImage
                            ? baseURL + data?.svgaImage
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
                    ) : (
                      <img
                        src={data?.image ? baseURL + data?.image : noImage}
                        style={{
                          width: "120px",
                          height: "120px",
                          objectFit: "cover",
                        }}
                        alt=""
                        className="mx-auto mb-3"
                      />
                    )}
                    <h4 className="text-white font-weight-bold mb-4">Coin: {data?.coin}</h4>
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
                          onClick={(e) => { e.stopPropagation(); handleDelete(data?._id); }}
                        >
                          <i className="fas fa-trash"></i>
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
    </>
  );
};

export default connect(null, { deleteGift })(AllGift);
