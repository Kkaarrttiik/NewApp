import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWithdrawPage,
  submitWithdrawRequest,
  clearSubmitStatus,
} from "../store/withdrawSlice";
import { Wallet, Clock, AlertCircle, Send, Info } from "lucide-react";
import Pagination from "../components/Pagination";
import WithdrawModal from "../components/WithdrawModal";
import rCoin from "../../images/rcoin.webp";
import useTranslation from "../../util/useTranslation";

const C = {
  bg: "#0F172A",
  card: "#111827",
  border: "#1F2937",
  hover: "#1E293B",
  pink: "#FF4D8D",
  pinkHover: "#FF2E75",
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

const LIMIT = 10;
const fmtCompact = (val) => {
  const n = Number(val);
  if (isNaN(n)) return val ?? "0";
  if (n >= 1_000_000)
    return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 10_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  return n.toLocaleString();
};

const statusStyle = {
  pending: { bg: "rgba(251,146,60,0.12)", text: "#FB923C" },
  approved: { bg: "rgba(34,211,238,0.12)", text: "#22D3EE" },
  rejected: { bg: "rgba(248,113,113,0.12)", text: "#F87171" },
  paid: { bg: "rgba(52,211,153,0.12)", text: "#34D399" },
};

const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "—");

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

export default function WithdrawRequest() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const {
    cards,
    history,
    total,
    currentPage,
    loading,
    error,
    submitting,
    submitError,
    submitSuccess,
  } = useSelector((state) => state.withdraw);

  const [showModal, setShowModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const totalPages = Math.ceil(total / LIMIT);

  useEffect(() => {
    dispatch(fetchWithdrawPage(1));
  }, [dispatch]);

  useEffect(() => {
    if (submitSuccess) {
      setShowModal(false);
      setSuccessMsg(t("withdraw_success_msg"));
      dispatch(clearSubmitStatus());
      dispatch(fetchWithdrawPage(1));
      setTimeout(() => setSuccessMsg(""), 5000);
    }
  }, [submitSuccess, dispatch, t]);

  const handleSubmit = (coin, description, paymentGateway, paymentDetails) => {
    dispatch(
      submitWithdrawRequest({
        coin,
        description,
        paymentGateway,
        paymentDetails,
      }),
    );
  };

  const handlePageChange = (page) => {
    dispatch(fetchWithdrawPage(page));
  };

  const balance = cards?.withdrawableBalance ?? 0;
  const minLimit = cards?.minWithdrawLimit ?? 500;
  const pendingAmt = cards?.pendingRequest ?? 0;
  const hasPending = pendingAmt > 0;
  const exceedsMin = cards?.balanceExceedsMinimum ?? false;

  return (
    <div className="space-y-5">
      {/* Success toast */}
      {successMsg && (
        <div
          className="flex items-center gap-3 px-5 py-3.5 rounded-xl border text-sm font-medium"
          style={{
            background: "rgba(52,211,153,0.08)",
            borderColor: "rgba(52,211,153,0.3)",
            color: C.green,
          }}
        >
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: C.green }}
          >
            <span className="font-bold" style={{ fontSize: 10, color: C.bg }}>
              ✓
            </span>
          </div>
          {successMsg}
        </div>
      )}

      {/* Error banner */}
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-sm:w-[calc(100vw-45px)]">
        {/* Balance */}
        <div
          className="rounded-xl border p-5 flex flex-col gap-3 transition-all duration-200"
          style={{
            background: C.card,
            borderColor: C.border,
            boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,77,141,0.35)";
            e.currentTarget.style.boxShadow = `0 10px 30px ${C.pinkGlow}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = C.border;
            e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.4)";
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: C.pinkBg }}
            >
              <Wallet size={17} style={{ color: C.pink }} />
            </div>
            <p className="text-xs font-medium" style={{ color: C.textMuted }}>
              {t("withdraw_balance_label")}
            </p>
          </div>
          {loading ? (
            <div
              className="h-8 w-28 rounded animate-pulse"
              style={{ background: C.border }}
            />
          ) : (
            <div className="flex items-center gap-2">
              <img height={20} width={20} src={rCoin} />

              <p
                className="font-bold"
                style={{ color: C.textPrimary, fontSize: 26 }}
              >
                {fmtCompact(balance)}
              </p>
            </div>
          )}
          <p className="text-xs" style={{ color: C.textMuted }}>
            {t("withdraw_balance_sub")}
          </p>
        </div>

        {/* Min limit */}
        <div
          className="rounded-xl border p-5 flex flex-col gap-3 transition-all duration-200"
          style={{
            background: C.card,
            borderColor: C.border,
            boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,77,141,0.35)";
            e.currentTarget.style.boxShadow = `0 10px 30px ${C.pinkGlow}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = C.border;
            e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.4)";
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(34,211,238,0.1)" }}
            >
              <AlertCircle size={17} style={{ color: C.cyan }} />
            </div>
            <p className="text-xs font-medium" style={{ color: C.textMuted }}>
              {t("withdraw_min_limit_label")}
            </p>
          </div>
          {loading ? (
            <div
              className="h-8 w-28 rounded animate-pulse"
              style={{ background: C.border }}
            />
          ) : (
            <div className="flex items-center gap-2">
              <img height={20} width={20} src={rCoin} />

              <p
                className="font-bold"
                style={{ color: C.textPrimary, fontSize: 26 }}
              >
                {fmtCompact(minLimit)}
              </p>
            </div>
          )}
          <div
            className="w-full h-1.5 rounded-full overflow-hidden"
            style={{ background: C.border }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: "100%",
                background: `linear-gradient(90deg, ${C.pink}, ${C.purple})`,
              }}
            />
          </div>
          <p
            className="text-xs"
            style={{ color: exceedsMin ? C.green : C.orange }}
          >
            {exceedsMin ? t("withdraw_exceeds_min") : t("withdraw_below_min")}
          </p>
        </div>

        {/* Pending */}
        <div
          className="rounded-xl border p-5 flex flex-col gap-3 transition-all duration-200"
          style={{
            background: C.card,
            borderColor: C.border,
            boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,77,141,0.35)";
            e.currentTarget.style.boxShadow = `0 10px 30px ${C.pinkGlow}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = C.border;
            e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.4)";
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(251,146,60,0.1)" }}
            >
              <Clock size={17} style={{ color: C.orange }} />
            </div>
            <p className="text-xs font-medium" style={{ color: C.textMuted }}>
              {t("withdraw_pending_label")}
            </p>
          </div>
          {loading ? (
            <div
              className="h-8 w-28 rounded animate-pulse"
              style={{ background: C.border }}
            />
          ) : (
            <div className="flex items-center gap-2">
              <img height={20} width={20} src={rCoin} />

              <p
                className="font-bold"
                style={{ color: C.textPrimary, fontSize: 26 }}
              >
                {hasPending ? fmtCompact(pendingAmt) : "0"}
              </p>
            </div>
          )}
          <p className="text-xs" style={{ color: C.textMuted }}>
            {hasPending
              ? t("withdraw_pending_awaiting")
              : t("withdraw_pending_none")}
          </p>
        </div>
      </div>

      {/* CTA banner */}
      <div
        className="rounded-xl border p-5 flex items-center justify-between max-sm:w-[calc(100vw-45px)] max-sm:flex-col max-sm:gap-4"
        style={{
          background: C.card,
          borderColor: "rgba(255,77,141,0.25)",
          boxShadow: `0 10px 30px ${C.pinkGlow}`,
        }}
      >
        <div>
          <p className="font-semibold text-sm" style={{ color: C.textPrimary }}>
            {t("withdraw_cta_title")}
          </p>
          <p className="text-xs mt-0.5" style={{ color: C.textMuted }}>
            {t("withdraw_cta_subtitle")}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
          style={{
            background: C.pink,
            boxShadow: `0 4px 14px ${C.pinkGlow}`,
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = C.pinkHover)}
          onMouseLeave={(e) => (e.currentTarget.style.background = C.pink)}
        >
          <Send size={15} /> {t("withdraw_cta_button")}
        </button>
      </div>

      {/* How it works */}
      <div
        className="flex items-start gap-3 p-4 rounded-xl border text-xs max-sm:w-[calc(100vw-45px)]"
        style={{
          background: "rgba(255,77,141,0.04)",
          borderColor: "rgba(255,77,141,0.15)",
        }}
      >
        <Info
          size={14}
          className="mt-0.5 flex-shrink-0"
          style={{ color: C.pink }}
        />
        <p style={{ color: C.textSecondary }}>
          <strong style={{ color: C.textPrimary }}>
            {t("withdraw_how_it_works_title")}:
          </strong>{" "}
          {t("withdraw_how_it_works_body")}
        </p>
      </div>

      {/* History table */}
      <div
        className="rounded-xl border overflow-hidden max-sm:w-[calc(100vw-45px)]"
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
            {t("withdraw_history_title")}
          </h2>
          <p className="text-xs" style={{ color: C.textMuted }}>
            {t("withdraw_history_subtitle")}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {[
                  ["withdraw_col_amount", "Amount"],
                  ["withdraw_col_payment_method", "Payment Method"],
                  ["withdraw_col_request_date", "Request Date"],
                  ["withdraw_col_processed_date", "Processed Date"],
                  ["withdraw_col_status", "Status"],
                  ["withdraw_col_transaction_id", "Transaction ID"],
                ].map(([key, fallback]) => (
                  <th key={key} style={thStyle}>
                    {t(key)}
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
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div
                      className="py-14 text-center text-sm"
                      style={{ color: C.textMuted }}
                    >
                      {t("withdraw_no_history")}
                    </div>
                  </td>
                </tr>
              ) : (
                history.map((r, idx) => (
                  <tr
                    key={r._id}
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
                      className="px-4 py-3.5 font-semibold"
                      style={{ color: C.textPrimary }}
                    >
                      {fmtCompact(r.amount)}
                    </td>
                    <td
                      className="px-4 py-3.5 text-sm"
                      style={{ color: C.textSecondary }}
                    >
                      {r.paymentMethod || "—"}
                    </td>
                    <td
                      className="px-4 py-3.5 text-sm"
                      style={{ color: C.textMuted }}
                    >
                      {new Date(r.requestDate).toLocaleDateString()}
                    </td>
                    <td
                      className="px-4 py-3.5 text-sm"
                      style={{ color: C.textMuted }}
                    >
                      {r.processedDate
                        ? new Date(r.processedDate).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          background:
                            statusStyle[r.statusCode]?.bg ??
                            "rgba(107,114,128,0.12)",
                          color: statusStyle[r.statusCode]?.text ?? C.textMuted,
                        }}
                      >
                        {t(`withdraw_status_${r.statusCode}`)}
                      </span>
                    </td>
                    <td
                      className="px-4 py-3.5 font-mono text-xs"
                      style={{ color: C.textMuted }}
                    >
                      {r.transactionId || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

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

      {showModal && (
        <WithdrawModal
          balance={balance}
          minLimit={minLimit}
          onClose={() => {
            setShowModal(false);
            dispatch(clearSubmitStatus());
          }}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitError={submitError}
        />
      )}
    </div>
  );
}
