import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHosts, setHostsPage } from "../store/hostsSlice";
import { Search, Filter } from "lucide-react";
import Pagination from "../components/Pagination";
import DateRangeModal from "../components/DateRangeModal";
import { format } from "date-fns";
import useTranslation from "../../util/useTranslation";

const C = {
  bg: "#0F172A",
  card: "#111827",
  border: "#1F2937",
  hover: "#1E293B",
  pink: "#FF4D8D",
  pinkGlow: "rgba(255,77,141,0.25)",
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

const LIMIT = 10;

export default function HostsUnderAgencies() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { list, total, currentPage, loading, error } = useSelector(
    (state) => state.hosts,
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // ✅ Local date state — owned by this page
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const totalPages = Math.ceil(total / LIMIT);

  // ✅ Helper: Date object → "yyyy-MM-dd" string or null
  const toStr = (d) => (d ? format(d, "yyyy-MM-dd") : null);

  // ✅ Central fetch — passes all filters + dates directly to thunk
  const doFetch = useCallback(
    (page = 1, start = startDate, end = endDate) => {
      dispatch(
        fetchHosts({
          search,
          status: statusFilter,
          page,
          startDate: toStr(start),
          endDate: toStr(end),
        }),
      );
    },
    [dispatch, search, statusFilter, startDate, endDate],
  );

  // Re-fetch when search/status change
  useEffect(() => {
    dispatch(setHostsPage(1));
    doFetch(1);
  }, [search, statusFilter]);

  const handlePageChange = (page) => {
    dispatch(setHostsPage(page));
    doFetch(page);
  };

  // ✅ On apply: update local state + immediately fetch with new dates
  const handleApply = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    dispatch(setHostsPage(1));
    doFetch(1, start, end);
  };

  // ✅ On clear: reset dates + fetch without them
  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    dispatch(setHostsPage(1));
    doFetch(1, null, null);
  };

  const activeCount = list.filter((h) => h.isActive).length;
  const totalEarnings = list.reduce((a, h) => a + (h.giftEarnings || 0), 0);

  return (
    <div className="space-y-5">
      {/* Error Banner */}
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

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 max-sm:w-[calc(100vw-45px)]">
        {[
          {
            label: t("hosts_total_hosts"),
            value: String(total),
            color: C.pink,
          },
          {
            label: t("hosts_active_hosts"),
            value: String(activeCount),
            color: C.green,
          },
          {
            label: t("hosts_total_earnings"),
            value: fmtCompact(totalEarnings),
            color: C.orange,
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border px-5 py-4 transition-all duration-200"
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
            <p className="text-xs" style={{ color: C.textMuted }}>
              {s.label}
            </p>
            <p
              className="font-bold mt-0.5"
              style={{ color: s.color, fontSize: 22 }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        className="rounded-xl border p-4 flex flex-wrap gap-4 items-center overflow-x-hidden"
        style={{
          background: C.card,
          borderColor: C.border,
          boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
        }}
      >
        <div className="relative flex-1 min-w-48">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2"
            size={14}
            style={{ color: C.textMuted }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("hosts_search_placeholder")}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border focus:outline-none transition-all"
            style={{
              background: C.bg,
              borderColor: C.border,
              color: C.textPrimary,
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = C.pink)}
            onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
          />
        </div>

        <Filter size={14} style={{ color: C.textMuted }} />

        {/* ✅ DateRangeModal wired with local state + handlers */}
        <DateRangeModal
          startDate={startDate ?? undefined}
          endDate={endDate ?? undefined}
          onApply={handleApply}
          onClear={handleClear}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={selectStyle}
          className="max-sm:w-full"
        >
          {[
            { value: "All", label: t("hosts_status_all") },
            { value: "Active", label: t("hosts_status_active") },
            { value: "Inactive", label: t("hosts_status_inactive") },
          ].map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
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
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {[
                  t("hosts_col_host"),
                  t("hosts_col_agency"),
                  t("hosts_col_country"),
                  t("hosts_col_gift_earnings"),
                  t("hosts_col_agency_commission_share"),
                  t("hosts_col_status"),
                ].map((h) => (
                  <th key={h} style={thStyle}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6}>
                    <div className="flex items-center justify-center py-16">
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
              ) : list.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div
                      className="py-14 text-center text-sm"
                      style={{ color: C.textMuted }}
                    >
                      {t("hosts_no_results")}
                    </div>
                  </td>
                </tr>
              ) : (
                list.map((h, idx) => (
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
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.nextSibling.style.display = "flex";
                          }}
                        />
                        <div
                          className="w-8 h-8 rounded-full items-center justify-center text-xs font-bold text-white flex-shrink-0"
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
                      {h.agencyName}
                    </td>
                    <td
                      className="px-4 py-3.5 text-sm"
                      style={{ color: C.textMuted }}
                    >
                      {h.country}
                    </td>
                    <td
                      className="px-4 py-3.5 font-semibold"
                      style={{ color: C.textPrimary }}
                    >
                      {fmtCompact(h.giftEarnings)}
                    </td>
                    <td
                      className="px-4 py-3.5 font-medium"
                      style={{ color: C.pink }}
                    >
                      {fmtCompact(h.agencyCommissionShare)}
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
                          ? t("hosts_active_badge")
                          : t("hosts_inactive_badge")}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-4 py-3 border-t" style={{ borderColor: C.border }}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
