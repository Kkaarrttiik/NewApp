import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchAgencies, openCreateDialog, openEditDialog, setCurrentPage } from "../store/agenciesSlice";
import { Search, ChevronRight, Filter } from "lucide-react";
import Pagination from "../components/Pagination";
import countriesData from "../../util/countries.json";
import rCoin from "../../images/rcoin.webp";
import DateRangeModal from "../components/DateRangeModal";
import { format } from "date-fns";
import useTranslation from "../../util/useTranslation";
import AgencyDialog from "../components/Agencydialog";

const C = {
  bg: "#0F172A",
  card: "#111827",
  border: "#1F2937",
  hover: "#1E293B",
  pink: "#FF4D8D",
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

export default function MyAgencies() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { list, total, currentPage, loading, error } = useSelector(
    (state) => state.agencies,
  );

  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("Country");
  const [status, setStatus] = useState("Status");

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const totalPages = Math.ceil(total / LIMIT);
  const countries = [
    t("agencies_filter_country"),
    ...countriesData.map((c) => c.name.common).sort(),
  ];

  const toStr = (d) => (d ? format(d, "yyyy-MM-dd") : null);

  const doFetch = useCallback(
    (page = 1, start = startDate, end = endDate) => {
      dispatch(
        fetchAgencies({
          search,
          country,
          status,
          page,
          startDate: toStr(start),
          endDate: toStr(end),
        }),
      );
    },
    [dispatch, search, country, status, startDate, endDate],
  );

  useEffect(() => {
    dispatch(setCurrentPage(1));
    doFetch(1);
  }, [search, country, status]);

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
    doFetch(page);
  };

  const handleApply = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    dispatch(setCurrentPage(1));
    doFetch(1, start, end);
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    dispatch(setCurrentPage(1));
    doFetch(1, null, null);
  };

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

      {/* Filters */}
      <div
        className="rounded-xl border p-4 flex flex-wrap gap-4 items-center overflow-x-hidden"
        style={{
          background: C.card,
          borderColor: C.border,
          boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
        }}
      >
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2"
            size={14}
            style={{ color: C.textMuted }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("agencies_search_placeholder")}
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

        <DateRangeModal
          startDate={startDate ?? undefined}
          endDate={endDate ?? undefined}
          onApply={handleApply}
          onClear={handleClear}
        />

        <button
          onClick={() => dispatch(openCreateDialog())}
          style={selectStyle}
          className="max-sm:w-full"
        >
          + {t("create_agency")}
        </button>

        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          style={selectStyle}
          className="max-sm:w-full"
        >
          {countries.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="max-sm:w-full"
          style={selectStyle}
        >
          {[
            { value: "Status", label: t("agencies_filter_status") },
            { value: "Active", label: t("agencies_status_active") },
            { value: "Inactive", label: t("agencies_status_inactive") },
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
                  t("agencies_col_agency_name"),
                  t("agencies_col_total_hosts"),
                  t("agencies_col_host_earnings"),
                  t("agencies_col_agency_commission"),
                  t("agencies_col_bd_commission"),
                  t("agencies_col_status"),
                  t("agencies_col_action"),
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
                  <td colSpan={8}>
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
                  <td colSpan={8}>
                    <div
                      className="py-16 text-center text-sm"
                      style={{ color: C.textMuted }}
                    >
                      {t("agencies_no_results")}
                    </div>
                  </td>
                </tr>
              ) : (
                list.map((ag, idx) => (
                  <tr
                    key={ag._id}
                    className="cursor-pointer transition-all duration-200"
                    style={{
                      borderTop: idx > 0 ? `1px solid ${C.border}` : "none",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = C.hover)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                    onClick={() => navigate(`/agencies/${ag._id}`)}
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
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
                          className="w-8 h-8 rounded-lg items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{
                            background:
                              "linear-gradient(135deg, #FF4D8D, #A78BFA)",
                            display: "none",
                          }}
                        >
                          {ag.name.charAt(0)}
                        </div>
                        <div>
                          <p
                            className="font-medium"
                            style={{ color: C.textPrimary }}
                          >
                            {ag.name}
                          </p>
                          <p className="text-xs" style={{ color: C.textMuted }}>
                            #{ag.agencyCode}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td
                      className="px-4 py-3.5 font-medium"
                      style={{ color: C.textPrimary }}
                    >
                      {ag.totalHosts}
                    </td>
                    <td
                      className="px-4 py-3.5 font-medium"
                      style={{ color: C.textPrimary }}
                    >
                      <div className="flex items-center gap-2">
                        <img height={20} width={20} src={rCoin} />
                        {fmtCompact(ag.hostEarnings)}
                      </div>
                    </td>
                    <td
                      className="px-4 py-3.5"
                      style={{ color: C.textSecondary }}
                    >
                      <div className="flex items-center gap-2">
                        <img height={20} width={20} src={rCoin} />
                        {fmtCompact(ag.agencyCommission)}
                      </div>
                    </td>
                    <td
                      className="px-4 py-3.5 font-semibold"
                      style={{ color: C.pink }}
                    >
                      <div className="flex items-center gap-2">
                        <img height={20} width={20} src={rCoin} />
                        {fmtCompact(ag.bdCommission)}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          background: ag.isActive
                            ? "rgba(52,211,153,0.12)"
                            : "rgba(107,114,128,0.12)",
                          color: ag.isActive ? C.green : C.textSecondary,
                        }}
                      >
                        {ag.isActive
                          ? t("agencies_active_badge")
                          : t("agencies_inactive_badge")}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          className="flex items-center gap-1 text-xs font-medium cursor-pointer hover:underline"
                          style={{ color: C.pink }}
                          onClick={(e) => {
                            e.stopPropagation(); // prevent row click navigation
                            dispatch(openEditDialog(ag));
                          }}
                        >
                          {t("edit_agency")}
                        </button>
                        <span style={{ color: C.textMuted }}>·</span>
                        <button
                          className="flex items-center gap-1 text-xs font-medium cursor-pointer hover:underline"
                          style={{ color: C.pink }}
                        >
                          {t("agencies_col_view")} <ChevronRight size={13} />
                        </button>
                      </div>
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
      <AgencyDialog />
    </div >
  );
}
