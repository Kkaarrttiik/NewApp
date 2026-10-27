import { useState } from "react";
import FakePost from "../component/table/FakePost";
import RealPost from "../component/table/Post";

const MainPost = () => {
  const [type, setType] = useState(() => {
    return localStorage.getItem("postTab") || "realPost";
  });

  const handleTabChange = (newType) => {
    setType(newType);
    localStorage.setItem("postTab", newType);
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
                  background: type === "realPost" ? "#0f766e" : "#1a1f2e",
                  color: type === "realPost" ? "#99f6e4" : "#6b7280",
                  border: `1px solid ${type === "realPost" ? "#0f766e" : "#2a3050"}`,
                  borderRadius: 6,
                  transition: "0.2s",
                }}
                onClick={() => handleTabChange("realPost")}
              >
                Real Post
              </button>
              <button
                type="button"
                className="btn btn-sm"
                style={{
                  background: type === "fakePost" ? "#c0392b" : "#1a1f2e",
                  color: type === "fakePost" ? "#fff" : "#6b7280",
                  border: `1px solid ${type === "fakePost" ? "#c0392b" : "#2a3050"}`,
                  borderRadius: 6,
                  transition: "0.2s",
                }}
                onClick={() => handleTabChange("fakePost")}
              >
                Fake Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {type === "realPost" ? (
        <RealPost type={type} />
      ) : (
        type === "fakePost" && <FakePost type={type} />
      )}
    </div>
  );
};

export default MainPost;
