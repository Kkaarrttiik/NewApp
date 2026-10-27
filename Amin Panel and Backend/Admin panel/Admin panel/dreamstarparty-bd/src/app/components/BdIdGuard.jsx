import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router";
import { setBdId, setBdValid, setBdInvalid } from "../store/bdSlice";

export default function BdIdGuard({ children }) {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { isValid, error } = useSelector((state) => state.bd);

  useEffect(() => {
    const urlBdId = searchParams.get("bdid")?.trim();
    const storedBdId = localStorage.getItem("bdId");

    if (urlBdId) {
      dispatch(setBdId(urlBdId));
      dispatch(setBdValid());
    } else if (storedBdId) {
      dispatch(setBdId(storedBdId));
      dispatch(setBdValid());
    } else {
      // No bdId anywhere — block access
      dispatch(setBdInvalid("missing"));
    }
  }, []);

  // Still checking
  if (isValid === null && error === null) {
    return (
      <div style={styles.screen}>
        <div style={styles.spinner} />
      </div>
    );
  }

  // BD ID missing
  if (error === "missing") {
    return (
      <div style={styles.screen}>
        <div style={styles.card}>
          <div style={styles.iconWrap}>
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#f87171"
              strokeWidth="1.8"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 style={styles.title}>Access Denied</h2>
          <p style={styles.desc}>
            No BD ID was provided. Please use a valid link that includes your BD
            ID.
          </p>
          <div style={styles.codeBlock}>
            <code style={styles.code}>
              https://yourapp.com/?bdid=YOUR_BD_ID
            </code>
          </div>
          <p style={styles.hint}>
            Contact your administrator if you believe this is a mistake.
          </p>
        </div>
      </div>
    );
  }

  // BD ID invalid (rejected by API)
  if (error === "invalid") {
    return (
      <div style={styles.screen}>
        <div style={styles.card}>
          <div style={styles.iconWrap}>
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#f87171"
              strokeWidth="1.8"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <h2 style={styles.title}>Invalid BD ID</h2>
          <p style={styles.desc}>
            The BD ID in your link is not recognized or has been deactivated.
          </p>
          <p style={styles.hint}>
            Please check your link or contact your administrator.
          </p>
        </div>
      </div>
    );
  }

  return children;
}

const styles = {
  screen: {
    minHeight: "100vh",
    backgroundColor: "#0f1117",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "system-ui, sans-serif",
  },
  card: {
    backgroundColor: "#1a1d27",
    border: "1px solid #2a2d3a",
    borderRadius: "16px",
    padding: "48px 40px",
    maxWidth: "420px",
    width: "100%",
    textAlign: "center",
  },
  iconWrap: { marginBottom: "20px" },
  title: {
    color: "#f1f1f1",
    fontSize: "22px",
    fontWeight: "600",
    margin: "0 0 12px",
  },
  desc: {
    color: "#9ca3af",
    fontSize: "14px",
    lineHeight: "1.6",
    margin: "0 0 20px",
  },
  codeBlock: {
    backgroundColor: "#0f1117",
    border: "1px solid #2a2d3a",
    borderRadius: "8px",
    padding: "12px 16px",
    marginBottom: "20px",
    wordBreak: "break-all",
  },
  code: { color: "#e879a0", fontSize: "12px" },
  hint: { color: "#6b7280", fontSize: "13px", margin: 0 },
  spinner: {
    width: "32px",
    height: "32px",
    border: "3px solid #2a2d3a",
    borderTop: "3px solid #e879a0",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};
