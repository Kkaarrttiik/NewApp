import React, { useState } from "react";
import CoinPlan from "../component/table/CoinPlan";
import VIPPlan from "../component/table/VIPPlan";

const MainPlan = () => {
  const [type, setType] = useState(() => {
    return localStorage.getItem("planTab") || "coinPlan";
  });

  const handleTabChange = (newType) => {
    setType(newType);
    localStorage.setItem("planTab", newType);
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
                  background: type === "coinPlan" ? "#0f766e" : "#1a1f2e",
                  color: type === "coinPlan" ? "#99f6e4" : "#6b7280",
                  border: `1px solid ${type === "coinPlan" ? "#0f766e" : "#2a3050"}`,
                  borderRadius: 6,
                  transition: "0.2s",
                }}
                onClick={() => handleTabChange("coinPlan")}
              >
                Coin Plan
              </button>
              <button
                type="button"
                className="btn btn-sm"
                style={{
                  background: type === "vipPlan" ? "#c0392b" : "#1a1f2e",
                  color: type === "vipPlan" ? "#fff" : "#6b7280",
                  border: `1px solid ${type === "vipPlan" ? "#c0392b" : "#2a3050"}`,
                  borderRadius: 6,
                  transition: "0.2s",
                }}
                onClick={() => handleTabChange("vipPlan")}
              >
                VIP Plan
              </button>
            </div>
          </div>
        </div>
      </div>

      {type === "coinPlan" ? (
        <CoinPlan type={type} />
      ) : (
        type === "vipPlan" && <VIPPlan type={type} />
      )}
    </div>
  );
};

export default MainPlan;
