import React from "react";
import { useSelector } from "react-redux";
import useTranslation from "../../hooks/useTranslation";
import diamondIcon from "../../assets/images/diamond.png";

const VideoCall = () => {
  const { t } = useTranslation();
  const { videoCallHistory } = useSelector((state) => state.videoCallHistory);

  return (
    <div style={{ padding: "16px", maxWidth: "600px", margin: "0 auto" }}>
      {videoCallHistory?.length > 0 ? (
        videoCallHistory.map((data, index) => (
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
            {/* Diamond Row */}
            {data?.type === 20 && (
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
                <span style={{ color: "#b19cd9", fontSize: "14px" }}>{t("diamond")}</span>
                <span
                  style={{
                    color: "#ffffff",
                    fontSize: "14px",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <img src={diamondIcon} alt="diamond" height={18} width={18} />
                  {data?.diamond ? data?.diamond : 0}
                </span>
              </div>
            )}

            {/* Date Row */}
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
              <span style={{ color: "#b19cd9", fontSize: "14px" }}>{t("date")}</span>
              <span
                style={{
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                {data?.date ? data?.date : "-"}
              </span>
            </div>

            {/* Duration Row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ color: "#b19cd9", fontSize: "14px" }}>
               {t("duration_sec")}
              </span>
              <span
                style={{
                  color: "#FF1C60",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                {data?.callDurationSeconds ? data?.callDurationSeconds : 0}
              </span>
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

export default VideoCall;
