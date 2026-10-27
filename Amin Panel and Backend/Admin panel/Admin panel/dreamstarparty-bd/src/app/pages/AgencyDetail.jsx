import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAgencyDetail,
  fetchAgencyHosts,
  clearAgencyDetail,
  fetchAgencyCharts,
} from "../store/agencyDetailSlice";
import { ArrowLeft, Users, DollarSign, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format } from "date-fns";
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
  pinkBg: "rgba(255,77,141,0.10)",
  green: "#34D399",
  red: "#F87171",
  orange: "#FB923C",
  cyan: "#22D3EE",
  purple: "#A78BFA",
  textPrimary: "#F9FAFB",
  textSecondary: "#9CA3AF",
  textMuted: "#6B7280",
};

const fmtFull = (n) => `${n.toLocaleString()}`;

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div
      className="rounded-xl border p-5 transition-all duration-200"
      style={{
        background: C.card,
        borderColor: C.border,
        boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,77,141,0.3)";
        e.currentTarget.style.boxShadow = `0 10px 30px ${C.pinkGlow}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = C.border;
        e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.4)";
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: `${color}18` }}
        >
          <Icon size={16} style={{ color }} />
        </div>
        <p className="text-xs font-medium" style={{ color: C.textMuted }}>
          {label}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <img height={20} width={20} src={rCoin} />
        <p className="font-bold" style={{ color: C.textPrimary, fontSize: 20 }}>
          {value}
        </p>
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
      <p className="font-semibold mb-1.5" style={{ color: C.textPrimary }}>
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

const thStyle = {
  textAlign: "left",
  padding: "12px 16px",
  fontSize: 11,
  fontWeight: 600,
  color: "#6B7280",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  whiteSpace: "nowrap",
  background: "#1F2937",
};

export default function AgencyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const {
    agency,
    cards,
    hosts,
    hostsLoading,
    charts,
    chartsLoading,
    loading,
    error,
  } = useSelector((state) => state.agencyDetail);

  // ✅ Local date state — owned by this page
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // ✅ Helper: Date → "yyyy-MM-dd" string or null
  const toStr = (d) => (d ? format(d, "yyyy-MM-dd") : null);

  // ✅ Central fetch — passes dates directly to all 3 thunks
  const fetchAll = (start, end) => {
    const params = {
      agencyId: id,
      startDate: toStr(start),
      endDate: toStr(end),
    };
    dispatch(fetchAgencyDetail(params));
    dispatch(fetchAgencyHosts(params));
    dispatch(fetchAgencyCharts(params));
  };

  // Initial load
  useEffect(() => {
    fetchAll(null, null);
    return () => dispatch(clearAgencyDetail());
  }, [id]);

  // ✅ On apply: update local state + refetch with new dates
  const handleApply = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    fetchAll(start, end);
  };

  // ✅ On clear: reset dates + refetch without them
  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    fetchAll(null, null);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-32">
        <div
          className="w-7 h-7 rounded-full border-2 animate-spin"
          style={{ borderColor: "#1F2937", borderTopColor: "#FF4D8D" }}
        />
      </div>
    );

  if (error)
    return (
      <div className="text-center py-20">
        <p style={{ color: "#F87171" }}>{error}</p>
        <button
          onClick={() => navigate("/agencies")}
          className="mt-4 text-sm font-medium"
          style={{ color: "#FF4D8D" }}
        >
          ← {t("agency_detail_back")}
        </button>
      </div>
    );

  if (!agency)
    return (
      <div className="text-center py-20">
        <p style={{ color: C.textMuted }}>{t("agency_detail_not_found")}</p>
        <button
          onClick={() => navigate("/agencies")}
          className="mt-4 text-sm font-medium"
          style={{ color: C.pink }}
        >
          ← {t("agency_detail_back")}
        </button>
      </div>
    );

  const performanceTrend = (() => {
    if (!charts) return [];
    const map = {};
    (charts.performanceTrend?.hostEarnings || []).forEach(({ _id, total }) => {
      map[_id] = { date: _id, hostEarnings: total };
    });
    (charts.performanceTrend?.agencyCommission || []).forEach(
      ({ _id, total }) => {
        map[_id] = { ...map[_id], date: _id, agencyCommission: total };
      },
    );
    (charts.performanceTrend?.bdCommission || []).forEach(({ _id, total }) => {
      map[_id] = { ...map[_id], date: _id, bdCommission: total };
    });
    return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
  })();

  const monthlyComparison = (() => {
    if (!charts) return [];
    const map = {};
    (charts.monthlyComparison?.agencyCommission || []).forEach(
      ({ _id, total }) => {
        map[_id] = { date: _id, agencyCommission: total };
      },
    );
    (charts.monthlyComparison?.bdCommission || []).forEach(({ _id, total }) => {
      map[_id] = { ...map[_id], date: _id, bdCommission: total };
    });
    return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
  })();

  return (
    <div className="space-y-6">
      {/* Header row: Back + Agency info + DateRangeModal */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-4">
          <button
            onClick={() => navigate("/agencies")}
            className="flex items-center gap-1.5 text-sm font-medium mt-0.5 transition-colors hover:underline"
            style={{ color: C.pink }}
          >
            <ArrowLeft size={15} /> {t("agency_detail_back")}
          </button>
          <div className="flex items-center gap-3 flex-wrap">
            <img
              src={agency.image}
              alt={agency.name}
              className="w-10 h-10 rounded-xl object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextSibling.style.display = "flex";
              }}
            />
            <div
              className="w-10 h-10 rounded-xl items-center justify-center text-white font-bold"
              style={{
                background: "linear-gradient(135deg, #FF4D8D, #A78BFA)",
                display: "none",
              }}
            >
              {agency.name.charAt(0)}
            </div>
            <div>
              <h1
                className="font-bold"
                style={{ color: C.textPrimary, fontSize: 20 }}
              >
                {agency.name}
              </h1>
              <p className="text-sm" style={{ color: C.textMuted }}>
                #{agency.agencyCode} · {agency.country} ·{" "}
                {t("agency_detail_joined")}{" "}
                {new Date(agency.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              style={{
                background: agency.isActive
                  ? "rgba(52,211,153,0.12)"
                  : "rgba(107,114,128,0.12)",
                color: agency.isActive ? C.green : C.textMuted,
              }}
            >
              {agency.isActive
                ? t("agency_detail_active")
                : t("agency_detail_inactive")}
            </span>
          </div>
        </div>

        {/* ✅ DateRangeModal in top-right of header */}
        <DateRangeModal
          startDate={startDate ?? undefined}
          endDate={endDate ?? undefined}
          onApply={handleApply}
          onClear={handleClear}
        />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label={t("agency_detail_total_hosts")}
          value={String(cards?.totalHosts ?? "0")}
          color={C.cyan}
        />
        <StatCard
          icon={DollarSign}
          label={t("agency_detail_host_earnings")}
          value={fmtFull(cards?.hostEarnings ?? 0)}
          color={C.cyan}
        />
        <StatCard
          icon={DollarSign}
          label={t("agency_detail_agency_commission")}
          value={fmtFull(cards?.agencyCommission ?? 0)}
          color={C.orange}
        />
        <StatCard
          icon={TrendingUp}
          label={t("agency_detail_bd_commission")}
          value={fmtFull(cards?.bdCommission ?? 0)}
          color={C.pink}
        />
      </div>

      {/* Host table */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{
          background: C.card,
          borderColor: C.border,
          boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
        }}
      >
        <div className="px-5 py-4 border-b" style={{ borderColor: C.border }}>
          <h2
            className="text-sm font-semibold"
            style={{ color: C.textPrimary }}
          >
            {t("agency_detail_host_list")}
          </h2>
          <p className="text-xs" style={{ color: C.textMuted }}>
            {t("agency_detail_host_list_subtitle", {
              count: cards?.totalHosts ?? 0,
            })}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {[
                  t("agency_detail_col_host"),
                  t("agency_detail_col_country"),
                  t("agency_detail_col_gift_earnings"),
                  t("agency_detail_col_agency_commission_share"),
                  t("agency_detail_col_status"),
                ].map((h) => (
                  <th key={h} style={thStyle}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hostsLoading ? (
                <tr>
                  <td colSpan={5}>
                    <div className="flex items-center justify-center py-10">
                      <div
                        className="w-5 h-5 rounded-full border-2 animate-spin"
                        style={{
                          borderColor: C.border,
                          borderTopColor: C.pink,
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ) : hosts.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-10 text-sm"
                    style={{ color: C.textMuted }}
                  >
                    {t("agency_detail_no_hosts")}
                  </td>
                </tr>
              ) : (
                hosts.map((h, idx) => (
                  <tr
                    key={h._id}
                    className="transition-all duration-200"
                    style={{
                      borderTop: idx > 0 ? `1px solid ${C.border}` : "none",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = C.hover)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={h.image}
                          alt={h.name}
                          className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.nextSibling.style.display = "flex";
                          }}
                        />
                        <div
                          className="w-7 h-7 rounded-full items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{
                            background:
                              "linear-gradient(135deg, #22D3EE, #A78BFA)",
                            display: "none",
                          }}
                        >
                          {h.name.charAt(0)}
                        </div>
                        <div>
                          <p
                            className="font-medium"
                            style={{ color: C.textPrimary }}
                          >
                            {h.name}
                          </p>
                          <p className="text-xs" style={{ color: C.textMuted }}>
                            #{h.uniqueId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td
                      className="px-4 py-3.5 text-sm"
                      style={{ color: C.textSecondary }}
                    >
                      {h.country}
                    </td>
                    <td
                      className="px-4 py-3.5 font-medium"
                      style={{ color: C.textPrimary }}
                    >
                      {fmtFull(h.giftEarnings)}
                    </td>
                    <td
                      className="px-4 py-3.5 font-medium"
                      style={{ color: C.pink }}
                    >
                      {fmtFull(h.agencyCommissionShare)}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          background: h.isActive
                            ? "rgba(52,211,153,0.12)"
                            : "rgba(107,114,128,0.12)",
                          color: h.isActive ? C.green : C.textMuted,
                        }}
                      >
                        {h.isActive
                          ? t("agency_detail_active")
                          : t("agency_detail_inactive")}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          className="rounded-xl border p-5"
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
            {t("agency_detail_performance_trend")}
          </h2>
          <p className="text-xs mb-4" style={{ color: C.textMuted }}>
            {t("agency_detail_performance_trend_subtitle")}
          </p>
          {chartsLoading ? (
            <div className="flex items-center justify-center h-[200px]">
              <div
                className="w-5 h-5 rounded-full border-2 animate-spin"
                style={{ borderColor: C.border, borderTopColor: C.pink }}
              />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart
                data={performanceTrend}
                margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
              >
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
                  width={44}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, color: C.textSecondary }}
                />
                <Line
                  type="monotone"
                  dataKey="hostEarnings"
                  name={t("agency_detail_chart_host_earnings")}
                  stroke={C.cyan}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="agencyCommission"
                  name={t("agency_detail_chart_agency_commission")}
                  stroke={C.orange}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="bdCommission"
                  name={t("agency_detail_chart_bd_commission")}
                  stroke={C.pink}
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div
          className="rounded-xl border p-5"
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
            {t("agency_detail_monthly_comparison")}
          </h2>
          <p className="text-xs mb-4" style={{ color: C.textMuted }}>
            {t("agency_detail_monthly_comparison_subtitle")}
          </p>
          {chartsLoading ? (
            <div className="flex items-center justify-center h-[200px]">
              <div
                className="w-5 h-5 rounded-full border-2 animate-spin"
                style={{ borderColor: C.border, borderTopColor: C.pink }}
              />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={monthlyComparison}
                margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
              >
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
                  width={44}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, color: C.textSecondary }}
                />
                <Bar
                  dataKey="agencyCommission"
                  name={t("agency_detail_chart_agency_commission")}
                  fill={C.orange}
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  dataKey="bdCommission"
                  name={t("agency_detail_chart_bd_commission")}
                  fill={C.pink}
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Note */}
      <div
        className="flex items-start gap-3 p-4 rounded-xl border text-xs"
        style={{
          background: "rgba(34,211,238,0.05)",
          borderColor: "rgba(34,211,238,0.2)",
        }}
      >
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: C.cyan }}
        >
          <span className="font-bold" style={{ fontSize: 10, color: C.bg }}>
            i
          </span>
        </div>
        <p style={{ color: C.cyan }}>
          <strong>{t("agency_detail_note_title")}:</strong>{" "}
          {t("agency_detail_note_body")}
        </p>
      </div>
    </div>
  );
}
