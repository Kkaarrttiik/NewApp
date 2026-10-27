import "../setup/daterangepicker-init";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  getHostCallhistory,
  getHostGifthistory,
  getHostLivehistory,
} from "../store/history/history.action";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import dayjs from "dayjs";
import DateRangePicker from "react-bootstrap-daterangepicker";
import useTranslation from "../hooks/useTranslation";
import rcoin from "../assets/images/r coin 2.png";
import diamond from "../assets/images/diamond.png";

const T = {
  pageBg: "#33083e",
  text: "#EAF0FF",
  sub: "#9AA3B2",
  border: "rgba(255,255,255,0.08)",
  card: "#3c134e",
  cardSolid: "rgba(18,23,52,0.7)",
  radius: 16,
  shadow: "0 16px 36px rgba(0,0,0,0.35)",
  // accents
  indigo: "#6366F1",
  purple: "#8B5CF6",
  green: "#22C55E",
  rose: "#F43F5E",
  // gradients
  gradIndigo: "linear-gradient(135deg,#7366FF 0%,#3B82F6 100%)",
  gradPink: "linear-gradient(180deg, #F861B1 0%, #E91384 100%)",
  gradBlue: " linear-gradient(180deg, #02BDDF 0%, #0680DD 100%)",
  gradPurple: " linear-gradient(180deg, #9456FB 0%, #7F15E2 100%)",
  gradPink2: "#f2205f",
  gradepurple2: "#2E103C",
};

const HostHistory = () => {
  const { t } = useTranslation();
  const { hostHitory, total } = useSelector((state) => state?.history);
  const dispatch = useDispatch();
  const location = useLocation();
  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loadingMore, setLoadingMore] = useState(false);
  const [type, setType] = useState("gift");
  const [startDate, setStartDate] = useState(dayjs().startOf("month").toDate());
  const [endDate, setEndDate] = useState(dayjs().endOf("month").toDate());

  const startAllDate = "1970-01-01";
  const endAllDate = dayjs().format("YYYY-MM-DD");
  const hostId = location?.state?.id || location?.state;
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const startDate = dayjs().startOf("month").format("YYYY-MM-DD");
    const endDate = dayjs().endOf("month").format("YYYY-MM-DD");
    if (type === "live") {
      dispatch(getHostLivehistory(hostId, startDate, endDate));
    } else if (type === "call") {
      dispatch(getHostCallhistory(hostId, startDate, endDate));
    } else {
      dispatch(
        getHostGifthistory(
          hostId,
          type,
          activePage,
          rowsPerPage,
          startDate,
          endDate,
        ),
      );
    }
  }, [hostId, type, activePage, rowsPerPage]);

  const handleApply = (event, picker) => {
    const start = dayjs(picker.startDate).format("YYYY-MM-DD");
    const end = dayjs(picker.endDate).format("YYYY-MM-DD");

    setStartDate(start);
    setEndDate(end);

    if (type === "live") {
      dispatch(getHostLivehistory(hostId, start, end));
    } else if (type === "call") {
      dispatch(getHostCallhistory(hostId, start, end));
    } else {
      dispatch(
        getHostGifthistory(hostId, type, activePage, rowsPerPage, start, end),
      );
    }
  };

  const tabs = [
    { id: "gift", label: t("gift") },
    { id: "call", label: t("call") },
    { id: "live", label: t("live") },
  ];

  return (
    <>
      <div
        class="page"
        style={{
          background: "#33083e",
          minHeight: "100vh",
        }}
      >
        {/* Enhanced Header */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 9,
            background: T.pageBg,
            padding: "14px 12px",
            borderBottom: `1px solid ${T.border}`,
            backdropFilter: "blur(10px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div>
              <div style={{ fontWeight: 500, fontSize: 18, color: T.text }}>
                {t("host_history")}
              </div>
              <div style={{ fontSize: 12, color: T.sub, marginTop: 2 }}>
                {t("host_earning")}
              </div>
            </div>
          </div>
        </div>

        <div class="main-wrapper">
          <div className="main-section" style={{ padding: "16px" }}>
            {/* Date Picker Section */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div style={{ minWidth: "215px", position: "relative" }}>
                <DateRangePicker
                  initialSettings={{
                    startDate: undefined,
                    endDate: undefined,
                    ranges: {
                      All: [new Date("1970-01-01"), dayjs().toDate()],
                      Today: [dayjs().toDate(), dayjs().toDate()],
                      Yesterday: [
                        dayjs().subtract(1, "days").toDate(),
                        dayjs().subtract(1, "days").toDate(),
                      ],
                      "Last 7 Days": [
                        dayjs().subtract(6, "days").toDate(),
                        dayjs().toDate(),
                      ],
                      "Last 30 Days": [
                        dayjs().subtract(29, "days").toDate(),
                        dayjs().toDate(),
                      ],
                      "This Month": [
                        dayjs().startOf("month").toDate(),
                        dayjs().endOf("month").toDate(),
                      ],
                      "Last Month": [
                        dayjs().subtract(1, "month").startOf("month").toDate(),
                        dayjs().subtract(1, "month").endOf("month").toDate(),
                      ],
                    },
                    maxDate: new Date(),
                    singleDatePicker: false,
                    linkedCalendars: false,
                  }}
                  onApply={handleApply}
                >
                  <input
                    type="text"
                    readOnly
                    placeholder="Select Date Range"
                    value={
                      (startDate === startAllDate && endDate === endAllDate) ||
                        (startDate === "All" && endDate === "All")
                        ? "Select Date Range"
                        : `${dayjs(startDate).format("MM/DD/YYYY")} - ${dayjs(
                          endDate,
                        ).format("MM/DD/YYYY")}`
                    }
                    style={{
                      width: "100%",
                      fontWeight: 500,
                      cursor: "pointer",
                      background: "#372143",
                      color: T.text,
                      fontSize: "14px",
                      padding: "8px 12px",
                      borderRadius: "12px",
                      border: `1px solid ${T.border}`,
                      height: "48px",
                    }}
                  />
                </DateRangePicker>

                {/* Arrow Icon */}
                <span
                  style={{
                    position: "absolute",
                    right: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                    fontSize: "14px",
                    color: T.text,
                  }}
                >
                  ▼
                </span>
              </div>
            </div>

            {/* Enhanced Tab Navigation */}
            <div
              style={{
                display: "flex",
                background: "rgba(55, 33, 67, 0.6)",
                padding: "6px",
                borderRadius: "12px",
                border: `1px solid ${T.border}`,
                marginBottom: "24px",
              }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setType(tab.id)}
                  style={{
                    flex: 1,
                    background: type === tab.id ? T.gradPurple : "transparent",
                    border: "none",
                    padding: "12px 8px",
                    borderRadius: "8px",
                    color: type === tab.id ? T.text : T.sub,
                    fontWeight: "600",
                    fontSize: "14px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    minHeight: "44px",
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: "14px" }}>
                    {tab.id === "gift" && ""}
                    {tab.id === "call" && ""}
                    {tab.id === "live" && ""}
                  </span>
                  <span className="tab-label">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content Sections */}
            <div className="history-content">
              {type === "gift" && (
                <div>
                  {hostHitory?.length > 0 ? (
                    <div className="gift-list">
                      {hostHitory?.map((data, index) => (
                        <div
                          key={index}
                          className="history-card"
                          style={{
                            background: "#461b59",
                            borderRadius: "12px",
                            padding: "20px",
                            marginBottom: "12px",
                            border: `1px solid #ffffff50`,
                            transition: "all 0.3s ease",
                          }}
                        // onMouseEnter={(e) => {
                        //   e.currentTarget.style.transform = "translateY(-2px)";
                        //   e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
                        // }}
                        // onMouseLeave={(e) => {
                        //   e.currentTarget.style.transform = "translateY(0)";
                        //   e.currentTarget.style.boxShadow = "none";
                        // }}
                        >
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr auto auto",
                              gap: "16px",
                              alignItems: "center",
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  color: T.sub,
                                  fontWeight: 600,
                                  fontSize: "14px",
                                  marginBottom: "4px",
                                }}
                              >
                                {t("username")}
                              </div>
                              <div
                                style={{
                                  color: T.text,
                                  fontWeight: 600,
                                  fontSize: "14px",
                                }}
                              >
                                {data?.name || "-"}
                              </div>
                            </div>

                            <div style={{ textAlign: "center" }}>
                              <div
                                style={{
                                  color: T.sub,
                                  fontWeight: 600,
                                  fontSize: "14px",
                                }}
                              >
                                {t("coin_income")}
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  justifyContent: "center",
                                }}
                              >
                                <img
                                  src={rcoin}
                                  style={{ height: "24px", width: "24px" }}
                                  alt="RCoin"
                                />
                                <span
                                  style={{
                                    color: T.text,
                                    fontWeight: 600,
                                    fontSize: "14px",
                                  }}
                                >
                                  {data?.totalRCoin || 0}
                                </span>
                              </div>
                            </div>

                            <div style={{ textAlign: "center" }}>
                              <div
                                style={{
                                  color: T.sub,
                                  fontWeight: 600,
                                  fontSize: "14px",
                                  marginBottom: "4px",
                                }}
                              >
                                {t("date")}
                              </div>
                              <div
                                style={{
                                  color: T.text,
                                  fontWeight: 600,
                                  fontSize: "14px",
                                }}
                              >
                                {data?.date}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "60px 20px",
                        color: T.sub,
                      }}
                    >
                      <div style={{ marginBottom: 16, opacity: 0.6 }}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="80"
                          height="80"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          viewBox="0 0 24 24"
                          style={{ color: T.sub }}
                        >
                          <path d="M6 2h9l5 5v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" />
                          <path d="M14 2v6h6" />
                          <line x1="8" y1="13" x2="16" y2="13" />
                          <line x1="8" y1="17" x2="16" y2="17" />
                        </svg>
                      </div>
                      <div
                        style={{
                          color: T.text,
                          fontSize: "18px",
                          fontWeight: "600",
                          marginBottom: "8px",
                        }}
                      >
                        {t("no_gift_history")}
                      </div>
                      <div style={{ fontSize: "14px" }}>
                        {t("gift_periods")}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {type === "call" && (
                <div>
                  {hostHitory?.length > 0 ? (
                    <div className="call-list">
                      {hostHitory?.map((data, index) => (
                        <div
                          key={index}
                          className="history-card"
                          style={{
                            background: "#461b59",
                            borderRadius: "12px",
                            padding: "20px",
                            marginBottom: "12px",
                            border: `1px solid #ffffff50`,
                            transition: "all 0.3s ease",
                          }}
                        >
                          <div style={{ marginBottom: "16px" }}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-start",
                                alignItems: "center",
                                marginBottom: "8px",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                }}
                              >
                                {data?.callType === "MissedCall" && (
                                  <span
                                    style={{
                                      background: "#F43F5E",
                                      color: "white",
                                      padding: "4px 8px",
                                      borderRadius: "6px",
                                      fontWeight: 600,
                                      fontSize: 14,
                                    }}
                                  >
                                    {t("missed_call")}
                                  </span>
                                )}
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                  }}
                                >
                                  <img
                                    src={diamond}
                                    style={{ height: "24px", width: "24px" }}
                                    alt="Diamond"
                                  />
                                  <span
                                    style={{
                                      color: T.text,
                                      fontWeight: 600,
                                      fontSize: 14,
                                    }}
                                  >
                                    {data?.diamond || 0}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                color: T.sub,
                                fontWeight: 600,
                                fontSize: 14,
                              }}
                            >
                              <span>{data?.date?.split(",")[0]}</span>
                              <span>
                                {data?.callStartTime?.split(",")[1]} -{" "}
                                {data?.callEndTime?.split(",")[1] || "Ongoing"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "60px 20px",
                        color: T.sub,
                      }}
                    >
                      <div style={{ marginBottom: 16, opacity: 0.6 }}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="80"
                          height="80"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          viewBox="0 0 24 24"
                          style={{ color: T.sub }}
                        >
                          <path d="M6 2h9l5 5v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" />
                          <path d="M14 2v6h6" />
                          <line x1="8" y1="13" x2="16" y2="13" />
                          <line x1="8" y1="17" x2="16" y2="17" />
                        </svg>
                      </div>
                      <div
                        style={{
                          color: T.text,
                          fontSize: "18px",
                          fontWeight: "600",
                          marginBottom: "8px",
                        }}
                      >
                        {t("no_call_history")}
                      </div>
                      <div style={{ fontSize: "14px" }}>{t("call_record")}</div>
                    </div>
                  )}
                </div>
              )}

              {type === "live" && (
                <div>
                  {hostHitory?.length > 0 ? (
                    <div className="live-list">
                      {hostHitory?.map((data, index) => (
                        <div
                          key={index}
                          className="history-card"
                          style={{
                            background: "#461b59",
                            borderRadius: "12px",
                            padding: "20px",
                            marginBottom: "12px",
                            border: `1px solid #ffffff50`,
                            transition: "all 0.3s ease",
                          }}
                        >
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr 1fr 1fr",
                              gap: "12px",
                              alignItems: "center",
                              textAlign: "center",
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  color: T.sub,
                                  fontWeight: 600,
                                  fontSize: 14,
                                  marginBottom: "4px",
                                }}
                              >
                                {t("duration")}
                              </div>
                              <div
                                style={{
                                  color: T.text,
                                  fontWeight: 600,
                                  fontSize: 14,
                                }}
                              >
                                {data?.duration}
                              </div>
                            </div>

                            <div>
                              <div
                                style={{
                                  color: T.sub,
                                  fontWeight: 600,
                                  fontSize: 14,
                                  marginBottom: "4px",
                                }}
                              >
                                {t("gift")}
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  justifyContent: "center",
                                }}
                              >
                                <span
                                  style={{
                                    color: T.text,
                                    fontSize: "14px",
                                    fontWeight: "600",
                                  }}
                                >
                                  {data?.gifts || 0}
                                </span>
                              </div>
                            </div>

                            <div>
                              <div
                                style={{
                                  color: T.sub,
                                  fontWeight: 600,
                                  fontSize: 14,
                                  marginBottom: "4px",
                                }}
                              >
                                RCoin
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  justifyContent: "center",
                                }}
                              >
                                <img
                                  src={rcoin}
                                  style={{ height: "24px", width: "24px" }}
                                  alt="RCoin"
                                />
                                <span
                                  style={{
                                    color: T.text,
                                    fontSize: "14px",
                                    fontWeight: "600",
                                  }}
                                >
                                  {data?.rCoin}
                                </span>
                              </div>
                            </div>

                            <div>
                              <div
                                style={{
                                  color: T.sub,
                                  fontWeight: 600,
                                  fontSize: 14,
                                  marginBottom: "4px",
                                }}
                              >
                                {t("date")}
                              </div>
                              <div
                                style={{
                                  color: T.text,
                                  fontWeight: 600,
                                  fontSize: 14,
                                }}
                              >
                                {data?.startTime?.split(",")[0]}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "60px 20px",
                        color: T.sub,
                      }}
                    >
                      <div style={{ marginBottom: 16, opacity: 0.6 }}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="80"
                          height="80"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          viewBox="0 0 24 24"
                          style={{ color: T.sub }}
                        >
                          <path d="M6 2h9l5 5v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" />
                          <path d="M14 2v6h6" />
                          <line x1="8" y1="13" x2="16" y2="13" />
                          <line x1="8" y1="17" x2="16" y2="17" />
                        </svg>
                      </div>
                      <div
                        style={{
                          color: T.text,
                          fontSize: "18px",
                          fontWeight: "600",
                          marginBottom: "8px",
                        }}
                      >
                        {t("no_live_history")}
                      </div>
                      <div style={{ fontSize: "14px" }}>
                        {t("no_live_stream")}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <style>{`
          .history-card:hover {
            cursor: pointer;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          }

          /* Mobile Responsive Styles */
          @media (max-width: 768px) {
            .main-section {
              padding: 12px !important;
            }

            /* Show tab labels on mobile with smaller font */
            .tab-label {
              display: inline !important;
              font-size: 12px;
            }

            /* Adjust tab padding for mobile */
            .main-section > div > div:nth-child(2) button {
              padding: 10px 4px !important;
              gap: 4px !important;
              font-size: 12px !important;
            }

            .history-card {
              padding: 16px !important;
              margin-bottom: 10px !important;
            }

            /* Gift Section Mobile */
            .gift-list .history-card > div {
              grid-template-columns: 1fr !important;
              gap: 12px !important;
              text-align: left !important;
            }

            .gift-list .history-card > div > div {
              display: flex;
              justify-content: space-between;
              align-items: center;
            }

            /* Call Section Mobile */
            .call-list .history-card > div > div:first-child {
              flex-direction: column;
              align-items: flex-start;
              gap: 8px;
            }

            .call-list .history-card > div > div:first-child > div:last-child {
              align-self: stretch;
              display: flex;
              justify-content: space-between;
            }

            /* Live Section Mobile */
            .live-list .history-card > div {
              grid-template-columns: 1fr 1fr !important;
              gap: 16px !important;
            }

            .live-list .history-card > div > div {
              text-align: center;
            }
          }

          @media (max-width: 480px) {
            .main-section {
              padding: 8px !important;
            }

            /* Further adjust tabs for very small screens */
            .main-section > div > div:nth-child(2) button {
              padding: 8px 2px !important;
              font-size: 11px !important;
            }

            .tab-label {
              font-size: 14px !important;
              font-weight: 600 !important;
            }

            .history-card {
              padding: 12px !important;
            }

            .live-list .history-card > div {
              grid-template-columns: 1fr !important;
              gap: 12px !important;
            }

            .live-list .history-card > div > div {
              display: flex;
              justify-content: space-between;
              align-items: center;
              text-align: left !important;
            }
          }

          /* Tablet Styles */
          @media (max-width: 1024px) and (min-width: 769px) {
            .gift-list .history-card > div {
              grid-template-columns: 1fr 1fr !important;
              gap: 20px !important;
            }

            .gift-list .history-card > div > div:last-child {
              grid-column: 1 / -1;
              justify-self: center;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default HostHistory;
