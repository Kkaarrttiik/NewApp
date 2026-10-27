// /AgencyRedeem.js
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { OPEN_NEW_REDEEM_DIALOG } from "../store/myRedeem/type";
import AgencyRedeemCreate from "../component/dialog/AgencyRedeemCreate";
import { getMyRedeem } from "../store/redeem/action";
import useTranslation from "../hooks/useTranslation";
import rcoin from "../assets/images/r coin 2.png";

const T = {
  pageBg: "#33083e",
  text: "#EAF0FF",
  sub: "#C8CCDA",
  border: "rgba(255,255,255,0.12)",
  card: "#3c134e",
  cardSolid: "rgba(18,23,52,0.7)",
  radius: 16,
  shadow: "0 16px 36px rgba(0,0,0,0.35)",
  gradPink: "linear-gradient(180deg, #F861B1 0%, #E91384 100%)",
  gradPurple: "linear-gradient(180deg, #9456FB 0%, #7F15E2 100%)",
  green: "#22C55E",
  amber: "#F59E0B",
  rose: "#F43F5E",
};

export const AgencyRedeem = () => {
  const { t } = useTranslation();
  const agencyId = localStorage.getItem("agencyId");
  const dispatch = useDispatch();
  const location = useLocation();
  const data = location?.state?.state;
  const { myRedeem } = useSelector((state) => state.redeem);

  useEffect(() => {
    if (agencyId) dispatch(getMyRedeem(agencyId));
  }, [dispatch, agencyId]);

  const handleOpenRedeem = () => {
    dispatch({ type: OPEN_NEW_REDEEM_DIALOG, payload: data });
  };

  const statusBadge = (status) => {
    if (status === 1)
      return {
        bg: "rgba(245,158,11,.15)",
        bd: T.amber,
        color: T.amber,
        label: t("pending"),
        dott: T.amber,
      };
    if (status === 2)
      return {
        bg: "rgba(34,197,94,.15)",
        bd: T.green,
        color: T.green,
        label: t("paid"),
        dott: T.green,
      };
    return {
      bg: "rgba(244,63,94,.15)",
      bd: T.rose,
      color: T.rose,
      label: t("decline"),
      dott: T.rose,
    };
  };

  return (
    <div style={{ background: T.pageBg, minHeight: "100vh" }}>
      {true && <AgencyRedeemCreate />}

      {/* HEADER */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 9,
          background: T.pageBg,
          padding: "12px 16px",
          borderBottom: `1px solid ${T.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ fontWeight: 500, fontSize: 18, color: T.text }}>
            {t("agency_redeem")}
          </div>
          <div style={{ fontSize: 12, color: T.sub }}>
            {t("payout_request")}
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          padding: "8px 16px",
        }}
      >
        {/* ADD BUTTON */}
        <button
          style={{
            fontWeight: 600,
            fontSize: "14px",
            background: T.gradPink,
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,.85)",
            padding: "0 22px",
            height: 40,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
          onClick={handleOpenRedeem}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          {t("add")}
        </button>
      </div>
      {/* CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 16,
          padding: "10px",
        }}
      >
        {myRedeem && myRedeem.length > 0 ? (
          myRedeem.map((item, idx) => {
            const s = statusBadge(item.status);
            return (
              <div
                key={idx}
                style={{
                  background: T.card,
                  border: `1px solid ${T.border}`,
                  borderRadius: T.radius,
                  padding: "14px 10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <img
                      src={rcoin}
                      alt=""
                      width={24}
                      height={24}
                    />
                    <span
                      style={{
                        color: T.text,
                        fontWeight: 600,
                        fontSize: "14px",
                      }}
                    >
                      {item.amount || 0}
                    </span>
                  </div>
                  <span
                    style={{
                      background: s.bg,
                      border: `1px solid ${s.bd}`,
                      color: s.color,
                      borderRadius: 999,
                      padding: "4px 10px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: 14,
                      fontWeight: 500,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          backgroundColor: s.dott,
                          borderRadius: "50%",
                          // animation: "pulse 2s infinite",
                        }}
                      />
                    </div>
                    <div>{s.label}</div>
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div
                      style={{ fontSize: 14, color: T.sub, fontWeight: 600 }}
                    >
                      {t("coin")}
                    </div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "14px",
                        color: T.text,
                      }}
                    >
                      {item.rCoin}
                    </div>
                  </div>
                  <div style={{ maxWidth: "60%" }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "14px",
                        color: T.sub,
                      }}
                    >
                      {t("description")}
                    </div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "14px",
                        color: T.text,
                        lineHeight: 1.4,
                      }}
                    >
                      {item.description || "—"}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderTop: `1px dashed ${T.border}`,
                    paddingTop: 8,
                  }}
                >
                  <div
                    style={{ fontWeight: 600, fontSize: "14px", color: T.sub }}
                  >
                    {t("date")}
                  </div>
                  <div
                    style={{ color: T.text, fontWeight: 600, fontSize: "14px" }}
                  >
                    {item.date?.split(",")[0] || "—"}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: 60,
              color: T.sub,
              gridColumn: "1 / -1",
            }}
          >
            <h3 style={{ color: T.text }}>{t("no_redeem_requests")}</h3>
            <p>{t("no_items")}</p>
          </div>
        )}
      </div>
    </div>
  );
};
