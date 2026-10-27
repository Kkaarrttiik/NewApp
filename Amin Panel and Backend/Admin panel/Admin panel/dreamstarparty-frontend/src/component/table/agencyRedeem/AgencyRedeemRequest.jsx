import React, { useState } from "react";
//routing
import { Link } from "react-router-dom";
import AcceptedRedeem from "./AcceptedRedeem";
import DeclineRedeem from "./DeclineRedeem";
import PendingRedeem from "./PendingRedeem";

const AgencyRedeemRequest = () => {
  const [type, setType] = useState(() => {
    return localStorage.getItem("agencyRedeemTab") || "Pending";
  });

  const handleTabChange = (newType) => {
    setType(newType);
    localStorage.setItem("agencyRedeemTab", newType);
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Agency Redeem Request</h3>
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
                  User Redeem Request
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      {/* ── FILTER BAR ── */}
      <div className="row">
        <div className="col-12">
          <div className="my-2">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <button
                type="button"
                className="btn btn-sm"
                style={{
                  background: type === "Pending" ? "#1a6fd4" : "#1a1f2e",
                  color: type === "Pending" ? "#fff" : "#6b7280",
                  border: `1px solid ${type === "Pending" ? "#1a6fd4" : "#2a3050"}`,
                  borderRadius: 6,
                  transition: "0.2s",
                }}
                onClick={() => handleTabChange("Pending")}
              >
                Pending
              </button>
              <button
                type="button"
                className="btn btn-sm"
                style={{
                  background: type === "Accepted" ? "#0f766e" : "#1a1f2e",
                  color: type === "Accepted" ? "#99f6e4" : "#6b7280",
                  border: `1px solid ${type === "Accepted" ? "#0f766e" : "#2a3050"}`,
                  borderRadius: 6,
                  transition: "0.2s",
                }}
                onClick={() => handleTabChange("Accepted")}
              >
                Accepted
              </button>
              <button
                type="button"
                className="btn btn-sm"
                style={{
                  background: type === "Declined" ? "#c0392b" : "#1a1f2e",
                  color: type === "Declined" ? "#fff" : "#6b7280",
                  border: `1px solid ${type === "Declined" ? "#c0392b" : "#2a3050"}`,
                  borderRadius: 6,
                  transition: "0.2s",
                }}
                onClick={() => handleTabChange("Declined")}
              >
                Declined
              </button>
            </div>
          </div>
        </div>
      </div>

      {type === "Pending" && <PendingRedeem />}
      {type === "Accepted" && <AcceptedRedeem />}
      {type === "Declined" && <DeclineRedeem />}
    </>
  );
};

export default AgencyRedeemRequest;
