import React, { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    closeDialog,
    fetchBdDropdown,
    fetchUniqueIdUsers,
    createAgency,
    updateAgency,
    resetUniqueIdPagination,
} from "../store/agenciesSlice";
import { X, RefreshCw, ChevronDown, Search, User } from "lucide-react";
import useTranslation from "../../util/useTranslation";

// ─── Theme ───────────────────────────────────────────────────────────────────
const C = {
    bg: "#0F172A",
    card: "#111827",
    surface: "#1F2937",
    border: "#1F2937",
    borderFocus: "#FF4D8D",
    hover: "#1E293B",
    pink: "#FF4D8D",
    textPrimary: "#F9FAFB",
    textSecondary: "#9CA3AF",
    textMuted: "#6B7280",
    error: "#F87171",
    errorBg: "rgba(248,113,113,0.08)",
    errorBorder: "rgba(248,113,113,0.25)",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const generateCode = () =>
    Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)).join("");

const INITIAL_FORM = {
    name: "",
    mobileNumber: "",
    bankDetails: "",
    code: "",
    uniqueId: "",
    bdId: "",
};

const INITIAL_ERRORS = {
    name: "",
    mobileNumber: "",
    bankDetails: "",
    code: "",
    uniqueId: "",
};

// ─── Reusable primitives ──────────────────────────────────────────────────────

function FieldError({ msg }) {
    if (!msg) return null;
    return <p style={{ color: C.error, fontSize: 12, marginTop: 4 }}>{msg}</p>;
}

function Label({ children, required }) {
    return (
        <label
            style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: C.textSecondary,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 6,
            }}
        >
            {children}
            {required && <span style={{ color: C.pink, marginLeft: 2 }}>*</span>}
        </label>
    );
}

function Input({ value, onChange, placeholder, type = "text", readOnly, error, ...rest }) {
    const [focused, setFocused] = useState(false);
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            readOnly={readOnly}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
                width: "100%",
                background: C.bg,
                border: `1px solid ${error ? C.error : focused ? C.borderFocus : C.border}`,
                borderRadius: 8,
                color: readOnly ? C.textSecondary : C.textPrimary,
                padding: "10px 14px",
                fontSize: 13,
                outline: "none",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
                cursor: readOnly ? "default" : "text",
            }}
            {...rest}
        />
    );
}

function Textarea({ value, onChange, placeholder, error }) {
    const [focused, setFocused] = useState(false);
    return (
        <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={3}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
                width: "100%",
                background: C.bg,
                border: `1px solid ${error ? C.error : focused ? C.borderFocus : C.border}`,
                borderRadius: 8,
                color: C.textPrimary,
                padding: "10px 14px",
                fontSize: 13,
                outline: "none",
                resize: "vertical",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
                fontFamily: "inherit",
            }}
        />
    );
}

// ─── SearchableDropdown with built-in debounce ────────────────────────────────
/**
 * Props:
 *  - label / required / error         → field label + validation
 *  - placeholder                      → input hint text
 *  - items                            → array of objects to display
 *  - selectedLabel                    → text shown when an item is selected
 *  - onSelect(item)                   → called immediately when user picks an item
 *  - onSearch(value)                  → called AFTER debounceMs with the typed value
 *  - debounceMs                       → delay in ms (default 350)
 *  - loading / hasMore / onLoadMore   → infinite scroll support
 *  - renderItem(item)                 → render function for each row
 */
function SearchableDropdown({
    label,
    placeholder,
    items,
    selectedLabel,
    onSelect,
    onSearch,
    debounceMs = 500,
    loading,
    hasMore,
    onLoadMore,
    error,
    required,
    renderItem,
}) {
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();

    // inputValue is what the user sees while typing — updates immediately
    const [inputValue, setInputValue] = useState("");
    const debounceRef = useRef(null);
    const containerRef = useRef(null);
    const listRef = useRef(null);

    // Sync display when a selection is made externally (e.g. edit-mode prefill)
    useEffect(() => {
        if (!open) setInputValue(selectedLabel || "");
    }, [selectedLabel, open]);

    // Click-outside → close
    useEffect(() => {
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
                // Restore selected label if user typed without picking anything
                setInputValue(selectedLabel || "");
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [selectedLabel]);

    // Cleanup debounce on unmount
    useEffect(() => () => clearTimeout(debounceRef.current), []);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);   // update display instantly
        setOpen(true);

        // Debounce the actual search callback
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            onSearch?.(value);
        }, debounceMs);
    };

    const handleSelect = (item) => {
        onSelect(item);
        setOpen(false);
        clearTimeout(debounceRef.current); // cancel any pending search after pick
    };

    const handleScroll = () => {
        const el = listRef.current;
        if (!el || loading || !hasMore) return;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
            onLoadMore?.();
        }
    };

    return (
        <div>
            <Label required={required}>{label}</Label>

            <div ref={containerRef} style={{ position: "relative" }}>
                {/* Trigger / search input */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        background: C.bg,
                        border: `1px solid ${error ? C.error : open ? C.borderFocus : C.border}`,
                        borderRadius: 8,
                        padding: "10px 14px",
                        transition: "border-color 0.2s",
                    }}
                >
                    <Search size={13} style={{ color: C.textMuted, flexShrink: 0 }} />

                    <input
                        value={inputValue}
                        onChange={handleInputChange}
                        onFocus={() => setOpen(true)}
                        placeholder={placeholder}
                        style={{
                            flex: 1,
                            background: "transparent",
                            border: "none",
                            outline: "none",
                            color: C.textPrimary,
                            fontSize: 13,
                            cursor: "text",
                        }}
                    />

                    {/* Spinner while debounce is pending or results loading */}
                    {loading ? (
                        <div
                            style={{
                                width: 13,
                                height: 13,
                                borderRadius: "50%",
                                border: `2px solid ${C.border}`,
                                borderTopColor: C.pink,
                                flexShrink: 0,
                                animation: "spin 0.7s linear infinite",
                            }}
                        />
                    ) : (
                        <ChevronDown
                            size={14}
                            style={{
                                color: C.textMuted,
                                flexShrink: 0,
                                transform: open ? "rotate(180deg)" : "none",
                                transition: "transform 0.2s",
                            }}
                        />
                    )}
                </div>

                {/* Dropdown list */}
                {open && (
                    <div
                        ref={listRef}
                        onScroll={handleScroll}
                        style={{
                            position: "absolute",
                            top: "calc(100% + 6px)",
                            left: 0,
                            right: 0,
                            background: C.card,
                            border: `1px solid ${C.border}`,
                            borderRadius: 10,
                            zIndex: 100,
                            maxHeight: 220,
                            overflowY: "auto",
                            boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
                        }}
                    >
                        {!loading && items.length === 0 && (
                            <div
                                style={{
                                    padding: "14px 16px",
                                    color: C.textMuted,
                                    fontSize: 13,
                                    textAlign: "center",
                                }}
                            >
                                {t("no_results_found")}
                            </div>
                        )}

                        {items.map((item) => (
                            <div
                                key={item._id}
                                onClick={() => handleSelect(item)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                    padding: "10px 14px",
                                    cursor: "pointer",
                                    borderBottom: `1px solid ${C.border}`,
                                    transition: "background 0.15s",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = C.hover)}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                            >
                                {renderItem(item)}
                            </div>
                        ))}

                        {loading && (
                            <div
                                style={{
                                    padding: "10px 14px",
                                    color: C.textMuted,
                                    fontSize: 12,
                                    textAlign: "center",
                                }}
                            >
                                {t("loading")}
                            </div>
                        )}

                        {!loading && hasMore === false && items.length > 0 && (
                            <div
                                style={{
                                    padding: "8px 14px",
                                    color: C.textMuted,
                                    fontSize: 11,
                                    textAlign: "center",
                                }}
                            >
                                {t("end_of_results")}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <FieldError msg={error} />
        </div>
    );
}

// ─── UserAvatar ───────────────────────────────────────────────────────────────
function UserAvatar({ src, name, size = 28 }) {
    const [imgErr, setImgErr] = useState(false);
    if (src && !imgErr) {
        return (
            <img
                src={src}
                alt={name}
                width={size}
                height={size}
                onError={() => setImgErr(true)}
                style={{ borderRadius: 6, objectFit: "cover", flexShrink: 0 }}
            />
        );
    }
    return (
        <div
            style={{
                width: size,
                height: size,
                borderRadius: 6,
                background: "linear-gradient(135deg, #FF4D8D, #A78BFA)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: size * 0.4,
                fontWeight: 700,
                color: "#fff",
            }}
        >
            {name?.charAt(0)?.toUpperCase() ?? <User size={size * 0.5} />}
        </div>
    );
}

// ─── AgencyDialog ─────────────────────────────────────────────────────────────
export default function AgencyDialog() {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const {
        dialog: { open, data: editData },
        bdUsers,
        bdLoading,
        uniqueIdUsers,
        uniqueIdPage,
        uniqueIdHasMore,
        uniqueIdLoading,
        dialogLoading,
        dialogError,
    } = useSelector((s) => s.agencies);

    const isEdit = Boolean(editData);

    const [form, setForm] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState(INITIAL_ERRORS);
    const localBdId = localStorage.getItem("bdId");

    // Labels shown inside each dropdown after a selection
    const [bdLabel, setBdLabel] = useState("");
    const [uniqueIdLabel, setUniqueIdLabel] = useState("");

    // Live BD search term (client-side filter, no API call needed)
    const [bdSearch, setBdSearch] = useState("");

    // Client-side BD filter (BD list is small — no need to hit the API)
    const filteredBd = bdSearch
        ? bdUsers.filter(
            (u) =>
                u.name?.toLowerCase().includes(bdSearch.toLowerCase()) ||
                String(u.uniqueId)?.toLowerCase().includes(bdSearch.toLowerCase())
        )
        : bdUsers;
    const localBdUser = bdUsers.find((u) => u._id === localBdId);

    // ── Populate / reset form when dialog opens ───────────────────────────────
    useEffect(() => {
        if (!open) return;
        if (isEdit) {
            setForm({
                name: editData.name ?? "",
                mobileNumber: editData.mobile ?? "",
                bankDetails: editData.bankDetails ?? "",
                code: editData.agencyCode ?? "",
                uniqueId: editData.uniqueId ?? "",
            });
            setUniqueIdLabel(editData.uniqueId ?? "");
            setBdLabel("");
        } else {
            setForm(INITIAL_FORM);
            setBdLabel("");
            setUniqueIdLabel("");
        }
        setErrors(INITIAL_ERRORS);
        setBdSearch("");
    }, [open, isEdit, editData]);

    // ── Fetch dropdowns when dialog opens ────────────────────────────────────
    useEffect(() => {
        if (!open) return;
        dispatch(fetchBdDropdown());
        dispatch(resetUniqueIdPagination());
        dispatch(fetchUniqueIdUsers({ page: 1, search: "", append: false }));
    }, [open, dispatch]);

    // ── UniqueId: debounced search from SearchableDropdown calls this ─────────
    // The component already debounced, so we just dispatch directly.
    const handleUniqueIdSearch = useCallback(
        (value) => {
            dispatch(resetUniqueIdPagination());
            dispatch(fetchUniqueIdUsers({ page: 1, search: value, append: false }));
        },
        [dispatch]
    );

    const handleUniqueIdLoadMore = useCallback(() => {
        dispatch(
            fetchUniqueIdUsers({
                page: uniqueIdPage + 1,
                search: "",   // keep current search term if needed — extend as required
                append: true,
            })
        );
    }, [dispatch, uniqueIdPage]);


    // ── Validation ────────────────────────────────────────────────────────────
    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = t("name_required");
        if (!form.mobileNumber) errs.mobileNumber = t("mobile_number_required");
        if (!form.bankDetails.trim()) errs.bankDetails = t("bank_details_required");
        if (!form.code) errs.code = t("agency_code_required");
        else if (form.code.length < 5) errs.code = t("min_5_digits");
        else if (form.code.length > 10) errs.code = t("max_10_digits");
        if (!isEdit) {
            if (!form.uniqueId) errs.uniqueId = t("select_user");
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    // ── Submit ────────────────────────────────────────────────────────────────
    const handleSubmit = () => {
        if (!validate()) return;
        const payload = {
            name: form.name.trim(),
            mobile: form.mobileNumber,
            bankDetails: form.bankDetails.trim(),
            agencyCode: form.code,
        };
        if (isEdit) {
            dispatch(updateAgency({ payload, agencyId: editData._id }));
        } else {
            dispatch(createAgency({ ...payload, uniqueId: form.uniqueId, bdId: localBdId }));
        }
    };

    const handleClose = () => dispatch(closeDialog());

    if (!open) return null;

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <>
            {/* Backdrop */}
            <div
                onClick={handleClose}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: "100vw",
                    height: "100vh",
                    background: "rgba(0,0,0,0.7)",
                    backdropFilter: "blur(4px)",
                    zIndex: 9998,
                }}
            />

            {/* Panel */}
            <div
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                    width: "min(540px, calc(100vw - 32px))",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    background: C.card,
                    border: `1px solid ${C.border}`,
                    borderRadius: 16,
                    boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
                    zIndex: 9999,
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "20px 24px 0",
                    }}
                >
                    <div>
                        <h2 style={{ color: C.textPrimary, fontSize: 18, fontWeight: 700, margin: 0 }}>
                            {isEdit ? t("edit_agency") : t("create_agency")}
                        </h2>
                        <p style={{ color: C.textMuted, fontSize: 12, margin: "4px 0 0" }}>
                            {isEdit
                                ? t("update_agency_info")
                                : t("fill_details_to_register")}
                        </p>
                    </div>

                    <button
                        onClick={handleClose}
                        style={{
                            background: C.surface,
                            border: `1px solid ${C.border}`,
                            borderRadius: 8,
                            color: C.textSecondary,
                            cursor: "pointer",
                            padding: 6,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = C.error;
                            e.currentTarget.style.color = C.error;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = C.border;
                            e.currentTarget.style.color = C.textSecondary;
                        }}
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Accent line */}
                <div
                    style={{
                        height: 2,
                        background: `linear-gradient(90deg, ${C.pink}, transparent)`,
                        margin: "16px 24px 0",
                    }}
                />

                {/* Body */}
                <div
                    style={{
                        padding: "20px 24px 24px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 18,
                    }}
                >
                    {/* Dialog-level error */}
                    {dialogError && (
                        <div
                            style={{
                                background: C.errorBg,
                                border: `1px solid ${C.errorBorder}`,
                                borderRadius: 8,
                                padding: "10px 14px",
                                color: C.error,
                                fontSize: 13,
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            <span>⚠</span>
                            <span>{dialogError}</span>
                        </div>
                    )}

                    {/* BD dropdown — create only, client-side debounce */}
                    {!isEdit && (
                        <div>
                            <Label>{t("bd")}</Label>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                background: C.bg,
                                border: `1px solid ${C.border}`,
                                borderRadius: 8,
                                padding: "10px 14px",
                                opacity: 0.8,
                            }}>
                                {localBdUser && <UserAvatar src={localBdUser.image} name={localBdUser.name} />}
                                <div>
                                    <p style={{ color: C.textPrimary, fontSize: 13, margin: 0, fontWeight: 500 }}>
                                        {localBdUser?.name ?? "—"}
                                    </p>
                                    <p style={{ color: C.textMuted, fontSize: 11, margin: 0 }}>
                                        #{localBdUser?.uniqueId ?? localBdId}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* UniqueId dropdown — create only, API debounce */}
                    {!isEdit && (
                        <SearchableDropdown
                            label={t("select_user_by_unique_id")}
                            placeholder={t("search_by_name_or_unique_id")}
                            items={uniqueIdUsers}
                            selectedLabel={uniqueIdLabel}
                            onSearch={handleUniqueIdSearch}
                            debounceMs={500}
                            onSelect={(user) => {
                                setForm((f) => ({ ...f, uniqueId: user.uniqueId }));
                                setUniqueIdLabel(`${user.uniqueId}`);
                                setErrors((e) => ({ ...e, uniqueId: "" }));
                            }}
                            loading={uniqueIdLoading}
                            hasMore={uniqueIdHasMore}
                            onLoadMore={handleUniqueIdLoadMore}
                            error={errors.uniqueId}
                            required
                            renderItem={(user) => (
                                <>
                                    <UserAvatar src={user.image} name={user.name} />
                                    <div>
                                        <p style={{ color: C.textPrimary, fontSize: 13, margin: 0, fontWeight: 500 }}>
                                            {user.name}
                                        </p>
                                        <p style={{ color: C.textMuted, fontSize: 11, margin: 0 }}>
                                            #{user.uniqueId}
                                        </p>
                                    </div>
                                </>
                            )}
                        />
                    )}

                    {/* Name */}
                    <div>
                        <Label required>{t("agency_name")}</Label>
                        <Input
                            value={form.name}
                            placeholder={t("enter_agency_name")}
                            error={errors.name}
                            onChange={(e) => {
                                setForm((f) => ({ ...f, name: e.target.value }));
                                if (e.target.value) setErrors((err) => ({ ...err, name: "" }));
                            }}
                        />
                        <FieldError msg={errors.name} />
                    </div>

                    {/* Mobile */}
                    <div>
                        <Label required>{t("mobile_number")}</Label>
                        <Input
                            type="number"
                            value={form.mobileNumber}
                            placeholder={t("enter_mobile_number")}
                            error={errors.mobileNumber}
                            onChange={(e) => {
                                setForm((f) => ({ ...f, mobileNumber: e.target.value }));
                                if (e.target.value) setErrors((err) => ({ ...err, mobileNumber: "" }));
                            }}
                        />
                        <FieldError msg={errors.mobileNumber} />
                    </div>

                    {/* Bank details */}
                    <div>
                        <Label required>{t("bank_details")}</Label>
                        <Textarea
                            value={form.bankDetails}
                            placeholder={t("enter_bank_details")}
                            error={errors.bankDetails}
                            onChange={(e) => {
                                setForm((f) => ({ ...f, bankDetails: e.target.value }));
                                if (e.target.value) setErrors((err) => ({ ...err, bankDetails: "" }));
                            }}
                        />
                        <FieldError msg={errors.bankDetails} />
                    </div>

                    {/* Agency code */}
                    <div>
                        <Label required>{t("agency_code")}</Label>
                        <div style={{ display: "flex", gap: 8 }}>
                            <div style={{ flex: 1 }}>
                                <Input
                                    type="number"
                                    value={form.code}
                                    placeholder={t("five_digit_code")}
                                    readOnly
                                    error={errors.code}
                                />
                            </div>
                            {!isEdit && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        const c = generateCode();
                                        setForm((f) => ({ ...f, code: c }));
                                        setErrors((e) => ({ ...e, code: "" }));
                                    }}
                                    style={{
                                        flexShrink: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 6,
                                        background: "rgba(255,77,141,0.1)",
                                        border: "1px solid rgba(255,77,141,0.3)",
                                        borderRadius: 8,
                                        color: C.pink,
                                        padding: "0 14px",
                                        fontSize: 12,
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        transition: "background 0.2s",
                                        whiteSpace: "nowrap",
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,77,141,0.2)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,77,141,0.1)")}
                                >
                                    <RefreshCw size={13} />
                                    {t("auto_generate")}
                                </button>
                            )}
                        </div>
                        <FieldError msg={errors.code} />
                    </div>

                    {/* Divider */}
                    <div style={{ height: 1, background: C.border }} />

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={dialogLoading}
                            style={{
                                background: "transparent",
                                border: `1px solid ${C.border}`,
                                borderRadius: 8,
                                color: C.textSecondary,
                                padding: "10px 20px",
                                fontSize: 13,
                                fontWeight: 500,
                                cursor: "pointer",
                                transition: "border-color 0.2s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.textSecondary)}
                            onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
                        >
                            {t("cancel")}
                        </button>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={dialogLoading}
                            style={{
                                background: dialogLoading ? "rgba(255,77,141,0.4)" : C.pink,
                                border: "none",
                                borderRadius: 8,
                                color: "#fff",
                                padding: "10px 24px",
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: dialogLoading ? "not-allowed" : "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                minWidth: 120,
                                justifyContent: "center",
                                transition: "opacity 0.2s",
                            }}
                            onMouseEnter={(e) => { if (!dialogLoading) e.currentTarget.style.opacity = "0.88"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                        >
                            {dialogLoading ? (
                                <>
                                    <div
                                        style={{
                                            width: 14,
                                            height: 14,
                                            borderRadius: "50%",
                                            border: "2px solid rgba(255,255,255,0.3)",
                                            borderTopColor: "#fff",
                                            animation: "spin 0.7s linear infinite",
                                        }}
                                    />
                                    {isEdit ? t("saving") : t("creating")}
                                </>
                            ) : isEdit ? (
                                t("save_changes")
                            ) : (
                                t("create_agency")
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #374151; border-radius: 4px; }
      `}</style>
        </>
    );
}