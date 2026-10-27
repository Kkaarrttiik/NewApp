import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import rCoin from "../assets/images/r coin 2.png";
import useTranslation from "../hooks/useTranslation";

const HostSettlement = () => {
  const { hostHistory } = useSelector((state) => state.history);
  const [data, setData] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    setData(hostHistory);
  }, [hostHistory]);

  return (
    <div style={{ padding: "16px", maxWidth: "600px", margin: "0 auto" }}>
      {data?.length > 0 ? (
        data.map((data, index) => (
          <div
            key={index}
            style={{
              background: "#241330",
              border: "1px solid #372143",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "12px",
            }}
          >
            {/* Period Row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
                paddingBottom: "8px",
                borderBottom: "1px solid #372143",
              }}
            >
              <span style={{ color: "#b19cd9", fontSize: "14px" }}>
                {t("period")}
              </span>
              <span
                style={{
                  color: "#FF1C60",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                {data?.startDate} TO {data?.endDate}
              </span>
            </div>

            {/* Total Coin Row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
                paddingBottom: "8px",
                borderBottom: "1px solid #372143",
              }}
            >
              <span style={{ color: "#b19cd9", fontSize: "14px" }}>
                {t("total_coin")}
              </span>
              <span
                style={{
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                {data?.amount || 0}
              </span>
            </div>

            {/* Payment Date Row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <span style={{ color: "#b19cd9", fontSize: "14px" }}>
                {t("payment_date")}
              </span>
              <span
                style={{
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                {data?.statusOfTransaction === 1
                  ? t("pending")
                  : data?.payoutDate || t("na")}
              </span>
            </div>

            {/* Amount Row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ color: "#b19cd9", fontSize: "14px" }}>
                {t("amount")}
              </span>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <img src={rCoin} alt="R Coin" height={20} width={20} />
                <span
                  style={{
                    color: "#ffd700",
                    fontSize: "16px",
                    fontWeight: "600",
                  }}
                >
                  {data?.dollar ? data?.dollar : 0}
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: "#8e80a8ff",
            fontSize: "16px",
            background: "transparent",
            borderRadius: "12px",
            // border: "1px solid #ffffff54"
          }}
        >
          {t("no_data_found")}
        </div>
      )}
    </div>
  );
};

export default HostSettlement;
