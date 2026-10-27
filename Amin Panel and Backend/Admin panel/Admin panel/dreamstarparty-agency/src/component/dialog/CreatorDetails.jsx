import React, { useEffect } from "react";
import rCoin from "../../assets/images/r coin 2.png";
import { useDispatch, useSelector } from "react-redux";
import male from "../../assets/images/male.png";
import leftArrow from "../../assets/images/leftArrow.png";
import { getUser } from "../../store/user/action";
import { useNavigate } from "react-router-dom"; // Updated import
import useTranslation from "../../hooks/useTranslation";

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

export const CreatorDetails = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Use useNavigate instead of useHistory
  const agencyId = localStorage.getItem("agencyId");

  useEffect(() => {
    dispatch(getUser(agencyId));
  }, [dispatch, agencyId]);

  const handleOpenHostHistory = (id) => {
    navigate("/agencypanel/hosthistory", { state: { id } }); // Updated to use navigate
  };

  return (
    <div className="" style={{ borderRadius: "12px", paddingBottom: "28px" }}>
      <div
        className="p-2 creatorDetails"
        style={{
          background: "#33083e",
        }}
      >
        {user?.map((data) => (
          <div
            key={data?._id}
            className="p-2 creatorDetails"
            style={{
              background: "#33083e",
            }}
          >
            <div
              style={{
                borderRadius: "10px",
                paddingTop: "12px",
                background: "#3c134e",
                backgroundRepeat: "no-repeat",
                border: `1px solid rgba(255,255,255,0.12)`,
                padding: "13px",
              }}
            >
              <div className="bd-content">
                <div className="d-flex">
                  <div>
                    <img
                      src={data?.image ? data?.image : male}
                      style={{
                        height: "40px",
                        width: "40px",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                      alt=""
                    />
                  </div>
                  <div className="ms-3">
                    <div className="d-flex">
                      <p
                        className="mb-0 fw-bolder text-white"
                        style={{ fontSize: "15px" }}
                      >
                        {data?.name ? data?.name : "-"}
                      </p>
                      <button
                        className="text-white "
                        style={{
                          border: "none",
                          padding: "1px 10px",
                          background: "#7B11E3",
                          borderRadius: "6px",
                          marginLeft: "10px",
                        }}
                      >
                        {t("Host")}
                      </button>
                    </div>
                    <p
                      className="fw-bolder"
                      style={{ fontSize: "14px", color: "#EFCFE5" }}
                    >
                      {t("ID")} : {data?.uniqueId ? data?.uniqueId : "-"}
                    </p>
                  </div>
                </div>

                <div
                  className="d-flex justify-content-between align-items-center "
                  style={{ width: "100%" }}
                >
                  <div
                    style={{
                      background: T.gradPink2,
                      color: "#fff",
                      padding: "3px 8px",
                      borderRadius: 8,
                      fontWeight: 600,
                      fontSize: 14,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      boxShadow: T.shadow,
                    }}
                  >
                    <span style={{ fontWeight: 400 }}>
                      {t("host_income")} :
                    </span>
                    <img src={rCoin} alt="" height={20} width={20} />
                    {data?.currentCoin ? data?.currentCoin : 0}
                  </div>

                  <button
                    style={{ border: "none", background: "none" }}
                    onClick={() => handleOpenHostHistory(data?._id)}
                  >
                    <p
                      className="mb-0 history"
                      style={{
                        color: "#E2CAD9",
                        fontWeight: 600,
                        fontSize: "14px",
                      }}
                    >
                      {t("history")}
                      <img
                        src={leftArrow}
                        alt=""
                        height={22}
                        width={22}
                        style={{ marginLeft: "5px" }}
                      />
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
