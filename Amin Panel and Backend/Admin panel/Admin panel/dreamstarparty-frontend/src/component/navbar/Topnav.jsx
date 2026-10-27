import { MdNotificationsActive } from "react-icons/md";

// images
import Card1 from "../../assets/images/card.jpeg";

// routing
import { Link, useNavigate } from "react-router-dom";

// alert
import { logoutWarning, warning } from "../../util/Alert";

// jquery
import $ from "jquery";

// redux
import { useDispatch, useSelector } from "react-redux";

// types
import { UNSET_ADMIN } from "../../store/admin/types";

//serverpath
import { connect } from "react-redux";
import { baseURL } from "../../util/Config";

import { useEffect, useState } from "react";
import { getProfile } from "../../store/admin/action";

//modal
import { OPEN_NOTIFICATION_DIALOG } from "../../store/notification/types";
import NotificationDialog from "../dialog/NotificationDialog";

const Topnav = (props) => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const handleClose = () => setModalOpen(false);
  const loginType = sessionStorage.getItem("loginType");

  const dispatch = useDispatch();
  const admin = useSelector((state) => state.admin.admin);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  // initialize feather icons after every render so they don't disappear
  useEffect(() => {
    if (window.feather) {
      window.feather.replace();
    }
  });

  const handleDrawer = () => {
    $(".profile-drop-menu").toggleClass("show");
  };

  const closePopup = () => {
    $("body").removeClass("activity-sidebar-show");
  };

  const handleLogout = (e) => {
    e.preventDefault();
    const data = logoutWarning();
    data.then((isLogout) => {
      if (isLogout) {
        dispatch({ type: UNSET_ADMIN });
        navigate("/");
      }
    });
  };

  const handleOpen = () => {
    dispatch({ type: OPEN_NOTIFICATION_DIALOG });
  };

  return (
    <>
      <div className="page-header">
        <nav className="navbar navbar-expand-lg d-flex justify-content-between">
          <div className="header-title flex-fill">
            {/* ✅ Fix 1: added e.preventDefault() */}
            <a href="#" id="sidebar-toggle" onClick={(e) => e.preventDefault()}>
              <i data-feather="arrow-left"></i>
            </a>
          </div>

          <div className="d-flex align-items-center">
            {loginType === "staff" && (
              <div className="me-3">
                <span
                  style={{
                    background: "linear-gradient(135deg, #ff2d6b, #ff6b9d)",
                    color: "#fff",
                    padding: "5px 14px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: "600",
                    letterSpacing: "0.5px",
                    boxShadow: "0 2px 8px rgba(255, 45, 107, 0.4)",
                  }}
                >
                  Staff Login
                </span>
              </div>
            )}

            {loginType !== "staff" && (
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-8 float-left">
                <button
                  type="button"
                  className="btn waves-effect waves-light btn-danger btn-sm float-left"
                  onClick={handleOpen}
                >
                  <span className="icon_margin">
                    <MdNotificationsActive size={20} />
                  </span>
                </button>
              </div>
            )}

            <div className="flex-fill" id="headerNav">
              <ul className="navbar-nav">
                <li className="nav-item dropdown mb-2" onClick={handleDrawer}>
                  {/* ✅ Fix 2: was href={() => false} */}
                  <a
                    className="nav-link profile-dropdown"
                    href="#"
                    id="profileDropDown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      src={admin?.image ? baseURL + admin?.image : Card1}
                      alt="profile"
                      style={{ width: "30px", height: "30px" }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = Card1;
                      }}
                    />
                  </a>
                  <div
                    className="dropdown-menu dropdown-menu-end profile-drop-menu"
                    aria-labelledby="profileDropDown"
                    style={{ right: 0, left: "auto" }}
                  >
                    <Link
                      className="dropdown-item"
                      to="/admin/adminProfile"
                      onClick={handleDrawer}
                    >
                      <i data-feather="user"></i>Profile
                    </Link>

                    <div className="dropdown-divider"></div>
                    <Link
                      className="dropdown-item"
                      to="/admin/setting"
                      onClick={handleDrawer}
                    >
                      <i data-feather="settings"></i>Settings
                    </Link>

                    {/* ✅ Fix 3: was href={() => false} */}
                    <a
                      href="#"
                      className="dropdown-item"
                      onClick={handleLogout}
                    >
                      <i data-feather="log-out"></i>Logout
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <NotificationDialog />
      </div>

      <div className="activity-sidebar-overlay"></div>
    </>
  );
};

export default connect(null, { getProfile })(Topnav);
