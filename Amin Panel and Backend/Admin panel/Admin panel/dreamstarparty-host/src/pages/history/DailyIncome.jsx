import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import rCoin from "../../assets/images/r coin 2.png";
import useTranslation from "../../hooks/useTranslation";

const DailyIncome = () => {
  const { t } = useTranslation();
  const { hostHitory } = useSelector((state) => state.history);
  const navigate = useNavigate();

  const handleOpenHistory = (data) => {
    navigate("/host/historyInfo", { state: data?.date });
  };

  return (
    <div style={{ padding: "16px", maxWidth: "500px", margin: "0 auto" }}>
      {hostHitory?.length > 0 ? (
        hostHitory.map((data, index) => (
          <div
            key={index}
            style={{
              background: "#241330",
              border: "1px solid #372143",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "10px",
              cursor: "pointer"
            }}
          >
            {/* Single row with date and income */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <div style={{ color: "#FF0C8A", fontSize: "14px", marginBottom: "4px" }}>
                  {t("date")}
                </div>
                <div style={{ color: "#ffffff", fontSize: "14px" }}>
                  {moment(data?.date).format("DD MMM YYYY")}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ color: "#FF0C8A", fontSize: "14px", marginBottom: "4px" }}>
                  {t("income")}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <img src={rCoin} alt="R Coin" height={18} width={18} />
                  <span style={{ color: "#ffd700", fontSize: "16px", fontWeight: "600" }}>
                    {data?.totalRCoin ? data?.totalRCoin.toFixed(0) : 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div style={{
          textAlign: "center",
          padding: "40px",
          color: "#8e80a8ff",
          fontSize: "16px",
          background: "transparent",
          borderRadius: "12px",
          // border: "1px solid #ffffff54"
        }}>
          {t("no_data_found")}
        </div>
      )}
    </div>
  );
};

export default DailyIncome;
