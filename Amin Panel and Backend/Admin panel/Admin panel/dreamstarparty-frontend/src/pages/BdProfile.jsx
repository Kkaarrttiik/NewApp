import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiInstanceFetch } from "../util/api";
import { baseURL } from "../util/Config";

const profileData = {
  _id: "69ae5d0f65fca2fbac1e2c71",
  user: {
    _id: "69ae442a2864b0ec56c7e5f7",
    name: "Test Normal User 10",
    image: `${baseURL}storage/female.png`,
    uniqueId: 900209,
    bankDetails: "",
  },
  name: "Random test",
  image: `${baseURL}storage/female.png`,
  mobile: "8787878787",
  uniqueId: 900209,
  bdCode: "BD-260309-3946",
  regions: [
    { _id: "69ae44292864b0ec56c7e58c", name: "Test Region South" },
    { _id: "69ae44292864b0ec56c7e58d", name: "Test Region East" },
  ],
  rCoin: 3000,
  totalWithdrawn: 0,
  netCoin: 150,
  isActive: true,
  createdAt: "2026-03-09T05:39:27.980Z",
  totalAgencies: 0,
};

const BDProfilePage = () => {
  const location = useLocation();
  const [data, setData] = useState(profileData);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const id = location.state?.id;

  useEffect(() => {
    if (!id) {
      navigate("/admin/bd");
      return;
    }
    apiInstanceFetch.get(`bd/profile?bdId=${id}`).then((res) => {
      if (res.status) setData(res.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <div className="spinner-border text-danger" role="status" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center mt-5" style={{ color: "#7a8295" }}>
        Profile not found.
      </div>
    );
  }

  const createdDate = new Date(data?.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <div className="row">
        <div className="col-12 col-md-6 order-md-1 order-last mb-4">
          <button
            className="btn btn-danger custom-btn"
            onClick={() => navigate("/admin/bd")}
          >
            <i className="fas fa-chevron-left"></i> Go Back
          </button>

        
        </div>
        <div className="col-12 col-md-6 order-md-2 order-first">
          <nav
            aria-label="breadcrumb"
            className="breadcrumb-header float-start float-lg-end"
          >
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/admin/dashboard" className="text-danger">
                  Dashboard
                </Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/admin/bd" className="text-danger">
                  Bd
                </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Profile
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <div
        style={{
          backgroundColor: "#0f1523",
          minHeight: "100vh",
          color: "#c8cdd8",
        }}
      >
        {/* Cover Banner */}
        <div
          style={{
            height: "200px",
            background:
              "linear-gradient(135deg, #1a1f35 0%, #2a1a3a 50%, #1a2535 100%)",
            position: "relative",
            backgroundImage:
              "url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1200&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, #0f1523, transparent)",
            }}
          />
        </div>

        <div
          className="container-fluid px-2 px-sm-3 px-md-5"
          style={{
            marginTop: "-70px",
            position: "relative",
            zIndex: 10,
            paddingBottom: "40px",
          }}
        >
          {/* Profile Header */}
          <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-end gap-3 mb-4">
            <img
              src={data?.image}
              alt={data?.name}
              className="rounded-circle border border-3"
              style={{
                width: "110px",
                height: "110px",
                objectFit: "cover",
                borderColor: "#0f1523 !important",
                boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
              }}
            />
            <div className="pb-1">
              <h1 className="h4 fw-bold mb-0" style={{ color: "#e8ecf4" }}>
                {data?.name}
              </h1>
              <p className="mb-1 small" style={{ color: "#7a8295" }}>
                {data?.user?.name}
              </p>
              <div className="d-flex gap-2 flex-wrap">
                <span
                  className="badge"
                  style={{
                    backgroundColor: "rgba(219, 59, 130, 0.2)",
                    color: "#db3b82",
                  }}
                >
                  {data?.bdCode}
                </span>
                <span
                  className="badge"
                  style={{
                    backgroundColor: data?.isActive
                      ? "rgba(34, 197, 94, 0.2)"
                      : "rgba(239, 68, 68, 0.2)",
                    color: data?.isActive ? "#22c55e" : "#ef4444",
                  }}
                >
                  {data?.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <ul
            className="nav nav-tabs border-0 mb-4"
            style={{ borderBottom: "1px solid #1e2538 !important" }}
          >
            {["Overview"].map((tab, i) => (
              <li className="nav-item" key={tab}>
                <a
                  className="nav-link border-0 px-3 py-2"
                  href="#"
                  style={{
                    color: i === 0 ? "#db3b82" : "#7a8295",
                    borderBottom: i === 0 ? "2px solid #db3b82" : "none",
                    backgroundColor: "transparent",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  {tab}
                </a>
              </li>
            ))}
          </ul>

          <div className="row g-4">
            {/* Left Column */}
            <div className="col-lg-4">
              {/* About Card */}
              <div
                className="card mb-4"
                style={{
                  backgroundColor: "#151b2e",
                  border: "1px solid #1e2538",
                  borderRadius: "12px",
                }}
              >
                <div className="card-body p-4">
                  <h5
                    className="fw-semibold mb-3"
                    style={{ color: "#e8ecf4", fontSize: "16px" }}
                  >
                    About
                  </h5>
                  <InfoRow icon="fa-user" label="Name" value={data?.name} />
                  <InfoRow
                    icon="fa-hashtag"
                    label="Unique ID"
                    value={data?.uniqueId}
                    highlight
                  />
                  <InfoRow
                    icon="fa-shield"
                    label="BD Code"
                    value={data?.bdCode}
                    highlight
                  />
                  <InfoRow
                    icon="fa-phone"
                    label="Mobile"
                    value={data?.mobile}
                    highlight
                  />
                  <InfoRow
                    icon="fa-toggle-on"
                    label="Status"
                    value={data?.isActive ? "Active" : "Inactive"}
                  />
                  <InfoRow
                    icon="fa-calendar"
                    label="Created"
                    value={createdDate}
                    highlight
                    last
                  />
                </div>
              </div>

              {/* Regions Card */}
              <div
                className="card mb-4"
                style={{
                  backgroundColor: "#151b2e",
                  border: "1px solid #1e2538",
                  borderRadius: "12px",
                }}
              >
                <div className="card-body p-4">
                  <h5
                    className="fw-semibold mb-3"
                    style={{ color: "#e8ecf4", fontSize: "16px" }}
                  >
                    Regions
                  </h5>

                  <div className="d-flex flex-wrap gap-2">
                    {data?.regions.length === 0 ? (
                      <p style={{ color: "#475569", fontSize: 13, margin: 0 }}>
                        No regions assigned
                      </p>
                    ) : (
                      data?.regions.map((region) => (
                        <span
                          key={region._id}
                          className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-3"
                          style={{
                            backgroundColor: "#1a2035",
                            color: "#c8cdd8",
                            fontSize: "14px",
                          }}
                        >
                          <i
                            className="fa-solid fa-location-dot"
                            style={{ color: "#db3b82", fontSize: "12px" }}
                          />
                          {region.name}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Linked User Card */}
              <div
                className="card mb-4"
                style={{
                  backgroundColor: "#151b2e",
                  border: "1px solid #1e2538",
                  borderRadius: "12px",
                }}
              >
                <div className="card-body p-4">
                  <h5
                    className="fw-semibold mb-3"
                    style={{ color: "#e8ecf4", fontSize: "16px" }}
                  >
                    Linked User
                  </h5>
                  {data.user ? (
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={data?.user?.image}
                        alt={data?.user?.name}
                        className="rounded-circle"
                        style={{ width: "40px", height: "40px" }}
                      />
                      <div>
                        <p
                          className="mb-0 fw-medium"
                          style={{ color: "#e8ecf4", fontSize: "14px" }}
                        >
                          {data?.user?.name}
                        </p>
                        <p
                          className="mb-0"
                          style={{ color: "#7a8295", fontSize: "12px" }}
                        >
                          ID: {data?.user?.uniqueId}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p style={{ color: "#475569", fontSize: 13, margin: 0 }}>
                      No user linked
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-lg-8">
              {/* Stats Grid */}
              <div className="row g-3 mb-4">
                <StatCard
                  icon="fa-coins"
                  label="rCoin"
                  value={data?.rCoin.toLocaleString()}
                />
                <StatCard
                  icon="fa-gem"
                  label="Net Coin"
                  value={data?.netCoin.toLocaleString()}
                />
                <StatCard
                  icon="fa-wallet"
                  label="Withdrawn"
                  value={data?.totalWithdrawn.toLocaleString()}
                />
                <StatCard
                  icon="fa-building"
                  label="Agencies"
                  value={data?.totalAgencies}
                />
              </div>

              {/* Empty Feed */}
              <div
                className="card d-flex align-items-center justify-content-center"
                style={{
                  backgroundColor: "#151b2e",
                  border: "1px solid #1e2538",
                  borderRadius: "12px",
                  minHeight: "200px",
                }}
              >
                <p
                  className="mb-0"
                  style={{ color: "#7a8295", fontSize: "14px" }}
                >
                  Nothing to show!!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const InfoRow = ({ icon, label, value, highlight = false, last = false }) => (
  <div
    className="d-flex align-items-center gap-3 py-2"
    style={{ borderBottom: last ? "none" : "1px solid rgba(30, 37, 56, 0.5)" }}
  >
    <i
      className={`fa fa-solid ${icon}`}
      style={{
        color: "#7a8295",
        fontSize: "13px",
        width: "16px",
        textAlign: "center",
      }}
    />
    <span style={{ color: "#7a8295", fontSize: "14px" }}>{label}</span>
    <span
      className="ms-auto fw-medium"
      style={{ color: highlight ? "#db3b82" : "#e8ecf4", fontSize: "14px" }}
    >
      {value}
    </span>
  </div>
);

const StatCard = ({ icon, label, value }) => (
  <div className="col-6 col-sm-3">
    <div
      className="text-center p-3 rounded-3"
      style={{ backgroundColor: "#1a2035" }}
    >
      <i
        className={`fa fa-solid ${icon} mb-2`}
        style={{ color: "#db3b82", fontSize: "18px" }}
      />
      <p
        className="fw-bold mb-1"
        style={{ color: "#e8ecf4", fontSize: "20px" }}
      >
        {value}
      </p>
      <p className="mb-0" style={{ color: "#7a8295", fontSize: "12px" }}>
        {label}
      </p>
    </div>
  </div>
);

export default BDProfilePage;
