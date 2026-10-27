import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
//MUI icon

//pagination

//Date Range Picker
//Calendar Css
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

import FerryWheel from "./gameHistory/FerryWheel";
import RouletteCasino from "./gameHistory/RouletteCasino";
import TeenPatti from "./gameHistory/TeenPatti";

function GameHistory() {
  const [type, setType] = useState(() => {
    // Retrieve the saved tab type from localStorage, default to "TeenPatti"
    return localStorage.getItem("selectedTab") || "TeenPatti";
  });

  useEffect(() => {
    // Save the selected tab type to localStorage whenever it changes
    localStorage.setItem("selectedTab", type);
  }, [type]);

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Game History</h3>
          </div>
          <div className="col-12 col-md-6 order-md-2 order-first">
            <nav
              aria-label="breadcrumb"
              className="breadcrumb-header float-start float-lg-end"
            >
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/admin/dashboard" className="text-white">
                    Dashboard
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Game History
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      {/* ── FILTER BAR — Tabs ── */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <button
              type="button"
              className="btn btn-sm"
              style={{
                background: type === "TeenPatti" ? "#1a6fd4" : "#1a1f2e",
                color: type === "TeenPatti" ? "#fff" : "#6b7280",
                border: `1px solid ${type === "TeenPatti" ? "#1a6fd4" : "#2a3050"}`,
                borderRadius: 6,
                transition: "0.2s",
              }}
              onClick={() => setType("TeenPatti")}
            >
              Teen Patti
            </button>
            <button
              type="button"
              className="btn btn-sm"
              style={{
                background: type === "RouletteCasino" ? "#c0392b" : "#1a1f2e",
                color: type === "RouletteCasino" ? "#fff" : "#6b7280",
                border: `1px solid ${type === "RouletteCasino" ? "#c0392b" : "#2a3050"}`,
                borderRadius: 6,
                transition: "0.2s",
              }}
              onClick={() => setType("RouletteCasino")}
            >
              Roulette Casino
            </button>
            <button
              type="button"
              className="btn btn-sm"
              style={{
                background: type === "ferryWheel" ? "#0f766e" : "#1a1f2e",
                color: type === "ferryWheel" ? "#99f6e4" : "#6b7280",
                border: `1px solid ${type === "ferryWheel" ? "#0f766e" : "#2a3050"}`,
                borderRadius: 6,
                transition: "0.2s",
              }}
              onClick={() => setType("ferryWheel")}
            >
              Ferry Wheel
            </button>
          </div>
        </div>
      </div>

      {type === "TeenPatti" ? (
        <TeenPatti />
      ) : type === "ferryWheel" ? (
        <FerryWheel />
      ) : type === "RouletteCasino" ? (
        <RouletteCasino />
      ) : (
        ""
      )}
    </>
  );
}

export default GameHistory;
