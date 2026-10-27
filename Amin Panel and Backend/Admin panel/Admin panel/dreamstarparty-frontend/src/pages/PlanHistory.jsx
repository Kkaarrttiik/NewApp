import { useState } from "react";
import CoinPlanHistory from "../component/table/PurchaseCoinPlanHistory";
import VIPPlanHistory from "../component/table/PurchaseVipPlanHistory";

const PlanHistory = () => {
  const [type, setType] = useState(() => {
    return localStorage.getItem("planHistoryTab") || "coinPlanHistory";
  });

  const handleTabChange = (newType) => {
    setType(newType);
    localStorage.setItem("planHistoryTab", newType);
  };

  return (
    <div>
      {/* ── FILTER BAR — Tabs ── */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="filter-bar">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <button
                type="button"
                className="btn btn-sm"
                style={{
                  background:
                    type === "coinPlanHistory" ? "#0f766e" : "#1a1f2e",
                  color: type === "coinPlanHistory" ? "#99f6e4" : "#6b7280",
                  border: `1px solid ${type === "coinPlanHistory" ? "#0f766e" : "#2a3050"}`,
                  borderRadius: 6,
                  transition: "0.2s",
                }}
                onClick={() => handleTabChange("coinPlanHistory")}
              >
                Coin Plan History
              </button>
              <button
                type="button"
                className="btn btn-sm"
                style={{
                  background: type === "vipPlanHistory" ? "#c0392b" : "#1a1f2e",
                  color: type === "vipPlanHistory" ? "#fff" : "#6b7280",
                  border: `1px solid ${type === "vipPlanHistory" ? "#c0392b" : "#2a3050"}`,
                  borderRadius: 6,
                  transition: "0.2s",
                }}
                onClick={() => handleTabChange("vipPlanHistory")}
              >
                VIP Plan History
              </button>
            </div>
          </div>
        </div>
      </div>

      {type === "coinPlanHistory" ? (
        <CoinPlanHistory type={type} />
      ) : (
        type === "vipPlanHistory" && <VIPPlanHistory type={type} />
      )}
    </div>
  );
};

export default PlanHistory;
