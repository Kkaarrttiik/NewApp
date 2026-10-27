import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCommissionOverview,
  fetchCommissionBreakdown,
  setBreakdownPage,
} from "../store/commissionSlice";
import { DollarSign, Wallet, Clock, CheckCircle2 } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Pagination from "../components/Pagination";
import rCoin from "../../images/rcoin.webp";
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

const fmtCompact = (val) => {
  const n = Number(val);
  if (isNaN(n)) return val ?? "0";
  if (n >= 1_000_000)
    return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 10_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  return n.toLocaleString();
};

const statusStyle = {
  Settled: { bg: "rgba(52,211,153,0.12)", text: "#34D399" },
  Pending: { bg: "rgba(251,146,60,0.12)", text: "#FB923C" },
  Processing: { bg: "rgba(34,211,238,0.12)", text: "#22D3EE" },
};

function KpiCard({ icon: Icon, label, value, sub, color }) {
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
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18` }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        <p className="text-xs font-medium" style={{ color: C.textMuted }}>
          {label}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <img height={20} width={20} src={rCoin} />
        <p className="font-bold" style={{ color: C.textPrimary, fontSize: 22 }}>
          {value}
        </p>
      </div>

      {sub && (
        <p className="text-xs mt-0.5" style={{ color: C.textMuted }}>
          {sub}
        </p>
      )}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  const { t } = useTranslation();
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
      <p className="font-semibold mb-1" style={{ color: C.textPrimary }}>
        {label}
      </p>
      <p style={{ color: C.pink }}>
        {t("commission_tooltip_bd")}:{" "}
        <strong>{fmtCompact(payload[0].value)}</strong>
      </p>
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

const selectStyle = {
  background: "#1F2937",
  border: "1px solid #374151",
  borderRadius: 8,
  color: "#9CA3AF",
  padding: "8px 12px",
  fontSize: 13,
  outline: "none",
  cursor: "pointer",
};

export default function CommissionOverview() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const {
    cards,
    trend,
    loading,
    error,
    breakdown,
    breakdownTotal,
    breakdownPage,
    breakdownLoading,
  } = useSelector((state) => state.commission);
  const [filter, setFilter] = useState("All");

  const LIMIT = 10;
  const breakdownTotalPages = Math.ceil(breakdownTotal / LIMIT);

  useEffect(() => {
    dispatch(fetchCommissionOverview());
    dispatch(fetchCommissionBreakdown(1));
  }, [dispatch]);

  const filtered = breakdown.filter(
    (r) => filter === "All" || r.status === filter,
  );

  return (
    <div className="space-y-5">
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

      {/* KPIs */}
      <div className="grid max-sm:w-[calc(100vw-45px)] grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border p-5"
              style={{ background: C.card, borderColor: C.border }}
            >
              <div
                className="h-4 w-24 rounded animate-pulse mb-3"
                style={{ background: C.border }}
              />
              <div
                className="h-7 w-32 rounded animate-pulse"
                style={{ background: C.border }}
              />
            </div>
          ))
        ) : (
          <>
            <KpiCard
              icon={DollarSign}
              label={t("commission_total_bd")}
              value={fmtCompact(cards?.totalBdCommission ?? 0)}
              sub={t("commission_all_time")}
              color={C.pink}
            />
            <KpiCard
              icon={Wallet}
              label={t("commission_withdrawable_balance")}
              value={fmtCompact(cards?.withdrawableBalance ?? 0)}
              sub={t("commission_available_to_request")}
              color={C.cyan}
            />
            <KpiCard
              icon={Clock}
              label={t("commission_pending_settlement")}
              value={fmtCompact(cards?.pendingSettlement ?? 0)}
              sub={t("commission_being_processed")}
              color={C.orange}
            />
            <KpiCard
              icon={CheckCircle2}
              label={t("commission_total_settled")}
              value={fmtCompact(cards?.totalSettled ?? 0)}
              sub={t("commission_paid_to_wallet")}
              color={C.green}
            />
          </>
        )}
      </div>

      {/* Chart */}
      <div
        className="rounded-xl border p-5 max-sm:w-[calc(100vw-45px)]"
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
          {t("commission_monthly_trend")}
        </h2>
        <p className="text-xs mb-4" style={{ color: C.textMuted }}>
          {t("commission_monthly_trend_subtitle")}
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            data={trend}
            margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id="gPink" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.pink} stopOpacity={0.3} />
                <stop offset="95%" stopColor={C.pink} stopOpacity={0} />
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
              width={44}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="bdCommission"
              stroke={C.pink}
              fill="url(#gPink)"
              strokeWidth={2.5}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div
        className="rounded-xl max-sm:w-[calc(100vw-45px)] border overflow-hidden"
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
              {t("commission_breakdown")}
            </h2>
            <p className="text-xs" style={{ color: C.textMuted }}>
              {t("commission_breakdown_subtitle")}
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {[
                  t("commission_col_date"),
                  t("commission_col_agency_name"),
                  t("commission_col_host_contribution"),
                  t("commission_col_agency_commission"),
                  t("commission_col_bd_commission"),
                ].map((h) => (
                  <th key={h} style={thStyle}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {breakdownLoading ? (
                <tr>
                  <td colSpan={5}>
                    <div className="flex items-center justify-center py-12">
                      <div
                        className="w-6 h-6 rounded-full border-2 animate-spin"
                        style={{
                          borderColor: C.border,
                          borderTopColor: C.pink,
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div
                      className="py-12 text-center text-sm"
                      style={{ color: C.textMuted }}
                    >
                      {t("commission_no_records")}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => (
                  <tr
                    key={i}
                    className="transition-all duration-200"
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
                    <td
                      className="px-4 py-3.5 text-sm"
                      style={{ color: C.textMuted }}
                    >
                      {new Date(row.date).toLocaleDateString()}
                    </td>
                    <td
                      className="px-4 py-3.5 font-medium"
                      style={{ color: C.textPrimary }}
                    >
                      {row.agencyName}
                    </td>
                    <td
                      className="px-4 py-3.5"
                      style={{ color: C.textSecondary }}
                    >
                      {fmtCompact(row.hostContribution)}
                    </td>
                    <td
                      className="px-4 py-3.5"
                      style={{ color: C.textSecondary }}
                    >
                      {fmtCompact(row.agencyCommission)}
                    </td>
                    <td
                      className="px-4 py-3.5 font-semibold"
                      style={{ color: C.pink }}
                    >
                      {fmtCompact(row.bdCommission)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!breakdownLoading && breakdownTotalPages > 1 && (
          <div className="px-4 py-3 border-t" style={{ borderColor: C.border }}>
            <Pagination
              currentPage={breakdownPage}
              totalPages={breakdownTotalPages}
              onPageChange={(page) => {
                dispatch(setBreakdownPage(page));
                dispatch(fetchCommissionBreakdown(page));
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
