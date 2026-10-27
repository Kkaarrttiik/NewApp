import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getHostRequest } from "../../store/hostRequest/action";
import { getProfile } from "../../store/admin/action";
import male from "../../assets/images/male.png";
import useTranslation from "../../hooks/useTranslation";

const Accepted = () => {
  const { t } = useTranslation();
  const { request } = useSelector((state) => state.hostRequest);
  const admin = useSelector((state) => state.admin.seller);
  const agencyId = localStorage.getItem("agencyId");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProfile(agencyId));
  }, []);

  const T = {
    cardBg: "#461b59",
    text: "#EAF0FF",
    subText: "#9AA3B2",
    accent: "#22C55E",
    border: "#ffffff50",
    radius: "12px",
  };

  return (
    <>
      {request?.length > 0 ? (
        <div className="accepted-list" style={{ padding: "8px 0" }}>
          {request?.map((data, index) => (
            <div
              key={index}
              className="accepted-card"
              style={{
                background: T.cardBg,
                borderRadius: T.radius,
                padding: "16px",
                marginBottom: "12px",
                border: `1px solid ${T.border}`,
                transition: "all 0.3s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
              // onMouseEnter={(e) => {
              //   e.currentTarget.style.transform = "translateY(-2px)";
              //   e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.2)";
              // }}
              // onMouseLeave={(e) => {
              //   e.currentTarget.style.transform = "translateY(0)";
              //   e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
              // }}
            >
              {/* Top Section: User Info + Status */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                {/* User Info */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <img
                      src={data?.user?.image || male}
                      style={{
                        height: "48px",
                        width: "48px",
                        objectFit: "cover",
                        borderRadius: "50%",
                        border: "2px solid rgba(255,255,255,0.1)",
                      }}
                      alt={data?.name}
                    />
                    {/* <div
                      style={{
                        position: "absolute",
                        bottom: "2px",
                        right: "2px",
                        width: "12px",
                        height: "12px",
                        backgroundColor: T.accent,
                        borderRadius: "50%",
                        border: `2px solid ${T.cardBg}`,
                      }}
                    /> */}
                  </div>

                  <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
                    <div
                      style={{
                        fontWeight: "600",
                        color: T.text,
                        fontSize: "14px",
                        marginBottom: "4px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {data?.name}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontWeight: 600,
                        fontSize: 14,
                        color: T.subText,
                        flexWrap: "wrap",
                      }}
                    >
                      <span>
                        {t("ID")}: {data?.user?.uniqueId || "-"}
                      </span>
                      <span style={{ color: T.border }}>•</span>
                      <span>{t("host")}</span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(34, 197, 94, 0.15)",
                    padding: "2px 9px",
                    borderRadius: "20px",
                    border: `1px solid rgba(34, 197, 94, 0.3)`,
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      backgroundColor: T.accent,
                      borderRadius: "50%",
                      // animation: "pulse 2s infinite",
                    }}
                  />
                  <span
                    style={{
                      color: T.accent,
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    {t("accepted")}
                  </span>
                </div>
              </div>

              {/* Bottom Section: Additional Info */}
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  marginTop: "12px",
                  paddingTop: "12px",
                  borderTop: `1px solid ${T.border}`,
                  flexWrap: "wrap",
                  justifyContent: "flex-start",
                }}
              >
                <div style={{ textAlign: "left", flex: "1 1 120px" }}>
                  <div
                    style={{
                      color: T.subText,
                      fontWeight: 600,
                      fontSize: 14,
                      marginBottom: "4px",
                    }}
                  >
                    {t("join")}
                  </div>
                  <div
                    style={{
                      color: T.text,
                      fontWeight: 600,
                      fontSize: 14,
                      fontWeight: "500",
                    }}
                  >
                    {new Date().toLocaleDateString()}
                  </div>
                </div>

                <div style={{ textAlign: "left", flex: "1 1 120px" }}>
                  <div
                    style={{
                      color: T.subText,
                      fontWeight: 600,
                      fontSize: 14,
                      marginBottom: "4px",
                    }}
                  >
                    {t("mobile")}
                  </div>
                  <div
                    style={{
                      color: T.text,
                      fontWeight: 600,
                      fontSize: 14,
                      fontWeight: "500",
                    }}
                  >
                    {data?.mobile || "-"}
                  </div>
                </div>
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
            <span style={{ fontSize: "32px", color: T.subText }}>✅</span>
          </div>
          <div
            style={{
              color: T.text,
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            {t("no_accept")}
          </div>
          <div
            style={{ color: T.subText, fontSize: "14px", maxWidth: "300px" }}
          >
            {t("no_accepted_application")}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }

        .accepted-card:hover {
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .accepted-card {
            padding: 14px !important;
            margin-bottom: 10px !important;
          }

          .accepted-card img {
            height: 42px !important;
            width: 42px !important;
          }
        }
      `}</style>
    </>
  );
};

export default Accepted;
