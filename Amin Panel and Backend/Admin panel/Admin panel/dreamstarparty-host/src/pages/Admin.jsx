import React, { forwardRef, useEffect, useState } from "react";

// js
import "../assets/js/main.min";

//router
import { NavLink as Link } from "react-router-dom";

// css
import "../assets/css/main.min.css";
import "../assets/css/custom.css";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// component

import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../store/admin/action";
import male from "../assets/images/male.png";
import moment from "moment";
import {
  getHostEarning,
  getHosthistory,
} from "../store/history/history.action";
import DailyIncome from "./history/DailyIncome";
import VideoCall from "./history/VideoCall";
import rCoin from "../assets/images/r coin 2.png";
import leftArrow from "../assets/images/leftArrow.png";
// import { getLiveRoomHistory } from "../store/liveRoom/action";
// import { getChatRoomHistory } from "../store/chatRoom/action";
import { getVideoCallHistory } from "../store/videoCall/action";
import { permissionError } from "../util/Alert";
import { Toast } from "../util/Toast";
import HostSettlement from "./HostSettlement";
import gredientImage from "../assets/images/pinkcard.png";
import gredientImage1 from "../assets/images/purplecard.png";
import Diamond from "../assets/images/diamond.png";
import Copy from "../assets/images/copy.svg";
import useTranslation from "../hooks/useTranslation";

const Admin = () => {
  // colors pulled together for quick tweaking
  const UI = {
    bg: "#490B60",
    headerBg: "#490B60",
    cardEdge: "#372143",
    cardBg: "#3A124C",
    cardBgTop: "#48195E",
    accent: "#FFC524",
    subtext: "#EFCFE5",
    text: "#FFFFFF",
    tabInactive: "#9C86AC",
    pillText: "#EE0E74",
    gradient:
      "linear-gradient(90deg, rgba(117,75,214,1) 0%, rgba(255,64,122,1) 100%)",
    softGlow: "0 8px 24px rgba(255, 28, 96, 0.35), 0 2px 8px rgba(0,0,0,0.25)",
  };

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const admin = useSelector((state) => state.admin.seller);
  const hostHistory = useSelector((state) => state.history.hostHistory);
  const hostId = localStorage.getItem("hostId");

  const currentMonth = moment().format("YYYY-MM");

  const [selectedDate, setSelectedDate] = useState(currentMonth);
  const [type, setType] = useState(1);

  useEffect(() => {
    dispatch(getProfile(hostId));
    dispatch(getHosthistory(currentMonth, hostId));
    dispatch(getHostEarning(hostId, currentMonth));
    dispatch(getVideoCallHistory(hostId, currentMonth));
    // dispatch(getChatRoomHistory(hostId, currentMonth));
    // dispatch(getLiveRoomHistory(hostId, currentMonth));
  }, [dispatch, currentMonth, hostId]);

  const handleDateChange = (date) => {
    const selectedDateObject = moment(date).format("YYYY-MM");
    setSelectedDate(selectedDateObject);
    dispatch(getHosthistory(selectedDateObject, hostId));
    dispatch(getHostEarning(hostId, selectedDateObject));
    dispatch(getVideoCallHistory(hostId, selectedDateObject));
    // dispatch(getChatRoomHistory(hostId, selectedDateObject));
    // dispatch(getLiveRoomHistory(selectedDateObject));
  };

  const handleBack = () => {
    window.showAndroidToast();
  };

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <button
      onClick={onClick}
      ref={ref}
      // pill like in the screenshot
      style={{
        border: "none",
        borderRadius: 999,
        padding: "10px 16px",
        fontWeight: 600,
        fontSize: 16,
        background: "#FFFFFF",
        color: UI.pillText,
        boxShadow:
          "inset 0 0 0 1px rgba(0,0,0,0.05), 0 6px 16px rgba(0,0,0,0.25)",
        lineHeight: 1,
        cursor: "pointer",
      }}
      className="shadow-sm"
    >
      {value}
    </button>
  ));

  const handleCopy = async (link) => {
    if (admin?.isActive === false) return permissionError();
    try {
      await navigator.clipboard.writeText(link);
      Toast("success", `Copy Success.`);
    } catch (error) {
      console.error("Copy failed:", error);
      Toast("error", "Copy Failed");
    }
  };

  return (
    <>
      <div
        className="page-container"
        style={{ background: UI.bg, minHeight: "100vh" }}
      >
        <div className="page" style={{ background: UI.bg }}>
          <div className="main-wrapper p-0" style={{ background: UI.bg }}>
            <div className="main-section" style={{ background: UI.bg }}>
              {/* Header */}
              <div
                className="d-flex align-items-center justify-content-between px-3 py-4 mb-2"
                style={{
                  zIndex: 9,
                  position: "fixed",
                  width: "100%",
                  top: 0,
                  left: 0,
                  right: 0,
                  background: UI.headerBg,
                  borderBottom: "1px solid rgba(255, 255, 255, 0.28)",
                }}
              >
                <div className="d-flex align-items-center">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={handleBack}
                    style={{ cursor: "pointer" }}
                  >
                    <path
                      d="M1.18529 11.648L7.60196 18.0647C7.77484 18.2317 8.0064 18.3241 8.24674 18.322C8.48709 18.3199 8.717 18.2235 8.88696 18.0535C9.05692 17.8836 9.15332 17.6537 9.15541 17.4133C9.1575 17.173 9.0651 16.9414 8.89812 16.7685L4.04621 11.9166H20.1667C20.4098 11.9166 20.643 11.82 20.8149 11.6481C20.9868 11.4762 21.0834 11.2431 21.0834 11C21.0834 10.7568 20.9868 10.5237 20.8149 10.3518C20.643 10.1799 20.4098 10.0833 20.1667 10.0833H4.04621L8.89812 5.23137C8.98568 5.14681 9.05551 5.04566 9.10355 4.93382C9.15159 4.82198 9.17688 4.7017 9.17794 4.57999C9.179 4.45827 9.1558 4.33757 9.10971 4.22491C9.06362 4.11226 8.99555 4.00991 8.90949 3.92384C8.82342 3.83777 8.72107 3.7697 8.60842 3.72361C8.49576 3.67752 8.37506 3.65433 8.25334 3.65539C8.13163 3.65645 8.01134 3.68173 7.8995 3.72978C7.78767 3.77782 7.68652 3.84765 7.60196 3.9352L1.18529 10.3519C1.01344 10.5238 0.916904 10.7569 0.916904 11C0.916904 11.243 1.01344 11.4761 1.18529 11.648Z"
                      fill="white"
                    />
                  </svg>
                </div>

                <div className="text-center flex-grow-1">
                  <p
                    className="fw-bold mb-0"
                    style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: UI.text,
                      letterSpacing: 0.2,
                    }}
                  >
                    {t("host_center")}
                  </p>
                </div>
                <div style={{ width: "22px" }} />
              </div>

              <div className="" style={{ paddingTop: 78 }}>
                {/* Profile card with only background image */}
                <div className="responsive-bg">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center p-3">
                      <img
                        src={admin?.image ? admin?.image : male}
                        style={{
                          height: 60,
                          width: 60,
                          objectFit: "cover",
                          borderRadius: "50%",
                          border: "2px solid rgba(250, 250, 250, 1)",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                        }}
                        alt=""
                      />
                      <div className="ms-3">
                        <p
                          className="mb-0 text-white"
                          style={{
                            fontSize: 18,
                            fontWeight: 700,
                            lineHeight: 1.1,
                          }}
                        >
                          {admin?.name ? admin?.name : "-"}
                        </p>
                        <p
                          className="mb-0 mt-1"
                          style={{
                            fontSize: 12,
                            color: UI.subtext,
                            fontWeight: 500,
                          }}
                        >
                          {t("unique_id")} : {admin?.uniqueId}
                        </p>
                      </div>
                    </div>

                    <div className="date-picker d-flex justify-content-end p-3">
                      <DatePicker
                        selected={selectedDate}
                        dateFormat="yyyy/MM"
                        showMonthYearPicker
                        onChange={(date) => handleDateChange(date)}
                        customInput={<ExampleCustomInput />}
                        popperPlacement="bottom-end"
                      />
                    </div>
                  </div>
                </div>

                {/* Diamond + incomes card */}
                <div
                  className="mt-4"
                  style={{
                    border: `1px solid #ffffff4d`,
                    borderRadius: 16,
                    overflow: "hidden",
                    backdropFilter: "blur(2px)",
                    margin: "0px 10px",
                  }}
                >
                  <div
                    className="d-flex justify-content-between align-items-center px-3 py-3"
                    style={{
                      background: UI.cardBgTop,
                    }}
                  >
                    <h3
                      className="mt-1"
                      style={{
                        fontWeight: 600,
                        color: UI.accent,
                        fontSize: 16,
                        letterSpacing: 0.2,
                        marginBottom: 0,
                      }}
                    >
                      {t("diamond")}
                    </h3>

                    <p
                      className="mt-1 mb-0 d-flex align-items-center"
                      style={{
                        fontWeight: 600,
                        color: UI.accent,
                        fontSize: 16,
                      }}
                    >
                      <img
                        src={Diamond}
                        alt=""
                        height={22}
                        width={22}
                        style={{ marginRight: 8 }}
                      />
                      {admin?.diamond ? admin?.diamond.toFixed(0) : 0}
                    </p>
                  </div>

                  <div style={{ background: UI.cardBg }}>
                    <div
                      className="d-flex justify-content-between align-items-center px-3 py-3"
                      style={{
                        borderTop: `1px solid ${UI.cardEdge}`,
                        borderBottom: `1px solid ${UI.cardEdge}`,
                      }}
                    >
                      <h3
                        className="mt-1 mb-0"
                        style={{
                          fontWeight: 400,
                          fontSize: 14,
                          color: "#DCC8E8",
                        }}
                      >
                        {t("this_week_income")}
                      </h3>

                      <p
                        className="mt-1 mb-0 d-flex align-items-center"
                        style={{
                          fontWeight: 600,
                          color: UI.accent,
                          fontSize: 16,
                        }}
                      >
                        <img
                          src={rCoin}
                          alt=""
                          height={22}
                          width={22}
                          style={{ marginRight: 8 }}
                        />
                        {admin?.rCoin ? admin?.rCoin.toFixed(0) : 0}
                      </p>
                    </div>
                    <div
                      className="d-flex justify-content-between align-items-center px-3 py-3"
                      style={{
                        borderTop: `1px solid ${UI.cardEdge}`,
                        borderBottom: `1px solid ${UI.cardEdge}`,
                      }}
                    >
                      <h3
                        className="mt-1 mb-0"
                        style={{
                          fontWeight: 400,
                          fontSize: 14,
                          color: "#DCC8E8",
                        }}
                      >
                        {t("spent_coin")}
                      </h3>

                      <p
                        className="mt-1 mb-0 d-flex align-items-center"
                        style={{
                          fontWeight: 600,
                          color: UI.accent,
                          fontSize: 16,
                        }}
                      >
                        <img
                          src={rCoin}
                          alt=""
                          height={22}
                          width={22}
                          style={{ marginRight: 8 }}
                        />
                        {admin?.rCoin ? admin?.spentCoin.toFixed(0) : 0}
                      </p>
                    </div>

                    {/* Keep logic same; if you later have month value, it will slot in */}
                    {/* Visual spacer to resemble second row from screenshot (optional, no logic change) */}
                    {/* <div className="px-3 py-2" style={{ opacity: 0.001 }} /> */}
                  </div>
                </div>

                {/* My Agency card */}
                <div className="p-2 mt-3 responsive-bg2">
                  <div className="d-flex align-items-center justify-content-between p-2">
                    <span
                      className="fw-bold mb-0 "
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#FFFFFF",
                        padding: "8px 16px",
                        borderRadius: 10,
                        // background: "#FFFFFF",
                        border: "none",
                      }}
                    >
                      {t("my_agency")}
                    </span>

                    <div className="text-end">
                      <div className="d-flex align-items-center justify-content-end">
                        <img
                          src={
                            !admin?.hostAgency?.image?.includes("\\")
                              ? admin?.hostAgency?.image
                              : male
                          }
                          style={{
                            height: 30,
                            width: 30,
                            objectFit: "cover",
                            borderRadius: "44px",
                            border: "1px solid rgba(255, 255, 255, 0.94)",
                          }}
                          alt=""
                        />
                        <h6
                          className="fw-bold ms-2 mb-0 text-white"
                          style={{ fontSize: 16, fontWeight: 600 }}
                        >
                          {admin?.hostAgency?.name
                            ? admin?.hostAgency?.name
                            : "-"}
                        </h6>
                      </div>

                      <div className="d-flex align-items-center justify-content-end mt-2">
                        <h6
                          className="fw-bold mb-0 text-white"
                          style={{
                            fontSize: 14,
                            fontWeight: 500,
                            opacity: 0.95,
                          }}
                        >
                          {t("id")} :{" "}
                          {admin?.hostAgency?.uniqueId
                            ? admin?.hostAgency?.uniqueId
                            : "-"}
                        </h6>
                        <button
                          className="ms-1 pe-0"
                          style={{
                            border: "none",
                            backgroundColor: "transparent",
                            lineHeight: 0,
                          }}
                          onClick={() =>
                            handleCopy(admin?.hostAgency?.uniqueId)
                          }
                          aria-label={t("Copy agency ID")}
                          title={t("Copy")}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10 2.5H3C2.17157 2.5 1.5 3.17157 1.5 4V14C1.5 14.8284 2.17157 15.5 3 15.5H10C10.8284 15.5 11.5 14.8284 11.5 14V4C11.5 3.17157 10.8284 2.5 10 2.5Z"
                              fill="white"
                            />
                            <path
                              d="M14.4998 2V12C14.4987 12.3975 14.3402 12.7783 14.0592 13.0593C13.7781 13.3404 13.3973 13.4988 12.9998 13.5H12.4998V4C12.4998 3.33696 12.2365 2.70107 11.7676 2.23223C11.2988 1.76339 10.6629 1.5 9.99984 1.5H4.58984C4.693 1.20823 4.88388 0.955499 5.13631 0.776469C5.38874 0.597439 5.69037 0.50087 5.99984 0.5H12.9998C13.3973 0.501187 13.7781 0.659603 14.0592 0.940651C14.3402 1.2217 14.4987 1.60254 14.4998 2Z"
                              fill="white"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div
                  className="d-flex flex-wrap justify-content-center align-items-center mt-3 mb-0"
                  style={{
                    // borderBottom: "1px solid rgba(255,255,255,0.08)",.
                    background: "#361746",
                    padding: "14px 5px 0px 5px",
                    gap: "10px",
                  }}
                >
                  <TabLabel
                    label={t("payment_history")}
                    active={type === 2}
                    onClick={() => setType(2)}
                    UI={UI}
                  />
                  <TabLabel
                    label={t("daily_income")}
                    active={type === 1}
                    onClick={() => setType(1)}
                    UI={UI}
                  />
                  <TabLabel
                    label={t("call")}
                    active={type === 3}
                    onClick={() => setType(3)}
                    UI={UI}
                  />
                </div>

                {/* Content (unchanged functionality) */}
                {type === 1 && <DailyIncome />}
                {type === 2 && <HostSettlement />}
                {type === 3 && <VideoCall />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Small presentational component for tab label (no logic change)
const TabLabel = ({ label, active, onClick, UI }) => {
  return (
    <div
      className="text-center"
      style={{
        paddingBottom: 0,
        cursor: "pointer",
        // minWidth: "unset",
        flex: "1 1 0"
      }}
      onClick={onClick}
    >
      <div
        className={`mb-0`}
        style={{
          fontSize: 14,
          fontWeight: active ? 500 : 400,
          color: active ? "#FF0C8A" : UI.tabInactive,
          transition: "color .2s ease",
          whiteSpace: "nowrap"
        }}
      >
        {label}
      </div>
      <div
        style={{
          height: 3,
          width: 56,
          margin: "8px auto 0px auto",
          borderRadius: "5px 5px 0px 0px",
          background: active ? "#FF0C8A" : "transparent",
          boxShadow: active ? "0 2px 8px rgba(255,28,96,.5)" : "none",
          transition: "all .2s ease",
        }}
      />
    </div>
  );
};

export default Admin;
