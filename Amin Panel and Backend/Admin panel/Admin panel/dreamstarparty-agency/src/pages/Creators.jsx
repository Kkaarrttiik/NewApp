import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../store/user/action";
import male from "../assets/images/male.png";
import { CreatorDetails } from "../component/dialog/CreatorDetails";
import { useNavigate } from "react-router-dom";
import useTranslation from "../hooks/useTranslation";

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

const Creators = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);
  const agencyId = localStorage.getItem("agencyId");

  useEffect(() => {
    dispatch(getUser(agencyId));
  }, [dispatch, agencyId]);

  const handleOpenHostHistory = (id) => {
    navigate("/agencypanel/hosthistory", { state: id });
  };

  return (
    <>
      <div
        class="page-container"
        style={{
          background: "#33083e",
        }}
      >
        <div class="page">
          <div class="main-wrapper ps-0">
            <div className="main-section">
              {/* Top Bar */}
              <div
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 9,
                  background: "#33083e",
                  padding: "14px 12px",
                  borderBottom: `1px solid ${T.border}`,
                  backdropFilter: "blur(10px)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div>
                    <div
                      style={{ fontWeight: 500, fontSize: 18, color: T.text }}
                    >
                      {t("host")}
                    </div>
                    <div style={{ fontSize: 12, color: T.sub, marginTop: 2 }}>
                      {t("manage_agency_view")}
                    </div>
                  </div>
                </div>
              </div>

              <CreatorDetails />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Creators;
