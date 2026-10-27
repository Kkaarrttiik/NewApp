import React, { useEffect, useState } from "react";
import Pending from "./Pending";
import Declined from "./Declined";
import Accepted from "./Accepted";
import { useDispatch, useSelector } from "react-redux";
import { getHostRequest } from "../../store/hostRequest/action";
import { useLocation } from "react-router-dom";
import useTranslation from "../../hooks/useTranslation";

const T = {
  pageBg: "#33083e",
  text: "#EAF0FF",
  sub: "#9AA3B2",
  border: "rgba(255,255,255,0.08)",
  card: "#3c134e",
  radius: 16,
  shadow: "0 16px 36px rgba(0,0,0,0.35)",
  indigo: "#6366F1",
  purple: "#8B5CF6",
  green: "#22C55E",
  rose: "#F43F5E",
  gradPurple: " linear-gradient(180deg, #9456FB 0%, #7F15E2 100%)",
};

const HostRequest = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(1);
  const dispatch = useDispatch();
  const agencyId = localStorage.getItem("agencyId");

  const admin = useSelector((state) => state.admin.seller);
  const { request } = useSelector((state) => state.hostRequest);
  const totalCount = request?.length || 0;
  console.log("request: ", request.length);

  useEffect(() => {
    dispatch(getHostRequest(agencyId, activeTab));
  }, [dispatch, activeTab]);

  // counts from API data
  const pendingCount = activeTab === 1 ? request?.length : 0;
  const acceptedCount = activeTab === 2 ? request?.length : 0;
  const declinedCount = activeTab === 3 ? request?.length : 0;

  const tabs = [
    { id: 1, label: t("pending"), count: pendingCount },
    { id: 2, label: t("accepted"), count: acceptedCount },
    { id: 3, label: t("decline"), count: declinedCount },
  ];

  const getTabDisplayName = (tabId) => {
    switch (tabId) {
      case 1:
        return t("pending");
      case 2:
        return t("accepted");
      case 3:
        return t("decline");
      default:
        return t("pending");
    }
  };

  return (
    <>
      <div
        className="page"
        style={{
          background: T.pageBg,
          minHeight: "100vh",
        }}
      >
        <div className="main-wrapper">
          <div className="main-section">
            {/* Header */}
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
                    {t("host_request")}
                  </div>
                  <div style={{ fontSize: 12, color: T.sub, marginTop: 2 }}>
                    {t("manage_review")}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            {/* <div
              style={{
                padding: "16px",
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  background: T.card,
                  borderRadius: "12px",
                  padding: "16px",
                  border: `1px solid ${T.border}`,
                  textAlign: "center",
                }}
              >
                <div
                  style={{ fontSize: "24px", fontWeight: "700", color: T.text }}
                >
                  {totalCount}
                </div>
                <div
                  style={{  fontWeight: 600,
                          fontSize: 14, color: T.sub, marginTop: "4px" }}
                >
                  Total Requests
                </div>
              </div>
              <div
                style={{
                  background: T.card,
                  borderRadius: "12px",
                  padding: "16px",
                  border: `1px solid ${T.border}`,
                  textAlign: "center",
                }}
              >
                <div
                  style={{ fontSize: "24px", fontWeight: "700", color: T.text }}
                >
                  {totalCount}
                </div>
                <div
                  style={{  fontWeight: 600,
                          fontSize: 14, color: T.sub, marginTop: "4px" }}
                >
                  Pending
                </div>
              </div>
            </div> */}

            {/* Content */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 10,
              }}
            >
              <div
                style={{
                  width: "100%",
                  maxWidth: "1700px",
                  margin: "0px 16px 5px 16px",
                }}
              >
                {/* Content */}
                <div
                  style={{
                    background: T.card,
                    border: `1px solid ${T.border}`,
                    borderBottom: "none",
                    minHeight: "calc(100vh - 200px)",
                    position: "relative",
                    boxShadow: "0 -4px 20px rgba(0,0,0,0.3)",
                    borderRadius: 12,
                    display: "flex",
                    flexDirection: "column", // stack tabs + content vertically
                    overflow: "hidden", // parent hides overflow
                  }}
                >
                  {/* Tabs */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "nowrap",
                      background: "rgba(60, 19, 78, 0.8)",
                      padding: 8,
                      borderBottom: `1px solid ${T.border}`,
                      position: "sticky",
                      top: 0,
                      zIndex: 8,
                      gap: 6
                    }}
                  >
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                          flex: 1,
                          minWidth: 0,
                          background:
                            activeTab === tab.id ? T.gradPurple : "transparent",
                          border: "none",
                          padding: "10px 6px",
                          borderRadius: 10,
                          color: activeTab === tab.id ? T.text : T.sub,
                          fontWeight: 600,
                          fontSize: 13,
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 2,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}
                      >
                        <span style={{ fontSize: 16 }}>{tab.icon}</span>
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Content area - scrollable */}
                  <div
                    style={{
                      padding: 16,
                      flex: 1, // takes remaining space
                      overflowY: "auto", // enable vertical scroll
                      minHeight: 0, // necessary for flex scroll to work
                    }}
                  >
                    {request?.length === 0 ? (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "60px 20px",
                          color: T.sub,
                        }}
                      >
                        {/* SVG + messages here */}
                      </div>
                    ) : (
                      <>
                        {activeTab === 1 && <Pending type={activeTab} />}
                        {activeTab === 2 && <Accepted type={activeTab} />}
                        {activeTab === 3 && <Declined type={activeTab} />}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HostRequest;
