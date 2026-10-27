import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../store/transactionSlice";
import { ArrowDownLeft, ArrowUpRight, RefreshCw, Filter } from "lucide-react";
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
  green: "#34D399",
  red: "#F87171",
  textPrimary: "#F9FAFB",
  textSecondary: "#9CA3AF",
  textMuted: "#6B7280",
};

const LIMIT = 10;

const fmtCompact = (val) => {
  const n = Number(val);
  if (isNaN(n)) return val ?? "0";
  if (n >= 1_000_000)
    return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 10_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  return n.toLocaleString();
};

const TYPE_KEY_MAP = {
  21: "transactions_type_bd_commission",
  22: "transactions_type_bd_redeemed",
  23: "transactions_type_admin_added",
  24: "transactions_type_admin_deducted",
};

const TYPE_OPTIONS = [
  { labelKey: "transactions_filter_all", value: null },
  { labelKey: "transactions_type_bd_commission", value: 21 },
  { labelKey: "transactions_type_bd_redeemed", value: 22 },
  { labelKey: "transactions_type_admin_added", value: 23 },
  { labelKey: "transactions_type_admin_deducted", value: 24 },
];

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

export default function Transactions() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { list, total, currentPage, loading, error } = useSelector(
    (s) => s.transactions,
  );

  // ✅ Local type filter state
  const [typeFilter, setTypeFilter] = useState(null);

  const totalPages = Math.ceil(total / LIMIT);

  // Initial load
  useEffect(() => {
    dispatch(fetchTransactions({ page: 1, type: null }));
  }, [dispatch]);

  // ✅ When type changes, reset to page 1 and refetch
  const handleTypeChange = (e) => {
    const val = e.target.value === "" ? null : Number(e.target.value);
    setTypeFilter(val);
    dispatch(fetchTransactions({ page: 1, type: val }));
  };

  // ✅ Pagination passes current type along
  const handlePageChange = (page) => {
    dispatch(fetchTransactions({ page, type: typeFilter }));
  };

  return (
    <div className="space-y-5">
      {/* Error */}
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

      {/* Table */}
      <div
        className="rounded-xl border overflow-hidden max-sm:w-[calc(100vw-45px)]"
        style={{
          background: C.card,
          borderColor: C.border,
          boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
        }}
      >
        {/* Header */}
        <div
          className="px-5 py-4 border-b flex items-center justify-between gap-4 flex-wrap"
          style={{ borderColor: C.border }}
        >
          <div>
            <h2
              className="text-sm font-semibold"
              style={{ color: C.textPrimary }}
            >
              {t("transactions_title")}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: C.textMuted }}>
              {t("transactions_subtitle")}
            </p>
          </div>

          <div className="flex items-center gap-3 w-30 max-sm:w-full">
            <Filter
              className="max-sm:hidden"
              size={13}
              style={{ color: C.textMuted }}
            />
            <select
              value={typeFilter ?? ""}
              onChange={handleTypeChange}
              style={selectStyle}
              className="w-full"
            >
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt.labelKey} value={opt.value ?? ""}>
                  {t(opt.labelKey)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {[
                  t("transactions_col_number"),
                  t("transactions_col_type"),
                  t("transactions_col_rcoin"),
                  t("transactions_col_is_income"),
                  t("transactions_col_date"),
                  t("transactions_col_created_at"),
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
                      {t("transactions_no_records")}
                    </div>
                  </td>
                </tr>
              ) : (
                list.map((tx, idx) => {
                  const rowNum = (currentPage - 1) * LIMIT + idx + 1;
                  return (
                    <tr
                      key={tx._id}
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
                      <td
                        className="px-4 py-3.5 text-xs"
                        style={{ color: C.textMuted }}
                      >
                        {rowNum}
                      </td>
                      <td
                        className="px-4 py-3.5 text-xs"
                        style={{ color: C.textSecondary }}
                      >
                        {t(TYPE_KEY_MAP[tx.type]) || tx.type}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <img src={rCoin} width={16} height={16} />
                          <span
                            className="font-semibold"
                            style={{ color: C.textPrimary }}
                          >
                            {fmtCompact(tx.rCoin)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
                          style={{
                            background: tx.isIncome
                              ? "rgba(52,211,153,0.1)"
                              : "rgba(248,113,113,0.1)",
                            color: tx.isIncome ? C.green : C.red,
                          }}
                        >
                          {tx.isIncome ? (
                            <ArrowDownLeft size={11} />
                          ) : (
                            <ArrowUpRight size={11} />
                          )}
                          {tx.isIncome
                            ? t("transactions_income_true")
                            : t("transactions_income_false")}
                        </span>
                      </td>
                      <td
                        className="px-4 py-3.5 text-xs"
                        style={{ color: C.textMuted }}
                      >
                        {tx.date}
                      </td>
                      <td
                        className="px-4 py-3.5 text-xs"
                        style={{ color: C.textMuted }}
                      >
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
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
