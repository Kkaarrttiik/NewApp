import { useState } from "react";
import FakeVideo from "../component/table/FakeVideo";
import RealVideo from "../component/table/Video";

const MainVideo = () => {
  const [type, setType] = useState(() => {
    return localStorage.getItem("videoTab") || "realVideo";
  });

  const handleTabChange = (newType) => {
    setType(newType);
    localStorage.setItem("videoTab", newType);
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
                  background: type === "realVideo" ? "#0f766e" : "#1a1f2e",
                  color: type === "realVideo" ? "#99f6e4" : "#6b7280",
                  border: `1px solid ${type === "realVideo" ? "#0f766e" : "#2a3050"}`,
                  borderRadius: 6,
                  transition: "0.2s",
                }}
                onClick={() => handleTabChange("realVideo")}
              >
                Real Video
              </button>
              <button
                type="button"
                className="btn btn-sm"
                style={{
                  background: type === "fakeVideo" ? "#c0392b" : "#1a1f2e",
                  color: type === "fakeVideo" ? "#fff" : "#6b7280",
                  border: `1px solid ${type === "fakeVideo" ? "#c0392b" : "#2a3050"}`,
                  borderRadius: 6,
                  transition: "0.2s",
                }}
                onClick={() => handleTabChange("fakeVideo")}
              >
                Fake Video
              </button>
            </div>
          </div>
        </div>
      </div>
      {type === "realVideo" ? (
        <RealVideo type={type} />
      ) : (
        type === "fakeVideo" && <FakeVideo type={type} />
      )}
    </div>
  );
};

export default MainVideo;
