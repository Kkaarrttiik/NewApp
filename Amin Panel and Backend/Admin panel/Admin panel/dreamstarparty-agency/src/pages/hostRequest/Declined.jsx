import React, { useEffect } from "react";
import { getHostRequest } from "../../store/hostRequest/action";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../../store/admin/action";
import male from "../../assets/images/male.png";
import useTranslation from "../../hooks/useTranslation";

const Declined = () => {
  const { t } = useTranslation();
  const { request } = useSelector((state) => state.hostRequest);
  const agencyId = localStorage.getItem("agencyId");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProfile(agencyId));
  }, [agencyId]);

  const T = {
    cardBg: "#461b59",
    text: "#EAF0FF",
    subText: "#9AA3B2",
    accent: "#F90008",
    border: "#ffffff50",
    radius: "12px",
    userTagBg: "#7B11E3",
  };

  return (
    <>
      {request?.length > 0 ? (
        <div className="declined-list" style={{ padding: "8px 0" }}>
          {request?.map((data, index) => {
            return (
              <div
                key={index}
                className="accepted-card"
                style={{
                  background: T.cardBg,
                  borderRadius: T.radius,
                  padding: "24px",
                  marginBottom: "16px",
                  border: `1px solid ${T.border}`,
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
                // onMouseEnter={(e) => {
                //   e.currentTarget.style.transform = "translateY(-2px)";
                //   e.currentTarget.style.boxShadow =
                //     "0 8px 24px rgba(0,0,0,0.2)";
                // }}
                // onMouseLeave={(e) => {
                //   e.currentTarget.style.transform = "translateY(0)";
                //   e.currentTarget.style.boxShadow =
                //     "0 4px 12px rgba(0,0,0,0.15)";
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
                    </div>

                    <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
                      <div
                        style={{
                          color: T.text,
                          fontWeight: 600,
                          fontSize: 14,
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
                          {t("ID")} : {data?.user?.uniqueId || "-"}
                        </span>
                        {/* <span style={{ color: T.border }}>•</span>
                      <span>{t("host")}</span> */}
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      background: "rgba(197, 34, 34, 0.15)",
                      padding: "2px 10px",
                      borderRadius: "20px",
                      border: `1px solid rgba(197, 34, 34, 0.3)`,
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        backgroundColor: T.accent,
                        borderRadius: "50%",
                        animation: "pulse 2s infinite",
                      }}
                    />
                    <span
                      style={{
                        color: T.accent,
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      {t("declined")}
                    </span>
                  </div>
                </div>

                {/* Additional Info - Align left */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "24px",
                    marginTop: "12px",
                    paddingTop: "12px",
                    borderTop: `1px solid ${T.border}`,
                    alignItems: "flex-start", // start from left
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: T.subText,
                        fontWeight: 600,
                        fontSize: 14,
                        marginBottom: "4px",
                      }}
                    >
                      {t("declined")} {t("date")}
                    </div>
                    <div
                      style={{
                        color: T.text,
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      {new Date().toLocaleDateString()}
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        color: T.subText,
                        fontWeight: 600,
                        fontSize: 14,
                        marginBottom: "4px",
                      }}
                    >
                      {t("status")}
                    </div>
                    <div
                      style={{
                        color: T.accent,
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      {t("inactive")}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
            <span style={{ fontSize: "32px", color: T.subText }}>❌</span>
          </div>
          <div
            style={{
              color: T.text,
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            {t("no_decline")}
          </div>
          <div
            style={{
              color: T.subText,
              fontSize: "14px",
              maxWidth: "300px",
            }}
          >
            {t("no_decline_application")}
          </div>
        </div>
      )}

      <style jsx>{`
        .declined-card:hover {
          cursor: pointer;
        }

        /* Mobile Styles - Only adjust sizing, keep same layout */
        @media (max-width: 768px) {
          .declined-card {
            padding: 16px !important;
            margin-bottom: 12px !important;
          }

          .declined-card > div:first-child {
            gap: 12px;
          }

          .declined-card > div:first-child > div:first-child img {
            height: 48px !important;
            width: 48px !important;
          }

          .declined-card > div:first-child > div:last-child {
            padding: 8px 12px !important;
          }

          .declined-card > div:first-child > div:last-child svg {
            width: 16px !important;
            height: 16px !important;
          }

          .declined-card > div:first-child > div:last-child span {
            font-size: 13px !important;
          }

          .declined-card
            > div:first-child
            > div:first-child
            > div:last-child
            > div:first-child
            > div:first-child {
            font-size: 16px !important;
            max-width: 150px !important;
          }

          .declined-card
            > div:first-child
            > div:first-child
            > div:last-child
            > div:nth-child(2) {
            font-size: 13px !important;
          }

          .declined-card > div:nth-child(2) {
            margin-top: 10px !important;
            padding-top: 10px !important;
            gap: 12px !important;
          }

          .declined-card > div:nth-child(2) > div > div:first-child {
            font-size: 11px !important;
          }

          .declined-card > div:nth-child(2) > div > div:last-child {
            font-size: 12px !important;
          }
        }

        /* Small Mobile Styles */
        @media (max-width: 480px) {
          .declined-card {
            padding: 14px !important;
          }

          .declined-card > div:first-child {
            gap: 10px;
          }

          .declined-card > div:first-child > div:first-child img {
            height: 44px !important;
            width: 44px !important;
          }

          .declined-card > div:first-child > div:last-child {
            padding: 6px 10px !important;
          }

          .declined-card > div:first-child > div:last-child span {
            font-size: 12px !important;
          }

          .declined-card
            > div:first-child
            > div:first-child
            > div:last-child
            > div:first-child
            > div:first-child {
            font-size: 15px !important;
            max-width: 120px !important;
          }

          .declined-card
            > div:first-child
            > div:first-child
            > div:last-child
            > div:nth-child(2) {
            font-size: 12px !important;
          }

          .declined-card > div:nth-child(2) {
            gap: 8px !important;
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

        /* Tablet Styles */
        @media (max-width: 1024px) and (min-width: 769px) {
          .declined-card {
            padding: 18px !important;
          }

          .declined-card
            > div:first-child
            > div:first-child
            > div:last-child
            > div:first-child
            > div:first-child {
            max-width: 180px !important;
          }
        }
      `}</style>
    </>
  );
};

export default Declined;
