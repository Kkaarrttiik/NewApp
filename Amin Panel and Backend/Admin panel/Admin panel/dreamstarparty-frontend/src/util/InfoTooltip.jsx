// components/common/InfoTooltip.js
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import IconButton from "@mui/material/IconButton";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import React from "react";

// Custom styled tooltip
const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#fff",
    color: "#1f1f1f",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
    fontSize: "13px",
    borderRadius: "8px",
    padding: "12px 14px",
    maxWidth: 350,
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#fff",
  },
}));

const InfoTooltip = ({ title = "", content = [] }) => {
  return (
    <LightTooltip
      arrow
      placement="bottom"
      title={
        <div>
          {title && (
            <h6 style={{ margin: "0 0 8px 0", fontWeight: 600 }}>{title}</h6>
          )}

          {Array.isArray(content) &&
            content.map((item, index) => (
              <div key={index} style={{ marginBottom: "8px" }}>
                {item.label && (
                  <strong style={{ display: "block", marginBottom: 2 }}>
                    {item.label}
                  </strong>
                )}
                {item.description && (
                  <p
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      lineHeight: "1.4",
                    }}
                  >
                    {item.description}
                  </p>
                )}
              </div>
            ))}
        </div>
      }
    >
      <IconButton size="small">
        <InfoOutlinedIcon fontSize="small" sx={{ color: "#ffffff" }} />
      </IconButton>
    </LightTooltip>
  );
};

export default InfoTooltip;
