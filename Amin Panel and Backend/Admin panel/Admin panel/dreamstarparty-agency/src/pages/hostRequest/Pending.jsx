import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  acceptHostRequest,
  getHostRequest,
} from "../../store/hostRequest/action";
import { getProfile } from "../../store/admin/action";
import male from "../../assets/images/male.png";
import ReasonDialogue from "./ReasonDialogue";
import { permissionError } from "../../util/Alert";
import useTranslation from "../../hooks/useTranslation";

const Pending = () => {
  const { t } = useTranslation();
  const { request } = useSelector((state) => state.hostRequest);
  const admin = useSelector((state) => state.admin.seller);
  const agencyId = localStorage.getItem("agencyId");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProfile(agencyId));
  }, [agencyId]);

  const handleAccept = (id) => {
    if (admin?.isActive === false) return permissionError();
    dispatch(acceptHostRequest(id, "accept"));
  };

  const handleDecline = (id) => {
    if (admin?.isActive === false) return permissionError();
    dispatch(acceptHostRequest(id, "decline"));
  };

  const T = {
    cardBg: "#461b59",
    text: "#EAF0FF",
    subText: "#9AA3B2",
    accentGreen: "#00A1F6",
    accentRed: "#F90008",
    border: "#ffffff50",
    radius: "16px",
    userTagBg: "#7B11E3",
  };

  return (
    <>
      {request?.length > 0 ? (
        <div className="pending-list" style={{ padding: "8px 0" }}>
          {request.map((data, index) => (
            <div
              key={index}
              className="pending-card"
              style={{
                background: T.cardBg,
                borderRadius: T.radius,
                padding: "20px",
                marginBottom: "16px",
                border: `1px solid ${T.border}`,
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  width: "100%",
                  gap: "16px",
                }}
              >
                {/* User Info */}
                <div
                  className="user-info"
                  style={{ display: "flex", gap: "16px", flex: 1, minWidth: 0 }}
                >
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <img
                      src={data?.user?.image || male}
                      alt={data?.name}
                      style={{
                        height: "56px",
                        width: "56px",
                        objectFit: "cover",
                        borderRadius: "50%",
                        border: "2px solid rgba(255,255,255,0.1)",
                      }}
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
                    <div
                      className="user-name"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "8px",
                        flexWrap: "wrap",
                        fontWeight: 600,
                        fontSize: 14,
                        color: T.text,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {data?.name || "-"}
                      {/* <div
                        style={{
                          background: T.userTagBg,
                          color: "white",
                          padding: "4px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600",
                          flexShrink: 0,
                        }}
                      >
                        User
                      </div> */}
                    </div>

                    <div
                      style={{
                        color: T.subText,
                        fontWeight: 600,
                        fontSize: 14,
                        marginBottom: "8px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {t("ID")}: {data?.user?.uniqueId || "-"}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div
                  className="desktop-actions"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flexShrink: 0,
                  }}
                >
                  <button
                    onClick={() => handleAccept(data?._id)}
                    style={{
                      background: "rgba(34, 197, 94, 0.15)",
                      border: `1px solid rgba(34, 197, 94, 0.3)`,
                      borderRadius: "12px",
                      padding: "12px",
                      cursor: "pointer",
                      width: "52px",
                      height: "52px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.9999 21.4286C17.2071 21.4286 21.4284 17.2072 21.4284 12C21.4284 6.79273 17.2071 2.57141 11.9999 2.57141C6.7926 2.57141 2.57129 6.79273 2.57129 12C2.57129 17.2072 6.7926 21.4286 11.9999 21.4286Z"
                        fill="#22C55E"
                        stroke="#22C55E"
                        strokeWidth="2.48008"
                      />
                      <path
                        d="M10.17 13.5432L8.22373 11.5969C7.86321 11.2364 7.26813 11.2364 6.90762 11.5969C6.5471 11.9574 6.5471 12.5525 6.90762 12.913L9.51191 15.5173C9.51193 15.5173 9.51195 15.5174 9.51197 15.5174C9.68642 15.692 9.92307 15.7902 10.1699 15.7905L10.1701 15.7905C10.417 15.7902 10.6536 15.692 10.8281 15.5174C10.8281 15.5174 10.8281 15.5173 10.8281 15.5173L16.026 10.3194C16.3866 9.95892 16.3866 9.36384 16.026 9.00332C15.6655 8.6428 15.0704 8.6428 14.7099 9.00332L10.17 13.5432Z"
                        fill="white"
                        stroke="white"
                        strokeWidth="0.248008"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={() => handleDecline(data?._id)}
                    style={{
                      background: "#f55b5057",
                      border: "none",
                      borderRadius: "12px",
                      padding: "12px",
                      cursor: "pointer",
                      width: "52px",
                      height: "52px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 21.4286C17.2076 21.4286 21.4289 17.2072 21.4289 12C21.4289 6.79273 17.2076 2.57141 12 2.57141C6.79309 2.57141 2.57178 6.79273 2.57178 12C2.57178 17.2072 6.79309 21.4286 12 21.4286Z"
                        fill="#F90008"
                        stroke="#F90008"
                        strokeWidth="2.48"
                      />
                      <path
                        d="M15.1436 8.85696L8.85794 15.1426M8.85791 8.85693L15.1436 15.1426"
                        stroke="white"
                        strokeWidth="2.14"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Status */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "16px",
                  paddingTop: "16px",
                  borderTop: `1px solid ${T.border}`,
                }}
              >
                {/* <div
                  style={{
                    width: "8px",
                    height: "8px",
                    backgroundColor: "#F59E0B",
                    borderRadius: "50%",
                  }}
                /> */}
                <span
                  style={{
                    color: "#F59E0B",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  {t("pending_approval")}
                </span>
                <span
                  style={{
                    color: T.subText,
                    fontWeight: 600,
                    fontSize: 14,
                    marginLeft: "auto",
                  }}
                >
                  {t("requested_on")} {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              backgroundColor: "rgba(255,255,255,0.05)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
            }}
          >
            <span style={{ fontSize: "32px", color: T.subText }}>⏳</span>
          </div>
          <div
            style={{
              color: T.text,
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            {t("no_pending")}
          </div>
          <div
            style={{ color: T.subText, fontSize: "14px", maxWidth: "300px" }}
          >
            {t("no_pending_application")}
          </div>
        </div>
      )}

      <ReasonDialogue />

      <style jsx>{`
        @media (max-width: 768px) {
          .pending-card {
            flex-direction: row !important;
            padding: 16px !important;
          }
          .user-name {
            font-size: 16px !important;
            max-width: 150px !important;
          }
          .desktop-actions {
            width: auto !important;
          }
        }

        @media (max-width: 480px) {
          .pending-card {
            padding: 12px !important;
          }
          .user-name {
            font-size: 14px !important;
            max-width: 120px !important;
          }
        }
      `}</style>
    </>
  );
};

export default Pending;
