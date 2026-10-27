import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Award,
  ChevronRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format } from "date-fns";

import {
  fetchDashboardCards,
  fetchRevenueTrend,
  fetchTopAgencies,
  fetchTopHosts,
} from "../store/dashboardSlice";
import rCoin from "../../images/rcoin.webp";
import DateRangeModal from "../components/DateRangeModal";
import useTranslation from "../../util/useTranslation";

const C = {
  bg: "#0F172A",
  card: "#111827",
  border: "#1F2937",
  hover: "#1E293B",
  pink: "#FF4D8D",
  pinkGlow: "rgba(255,77,141,0.25)",
  green: "#34D399",
  cyan: "#22D3EE",
  orange: "#FB923C",
  purple: "#A78BFA",
  red: "#F87171",
  textPrimary: "#F9FAFB",
  textSecondary: "#9CA3AF",
  textMuted: "#6B7280",
};

const fmtCompact = (val) => {
  const n = Number(val);
  if (isNaN(n)) return val ?? "0";
  if (n >= 1_000_000)
    return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 10_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
};
const fmtFull = (n) => `$${n.toLocaleString()}`;

function KpiCard({
  icon: Icon,
  label,
  value,
  color,
  loading,
  showCoin = false,
}) {
  return (
    <div
      className="rounded-xl border p-5 flex flex-col gap-3 transition-all duration-200 cursor-default"
      style={{
        background: C.card,
        borderColor: C.border,
        boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 10px 30px ${C.pinkGlow}`;
        e.currentTarget.style.borderColor = "rgba(255,77,141,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.4)";
        e.currentTarget.style.borderColor = C.border;
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: `${color}18` }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <p className="text-xs font-medium mb-1" style={{ color: C.textMuted }}>
          {label}
        </p>
        {loading ? (
          <div
            className="h-7 w-24 rounded-md animate-pulse"
            style={{ background: C.border }}
          />
        ) : (
          <div className="flex items-center gap-2">
            {showCoin && <img height={20} width={20} src={rCoin} alt="rCoin" />}
            <p
              className="font-bold"
              style={{ color: C.textPrimary, fontSize: 22 }}
            >
              {value}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl border p-3 text-xs"
      style={{
        background: "#1F2937",
        borderColor: "#374151",
        boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
      }}
    >
      <p className="font-semibold mb-2" style={{ color: C.textPrimary }}>
        {label}
      </p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex justify-between gap-4">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="font-medium" style={{ color: C.textPrimary }}>
            {fmtFull(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const {
    cards,
    loading,
    error,
    revenueTrend,
    trendLoading,
    topAgencies,
    topAgenciesLoading,
    topHosts,
    topHostsLoading,
  } = useSelector((state) => state.dashboard);

  // ✅ Helper: format Date → "yyyy-MM-dd" string, or null
  const toStr = (d) => (d ? format(d, "yyyy-MM-dd") : null);

  // ✅ Central fetch function — always passes current dates directly to thunks
  const fetchAll = (start, end) => {
    const params = { startDate: toStr(start), endDate: toStr(end) };
    dispatch(fetchDashboardCards(params));
    dispatch(fetchRevenueTrend(params));
    dispatch(fetchTopAgencies(params));
    dispatch(fetchTopHosts(params));
  };

  // Initial load with no dates
  useEffect(() => {
    fetchAll(null, null);
  }, [dispatch]);

  // ✅ On apply: update local state + immediately fetch with new dates
  const handleApply = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    fetchAll(start, end); // dates passed directly — no Redux race condition
  };

  // ✅ On clear: reset local state + fetch with no dates
  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    fetchAll(null, null);
  };

  const kpis = [
    {
      icon: Building2,
      label: t("dashboard_total_agencies"), // "Total Agencies" / "कुल एजेंसियां"
      value: String(cards?.totalAgencies),
      color: C.pink,
      showCoin: false,
    },
    {
      icon: Users,
      label: t("dashboard_total_hosts"), // "Total Hosts" / "कुल होस्ट"
      value: String(cards?.totalHosts),
      color: C.cyan,
      showCoin: false,
    },
    {
      icon: DollarSign,
      label: t("dashboard_host_earnings"), // "Host Earnings" / "होस्ट की कमाई"
      value: fmtCompact(cards?.hostEarnings),
      color: C.green,
      showCoin: true,
    },
    {
      icon: Award,
      label: t("dashboard_agency_earnings"), // "Agency Earnings" / "एजेंसी की कमाई"
      value: fmtCompact(cards?.agencyCommission),
      color: C.orange,
      showCoin: true,
    },
    {
      icon: TrendingUp,
      label: t("dashboard_bd_commission"), // "BD Commission" / "BD कमीशन"
      value: fmtCompact(cards?.bdCommission),
      color: C.purple,
      showCoin: true,
    },
  ];

  const chartData = revenueTrend.map((item) => ({
    date: item._id.date,
    hostEarnings: item.hostEarnings,
    agencyCommission: item.agencyCommission,
    bdCommission: item.bdCommission,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2
            className="text-sm font-semibold"
            style={{ color: C.textPrimary }}
          >
            {t("dashboard_overview")}
          </h2>
          <p className="text-xs mt-0.5" style={{ color: C.textMuted }}>
            {startDate && endDate
              ? `${format(startDate, "dd MMM yyyy")} → ${format(endDate, "dd MMM yyyy")}`
              : t("dashboard_showing_all_time")}
          </p>
        </div>
        <DateRangeModal
          startDate={startDate ?? undefined}
          endDate={endDate ?? undefined}
          onApply={handleApply}
          onClear={handleClear}
        />
      </div>

      {error && (
        <div
          className="rounded-xl border px-4 py-3 text-sm flex items-center gap-2"
          style={{
            background: "rgba(248,113,113,0.08)",
            borderColor: "rgba(248,113,113,0.25)",
            color: C.red,
          }}
        >
          <span>⚠</span>
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 max-sm:w-[calc(100vw-45px)]">
        {kpis.map((k) => (
          <KpiCard key={k.label} {...k} loading={loading} />
        ))}
      </div>

      {/* Chart */}
      <div
        className="rounded-xl border p-6 max-sm:w-[calc(100vw-45px)]"
        style={{
          background: C.card,
          borderColor: C.border,
          boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
        }}
      >
        <h2
          className="text-sm font-semibold mb-0.5"
          style={{ color: C.textPrimary }}
        >
          {t("dashboard_revenue_trend")}
        </h2>
        <p className="text-xs mb-5" style={{ color: C.textMuted }}>
          {t("dashboard_revenue_trend_subtitle")}
        </p>
        {trendLoading ? (
          <div className="flex items-center justify-center h-[200px]">
            <div
              className="w-5 h-5 rounded-full border-2 animate-spin"
              style={{ borderColor: "#1F2937", borderTopColor: "#FF4D8D" }}
            />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart
              data={chartData}
              margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
            >
              <defs>
                <linearGradient id="gPink" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.pink} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={C.pink} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gOrange" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.orange} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={C.orange} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gCyan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.cyan} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={C.cyan} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: C.textMuted }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `$${v / 1000}k`}
                tick={{ fontSize: 11, fill: C.textMuted }}
                axisLine={false}
                tickLine={false}
                width={48}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12, color: C.textSecondary }}
              />
              <Area
                type="monotone"
                dataKey="hostEarnings"
                name={t("dashboard_host_earnings")}
                stroke={C.cyan}
                fill="url(#gCyan)"
                strokeWidth={2}
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="agencyCommission"
                name={t("agency_detail_agency_commission")}
                stroke={C.orange}
                fill="url(#gOrange)"
                strokeWidth={2}
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="bdCommission"
                name={t("dashboard_bd_commission")}
                stroke={C.pink}
                fill="url(#gPink)"
                strokeWidth={2.5}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Leaderboards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-sm:w-[calc(100vw-45px)]">
        {/* Top Agencies */}
        <div
          className="rounded-xl border overflow-hidden"
          style={{
            background: C.card,
            borderColor: C.border,
            boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
          }}
        >
          <div
            className="flex items-center justify-between px-5 py-4 border-b"
            style={{ borderColor: C.border }}
          >
            <div>
              <h2
                className="text-sm font-semibold"
                style={{ color: C.textPrimary }}
              >
                {t("dashboard_top_agencies")}
              </h2>
              <p className="text-xs" style={{ color: C.textMuted }}>
                {t("dashboard_top_agencies_subtitle")}
              </p>
            </div>
            <button
              onClick={() => navigate("/agencies")}
              className="flex items-center gap-1 text-xs font-medium hover:underline"
              style={{ color: C.pink }}
            >
              {t("dashboard_view_all")}
              <ChevronRight size={13} />
            </button>
          </div>
          {topAgenciesLoading ? (
            <div className="flex items-center justify-center py-10">
              <div
                className="w-5 h-5 rounded-full border-2 animate-spin"
                style={{ borderColor: C.border, borderTopColor: C.pink }}
              />
            </div>
          ) : topAgencies.length === 0 ? (
            <div
              className="py-10 text-center text-sm"
              style={{ color: C.textMuted }}
            >
              {t("dashboard_no_agencies")}
            </div>
          ) : (
            <div>
              {topAgencies.map((ag, i) => (
                <div
                  key={ag._id}
                  className="flex items-center gap-3 px-5 py-3.5 cursor-pointer transition-all duration-200"
                  style={{
                    borderTop: i > 0 ? `1px solid ${C.border}` : "none",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = C.hover)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                  onClick={() => navigate(`/agencies/${ag._id}`)}
                >
                  <span
                    className="w-5 text-xs font-bold"
                    style={{ color: i < 3 ? C.pink : C.textMuted }}
                  >
                    #{i + 1}
                  </span>
                  <img
                    src={ag.image}
                    alt={ag.name}
                    className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextSibling.style.display = "flex";
                    }}
                  />
                  <div
                    className="w-8 h-8 rounded-lg items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                    style={{
                      background: "linear-gradient(135deg, #FF4D8D, #A78BFA)",
                      display: "none",
                    }}
                  >
                    {ag.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: C.textPrimary }}
                    >
                      {ag.name}
                    </p>
                    <p className="text-xs" style={{ color: C.textMuted }}>
                      {ag.totalHosts} hosts · {ag.country}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className="text-sm font-semibold"
                      style={{ color: C.pink }}
                    >
                      {fmtCompact(ag.bdCommission)}
                    </p>
                    <p className="text-xs" style={{ color: C.textMuted }}>
                      #{ag.agencyCode}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Hosts */}
        <div
          className="rounded-xl border overflow-hidden"
          style={{
            background: C.card,
            borderColor: C.border,
            boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
          }}
        >
          <div
            className="flex items-center justify-between px-5 py-4 border-b"
            style={{ borderColor: C.border }}
          >
            <div>
              <h2
                className="text-sm font-semibold"
                style={{ color: C.textPrimary }}
              >
                {t("dashboard_top_hosts")}
              </h2>
              <p className="text-xs" style={{ color: C.textMuted }}>
                {t("dashboard_top_hosts_subtitle")}
              </p>
            </div>
            <button
              onClick={() => navigate("/hosts")}
              className="flex items-center gap-1 text-xs font-medium hover:underline"
              style={{ color: C.cyan }}
            >
              {t("dashboard_view_all")} <ChevronRight size={13} />
            </button>
          </div>
          {topHostsLoading ? (
            <div className="flex items-center justify-center py-10">
              <div
                className="w-5 h-5 rounded-full border-2 animate-spin"
                style={{ borderColor: C.border, borderTopColor: C.cyan }}
              />
            </div>
          ) : topHosts.length === 0 ? (
            <div
              className="py-10 text-center text-sm"
              style={{ color: C.textMuted }}
            >
              {t("No hosts found.")}
            </div>
          ) : (
            <div>
              {topHosts.map((h, i) => (
                <div
                  key={h._id}
                  className="flex items-center gap-3 px-5 py-3.5 transition-all duration-200"
                  style={{
                    borderTop: i > 0 ? `1px solid ${C.border}` : "none",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = C.hover)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <span
                    className="w-5 text-xs font-bold"
                    style={{ color: i < 3 ? C.cyan : C.textMuted }}
                  >
                    #{i + 1}
                  </span>
                  <img
                    src={h.image}
                    alt={h.name}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextSibling.style.display = "flex";
                    }}
                  />
                  <div
                    className="w-8 h-8 rounded-full items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                    style={{
                      background: "linear-gradient(135deg, #22D3EE, #A78BFA)",
                      display: "none",
                    }}
                  >
                    {h.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: C.textPrimary }}
                    >
                      {h.name}
                    </p>
                    <p
                      className="text-xs truncate"
                      style={{ color: C.textMuted }}
                    >
                      {h.agencyName} · #{h.uniqueId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className="text-sm font-semibold"
                      style={{ color: C.cyan }}
                    >
                      {fmtCompact(h.giftEarnings)}
                    </p>
                    <p className="text-xs" style={{ color: C.textMuted }}>
                      {h.country}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
