import React, { useEffect, useCallback } from "react";

// routing
import { NavLink as Link, useLocation } from "react-router-dom";

// alert
import { logoutWarning, warning } from "../../util/Alert";

// redux
import { useDispatch } from "react-redux";

// types
import { UNSET_ADMIN } from "../../store/admin/types";

//MUI

// jquery
import $ from "jquery";
import { useNavigate } from "react-router-dom";
import { usePermission } from "../../context/PermissionProvider";
import { projectName } from "../../util/Config";
import { adminNavbarConfig } from "../../util/constants";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { canSee } = usePermission();
  const location = useLocation();

  // Function to close sidebar on mobile
  // Function to close sidebar on mobile
  const closeSidebar = useCallback(() => {
    if (window.innerWidth <= 1350) {
      // Unlock body scroll
      document.body.style.overflow = "";

      // Temporarily disable transitions to prevent layout shift glitches
      const sidebar = document.querySelector(".page-sidebar");
      const content = document.querySelector(".page-content");
      const header = document.querySelector(".page-header");
      const elements = [sidebar, content, header].filter(Boolean);

      elements.forEach((el) => {
        el.style.transition = "none";
      });

      document.body.classList.remove("sidebar-hidden");

      // Scroll to top after a short delay to ensure navigation completes first
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);

      void document.body.offsetHeight; // Force reflow

      requestAnimationFrame(() => {
        elements.forEach((el) => {
          el.style.transition = "";
        });
      });
    }
  }, []);

  // Automatically close sidebar when the route changes
  useEffect(() => {
    closeSidebar();
  }, [location, closeSidebar]);

  // Handle body scroll lock on mobile when sidebar is toggled
  useEffect(() => {
    const handleScrollLock = () => {
      if (window.innerWidth <= 1350) {
        if (document.body.classList.contains("sidebar-hidden")) {
          document.body.style.overflow = "hidden";
        } else {
          document.body.style.overflow = "";
        }
      }
    };

    // Initial check
    handleScrollLock();

    // Listen for clicks on the toggle button (since it's handled by jQuery outside React)
    const toggleBtn = document.getElementById("sidebar-toggle");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        // Delay slightly to wait for jQuery to toggle the class
        setTimeout(handleScrollLock, 50);
      });
    }

    return () => {
      document.body.style.overflow = "";
      if (toggleBtn) {
        toggleBtn.removeEventListener("click", handleScrollLock);
      }
    };
  }, [location]);

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

  const getActivePath = () => {
    const isSubPage =
      location.pathname === "/admin/user/history" ||
      location.pathname === "/admin/user/detail";

    if (isSubPage) {
      const storedUser = JSON.parse(sessionStorage.getItem("user") || "{}");
      return storedUser?.source === "fakeUser"
        ? "/admin/fakeUser"
        : "/admin/user";
    }
    return null;
  };

  const activePath = getActivePath();

  useEffect(() => {
    $("").addClass("submenu-margin");
  }, []);

  return (
    <>
      <div 
        className="page-sidebar" 
        // style={{ 
        //   overflowY: "auto", 
        //   maxHeight: "100vh",
        //   position: "fixed",
        //   top: 0,
        //   left: 0
        // }}
      >
        <Link to="/admin/dashboard">
          <span className="logo text-danger text-capitalize">
            {projectName}
          </span>
        </Link>
        <ul className="list-unstyled accordion-menu">
          {/* Dashboard */}
          <li className="sidebar-heading">DASHBOARD</li>
          <li
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Dashboard"
          >
            <Link to="/admin/dashboard" className="nav-link">
              <span className="sidenav__icon">
                <i data-feather="activity"></i>
              </span>
              Dashboard
            </Link>
          </li>

          {adminNavbarConfig.map((item, index) => {
            // ── Heading render ──────────────────────────────
            if (item.type === "heading") {
              // Only show heading if at least one item below it (before next heading) is visible
              let sectionHasVisible = false;
              for (let i = index + 1; i < adminNavbarConfig.length; i++) {
                const nextItem = adminNavbarConfig[i];
                if (nextItem.type === "heading") break;
                if (nextItem.children) {
                  if (
                    nextItem.children.some((child) =>
                      canSee((child.path || "").replace(/^\//, "")),
                    )
                  ) {
                    sectionHasVisible = true;
                    break;
                  }
                } else {
                  if (canSee((nextItem.path || "").replace(/^\//, ""))) {
                    sectionHasVisible = true;
                    break;
                  }
                }
              }
              if (!sectionHasVisible) return null;

              return (
                <li key={index} className="sidebar-heading">
                  {item.label}
                </li>
              );
            }

            // ── Children (dropdown) render ──────────────────
            if (item.children) {
              const visibleChildren = (item.children || []).filter((child) => {
                const key = (child.path || "").replace(/^\//, "");
                return key && canSee(key);
              });

              if (!visibleChildren.length) return null;

              const isMenuOpen = visibleChildren.some((child) => {
                return activePath
                  ? activePath === child.path
                  : location.pathname === child.path;
              });

              return (
                <li key={index} className={`pointer-cursor ${isMenuOpen ? "open" : ""}`}>
                  <a
                    href="#"
                    className="add-collapse-margin"
                    style={{ marginLeft: 0 }}
                    onClick={(e) => e.preventDefault()}
                  >
                    <span className="sidenav__icon">{item.icon}</span>
                    {item.name}
                    <i className="fas fa-chevron-right dropdown-icon"></i>
                  </a>

                  <ul style={{ display: isMenuOpen ? "block" : "none" }}>
                    {visibleChildren.map((child, childIndex) => {
                      const childKey = (child.path || "").replace(/^\//, "");
                      if (!childKey || !canSee(childKey)) return null;

                      const isActive = activePath
                        ? activePath === child.path
                        : location.pathname === child.path;

                      return (
                        <li key={childIndex}>
                          <Link
                            to={child.path}
                            className={() =>
                              `nav-link ${isActive ? "active" : ""}`
                            }
                            onClick={child.onClick}
                          >
                            <i className="far fa-circle"></i> {child.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            }

            // ── Single item render ──────────────────────────
            const path = item.path || "";
            const key = path.replace(/^\//, "");
            if (!key || !canSee(key)) return null;

            return (
              <li key={index}>
                <Link to={item.path} className="nav-link">
                  <span className="sidenav__icon">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            );
          })}

          {/* Profile */}
          <li>
            <Link to="/admin/adminProfile" className="nav-link">
              <span className="sidenav__icon">
                <i data-feather="user"></i>
              </span>
              Profile
            </Link>
          </li>

          {/* Logout */}
          <li>
            <a
              href="#"
              onClick={handleLogout}
              className="add-collapse-margin cursor-pointer"
            >
              <span className="sidenav__icon">
                <i data-feather="log-out"></i>
              </span>
              Logout
            </a>
          </li>
        </ul>

        <a
          href="#"
          id="sidebar-collapsed-toggle"
          style={{ opacity: 0, pointerEvents: "none" }}
          onClick={(e) => e.preventDefault()}
        >
          <i data-feather="arrow-right"></i>
        </a>
      </div>

      {/* Sidebar Overlay for mobile */}
      <div
        className="mobile-sidebar-overlay"
        onClick={closeSidebar}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 9998,
          display: "none",
        }}
      />
      <style>{`
        @media (max-width: 1350px) {
          body.sidebar-hidden .mobile-sidebar-overlay {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
};
export default Navbar;
