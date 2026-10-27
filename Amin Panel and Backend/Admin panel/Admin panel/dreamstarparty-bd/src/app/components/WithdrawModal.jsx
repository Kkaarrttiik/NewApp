import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPaymentMethods, fetchBdSetting } from "../store/withdrawSlice";
import { Send, X, ChevronDown, Info, Wallet, AlertCircle } from "lucide-react";
import rCoin from "../../images/rcoin.webp";
import useTranslation from "../../util/useTranslation";

const C = {
  bg: "#0A0F1E",
  card: "#0F1628",
  surface: "#141D35",
  border: "#1E2D4A",
  borderLight: "#243558",
  pink: "#FF4D8D",
  pinkHover: "#FF2E75",
  pinkGlow: "rgba(255,77,141,0.2)",
  pinkBg: "rgba(255,77,141,0.08)",
  pinkBorder: "rgba(255,77,141,0.3)",
  green: "#10D9A0",
  greenBg: "rgba(16,217,160,0.08)",
  greenBorder: "rgba(16,217,160,0.25)",
  red: "#FF5F7E",
  redBg: "rgba(255,95,126,0.08)",
  redBorder: "rgba(255,95,126,0.3)",
  textPrimary: "#F0F4FF",
  textSecondary: "#8896B3",
  textMuted: "#4E607A",
};

const fmtFull = (n) => `$${(n || 0).toLocaleString()}`;

export default function WithdrawModal({
  balance,
  minLimit,
  onClose,
  onSubmit,
  submitting,
  submitError,
}) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { paymentMethods, paymentMethodsLoading, bdSetting, bdSettingLoading } =
    useSelector((s) => s.withdraw);

  const [coin, setCoin] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({});
  const [touched, setTouched] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [methodDeletedError, setMethodDeletedError] = useState(false);

  useEffect(() => {
    dispatch(fetchPaymentMethods());
    dispatch(fetchBdSetting());
  }, [dispatch]);

  useEffect(() => {
    if (paymentMethods.length > 0 && !selectedMethod) {
      setSelectedMethod(paymentMethods[0]);
      setPaymentDetails({});
    }
  }, [paymentMethods]);

  const num = parseFloat(coin) || 0;
  const rCoinRate = bdSetting?.rCoinForCashOut || 1;
  const minCoins = bdSetting?.minRcoinForCashOutBd || minLimit;
  const currencySymbol = bdSetting?.currency?.symbol || "$";
  const convertedAmount = num > 0 ? (num / rCoinRate).toFixed(2) : null;

  const handleMethodChange = (methodId) => {
    const m = paymentMethods.find((p) => p._id === methodId);
    setSelectedMethod(m);
    setPaymentDetails({});
  };

  const handleDetailChange = (key, value) => {
    setPaymentDetails((prev) => ({ ...prev, [key]: value }));
  };

  const detailKeys = selectedMethod ? Object.keys(selectedMethod.details) : [];
  const emptyDetailKeys = detailKeys.filter(
    (k) => !String(paymentDetails[k] ?? "").trim(),
  );

  const coinError =
    num <= 0
      ? t("withdraw_modal_amount_error_required")
      : num < minCoins
        ? t("withdraw_modal_amount_error_min", { minCoins })
        : num > balance
          ? t("withdraw_modal_amount_error_max", { balance })
          : "";

  const methodError = !selectedMethod
    ? t("withdraw_modal_payment_method_error")
    : "";
  const descriptionError = !description.trim()
    ? t("withdraw_modal_description_error")
    : "";
  const isValid =
    !coinError &&
    !methodError &&
    !descriptionError &&
    emptyDetailKeys.length === 0;

  const handleSubmit = async () => {
    setTouched(true);
    setMethodDeletedError(false);
    if (!isValid || submitting) return;

    const result = await dispatch(fetchPaymentMethods());
    const freshMethods = result?.payload;

    if (!Array.isArray(freshMethods)) return;

    const stillExists = freshMethods.some((m) => m._id === selectedMethod._id);

    if (!stillExists) {
      setMethodDeletedError(true);
      setSelectedMethod(freshMethods[0] || null);
      setPaymentDetails({});
      setTouched(false);
      return;
    }

    onSubmit(num, description, selectedMethod.name, paymentDetails);
  };

  const inputBase = {
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    color: C.textPrimary,
    padding: "10px 14px",
    fontSize: 13.5,
    outline: "none",
    width: "100%",
    transition: "border-color 0.15s, box-shadow 0.15s",
    fontFamily: "inherit",
  };

  const inputError = {
    ...inputBase,
    border: `1px solid ${C.redBorder}`,
    background: C.redBg,
  };

  const inputFocused = {
    borderColor: C.pink,
    boxShadow: `0 0 0 3px ${C.pinkGlow}`,
  };

  const getInputStyle = (fieldName, hasError) => ({
    ...(touched && hasError ? inputError : inputBase),
    ...(focusedField === fieldName ? inputFocused : {}),
  });

  const Label = ({ children }) => (
    <label
      style={{
        display: "block",
        fontSize: 11.5,
        fontWeight: 600,
        color: C.textSecondary,
        marginBottom: 7,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </label>
  );

  const ErrorMsg = ({ msg }) =>
    msg ? (
      <p
        style={{
          fontSize: 11.5,
          color: C.red,
          marginTop: 5,
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <AlertCircle size={11} /> {msg}
      </p>
    ) : null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 420,
          margin: "0 16px",
          borderRadius: 20,
          overflow: "hidden",
          background: C.card,
          border: `1px solid ${C.border}`,
          boxShadow: `0 40px 80px rgba(0,0,0,0.7), 0 0 60px ${C.pinkGlow}`,
          maxHeight: "92vh",
          overflowY: "auto",
          scrollbarWidth: "none",
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 20px 16px",
            borderBottom: `1px solid ${C.border}`,
            background: C.bg,
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: C.pinkBg,
                border: `1px solid ${C.pinkBorder}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Send size={15} color={C.pink} />
            </div>
            <div>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: C.textPrimary,
                  margin: 0,
                }}
              >
                {t("withdraw_modal_title")}
              </p>
              <p style={{ fontSize: 11, color: C.textMuted, margin: 0 }}>
                {t("withdraw_modal_subtitle")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              border: `1px solid ${C.border}`,
              background: "transparent",
              cursor: "pointer",
              color: C.textSecondary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = C.pinkBorder;
              e.currentTarget.style.color = C.pink;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = C.border;
              e.currentTarget.style.color = C.textSecondary;
            }}
          >
            <X size={14} />
          </button>
        </div>

        <div
          style={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {/* ── Balance + Error Row ── */}

          {/* ── API Error ── */}
          {submitError && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                background: C.redBg,
                border: `1px solid ${C.redBorder}`,
                color: C.red,
                fontSize: 12.5,
                display: "flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              <AlertCircle size={13} /> {submitError}
            </div>
          )}

          {/* ── Amount ── */}
          <div>
            <Label>{t("withdraw_modal_amount_label")}</Label>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 13,
                  color: C.textMuted,
                  pointerEvents: "none",
                }}
              >
                {bdSettingLoading ? (
                  "..."
                ) : (
                  <img height={18} width={18} src={rCoin} />
                )}
              </span>
              <input
                type="number"
                value={coin}
                onChange={(e) => setCoin(e.target.value)}
                placeholder={t("withdraw_modal_amount_placeholder", {
                  minLimit,
                })}
                style={{ ...getInputStyle("coin", coinError), paddingLeft: 38 }}
                onFocus={() => setFocusedField("coin")}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            {touched && coinError ? <ErrorMsg msg={coinError} /> : null}
            {!bdSettingLoading && convertedAmount && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 6,
                }}
              >
                <p style={{ fontSize: 11.5, color: C.textMuted, margin: 0 }}>
                  {t("withdraw_modal_converted", {
                    symbol: currencySymbol,
                    amount: convertedAmount,
                    rate: rCoinRate,
                  })}
                </p>
                {num > 0 && (
                  <p style={{ fontSize: 11.5, color: C.textMuted, margin: 0 }}>
                    {t("withdraw_modal_balance", {
                      balance: balance.toLocaleString(),
                    })}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* ── Quick Amounts ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 8,
            }}
          >
            {[500, 1000, 5000, balance].map((q) => {
              const active = num === q;
              return (
                <button
                  key={q}
                  onClick={() => setCoin(String(q))}
                  style={{
                    padding: "8px 4px",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    border: `1px solid ${active ? C.pink : C.border}`,
                    background: active ? C.pink : C.surface,
                    color: active ? "#fff" : C.textSecondary,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    boxShadow: active ? `0 4px 12px ${C.pinkGlow}` : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.borderColor = C.pinkBorder;
                      e.currentTarget.style.color = C.pink;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.borderColor = C.border;
                      e.currentTarget.style.color = C.textSecondary;
                    }
                  }}
                >
                  {q === balance
                    ? t("withdraw_modal_quick_max")
                    : `$${q >= 1000 ? `${q / 1000}k` : q}`}
                </button>
              );
            })}
          </div>

          {/* ── Description ── */}
          <div>
            <Label>{t("withdraw_modal_description_label")}</Label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("withdraw_modal_description_placeholder")}
              style={getInputStyle("desc", descriptionError)}
              onFocus={() => setFocusedField("desc")}
              onBlur={() => setFocusedField(null)}
            />
            {touched && descriptionError && <ErrorMsg msg={descriptionError} />}
          </div>

          {/* ── Divider ── */}
          <div style={{ height: 1, background: C.border, margin: "0 -20px" }} />

          {/* ── Payment Method ── */}
          <div>
            <Label>{t("withdraw_modal_payment_method_label")}</Label>
            {paymentMethodsLoading ? (
              <div
                style={{
                  height: 42,
                  borderRadius: 10,
                  background: C.surface,
                  animation: "pulse 1.5s infinite",
                }}
              />
            ) : (
              <div style={{ position: "relative" }}>
                <select
                  value={selectedMethod?._id || ""}
                  onChange={(e) => handleMethodChange(e.target.value)}
                  style={{
                    ...getInputStyle("method", methodError),
                    appearance: "none",
                    cursor: "pointer",
                    paddingRight: 36,
                  }}
                  onFocus={() => setFocusedField("method")}
                  onBlur={() => setFocusedField(null)}
                >
                  <option value="" disabled>
                    {t("withdraw_modal_payment_method_placeholder")}
                  </option>
                  {paymentMethods.map((m) => (
                    <option
                      key={m._id}
                      value={m._id}
                      style={{ background: C.card }}
                    >
                      {m.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                    color: C.textMuted,
                  }}
                />
              </div>
            )}
            {touched && methodError && <ErrorMsg msg={methodError} />}
            {methodDeletedError && (
              <ErrorMsg msg={t("withdraw_modal_payment_method_deleted")} />
            )}
          </div>

          {/* ── Dynamic Detail Fields ── */}
          {selectedMethod && detailKeys.length > 0 && (
            <div
              style={{
                padding: "16px",
                borderRadius: 12,
                background: C.surface,
                border: `1px solid ${C.border}`,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: C.textMuted,
                  margin: 0,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {t("withdraw_modal_details_title", {
                  methodName: selectedMethod.name,
                })}
              </p>
              {detailKeys.map((key) => {
                const isEmpty =
                  touched && !String(paymentDetails[key] ?? "").trim();
                return (
                  <div key={key}>
                    <Label>{key} *</Label>
                    <input
                      value={paymentDetails[key] || ""}
                      onChange={(e) => handleDetailChange(key, e.target.value)}
                      placeholder={t("withdraw_modal_detail_placeholder", {
                        key,
                      })}
                      style={getInputStyle(`detail_${key}`, isEmpty)}
                      onFocus={() => setFocusedField(`detail_${key}`)}
                      onBlur={() => setFocusedField(null)}
                    />
                    {isEmpty && (
                      <ErrorMsg
                        msg={t("withdraw_modal_detail_error", { key })}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Notice ── */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              padding: "12px 14px",
              borderRadius: 10,
              background: "rgba(255,77,141,0.04)",
              border: `1px solid rgba(255,77,141,0.12)`,
            }}
          >
            <Info
              size={13}
              color={C.pink}
              style={{ flexShrink: 0, marginTop: 1 }}
            />
            <p
              style={{
                fontSize: 12,
                color: C.textSecondary,
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              {t("withdraw_modal_notice")}
            </p>
          </div>
        </div>

        {/* ── Footer ── */}
        <div
          style={{
            display: "flex",
            gap: 10,
            padding: "0 20px 20px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "11px",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 600,
              border: `1px solid ${C.border}`,
              background: C.surface,
              color: C.textSecondary,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = C.borderLight;
              e.currentTarget.style.color = C.textPrimary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = C.border;
              e.currentTarget.style.color = C.textSecondary;
            }}
          >
            {t("withdraw_modal_cancel")}
          </button>
          <button
            onClick={handleSubmit}  
            disabled={submitting}
            style={{
              flex: 2,
              padding: "11px",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 700,
              border: "none",
              background: `linear-gradient(135deg, ${C.pink}, #FF6B6B)`,
              color: "#fff",
              cursor: submitting ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: `0 6px 20px ${C.pinkGlow}`,
              opacity: submitting ? 0.75 : 1,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              if (!submitting)
                e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {submitting ? (
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "#fff",
                  animation: "spin 0.7s linear infinite",
                }}
              />
            ) : (
              <>
                <Send size={14} /> {t("withdraw_modal_submit")}
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
            @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
            input[type=number]::-webkit-inner-spin-button,
            input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
            select option { background: #0F1628; color: #F0F4FF; }
            .withdraw-modal-inner::-webkit-scrollbar { display: none; }
    `}</style>
    </div>
  );
}
