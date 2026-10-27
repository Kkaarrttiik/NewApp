import { useState } from "react";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import useTranslation from "../../util/useTranslation";

const C = {
  bg: "#0F172A",
  card: "#1F2937",
  card2: "#1a1d27",
  border: "#374151",
  hover: "#1E293B",
  pink: "#FF4D8D",
  pinkGlow: "rgba(255,77,141,0.15)",
  textPrimary: "#F9FAFB",
  textSecondary: "#9CA3AF",
  textMuted: "#6B7280",
};

const darkCalendarClassNames = {
  months: "flex flex-col sm:flex-row gap-2",
  month: "flex flex-col gap-4",
  caption: "flex justify-center pt-1 relative items-center w-full",
  caption_label: "text-sm font-medium text-[#F9FAFB]",
  nav: "flex items-center gap-1",
  nav_button:
    "size-7 bg-transparent p-0 opacity-60 hover:opacity-100 border border-[#374151] rounded-md flex items-center justify-center text-[#9CA3AF] hover:bg-[#1E293B] hover:text-[#F9FAFB] transition-colors",
  nav_button_previous: "absolute left-1",
  nav_button_next: "absolute right-1",
  table: "w-full border-collapse space-x-1",
  head_row: "flex",
  head_cell: "text-[#6B7280] rounded-md w-8 font-normal text-[0.8rem]",
  row: "flex w-full mt-2",
  cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-[#FF4D8D20] rounded-md",
  day: "size-8 p-0 font-normal text-[#F9FAFB] rounded-md hover:bg-[#374151] hover:text-[#F9FAFB] transition-colors aria-selected:opacity-100",
  day_selected:
    "bg-[#FF4D8D] text-white hover:bg-[#FF4D8D] hover:text-white focus:bg-[#FF4D8D] focus:text-white rounded-md",
  day_today: "border border-[#FF4D8D] text-[#FF4D8D]",
  day_outside: "text-[#4B5563] opacity-40 aria-selected:text-[#4B5563]",
  day_disabled: "text-[#4B5563] opacity-30 cursor-not-allowed",
  day_range_middle: "aria-selected:bg-[#FF4D8D20] aria-selected:text-[#F9FAFB]",
  day_hidden: "invisible",
};

const DateRangeModal = ({ startDate, endDate, onApply, onClear }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [draftStart, setDraftStart] = useState(startDate);
  const [draftEnd, setDraftEnd] = useState(endDate);
  const [startPopoverOpen, setStartPopoverOpen] = useState(false);
  const [endPopoverOpen, setEndPopoverOpen] = useState(false);

  const handleOpen = () => {
    setDraftStart(startDate);
    setDraftEnd(endDate);
    setIsOpen(true);
  };

  const handleApply = () => {
    onApply?.(draftStart, draftEnd);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setDraftStart(undefined);
    setDraftEnd(undefined);
    onClear?.();
    setIsOpen(false);
  };

  const hasRange = startDate && endDate;

  const triggerLabel = hasRange
    ? t("date_range_trigger_formatted", {
        startDate: format(startDate, "dd MMM"),
        endDate: format(endDate, "dd MMM yyyy"),
      })
    : t("date_range_trigger_label");

  return (
    <>
      <button
        onClick={handleOpen}
        className="inline-flex items-center gap-2 max-sm:w-full cursor-pointer outline-none transition-all duration-200"
        style={{
          background: "#1F2937",
          border: `1px solid ${hasRange ? C.pink : "#374151"}`,
          borderRadius: 8,
          color: hasRange ? C.textPrimary : "#9CA3AF",
          padding: "8px 12px",
          fontSize: 13,
          boxShadow: hasRange ? `0 2px 12px ${C.pinkGlow}` : "none",
          whiteSpace: "nowrap",
        }}
      >
        <CalendarIcon
          size={14}
          style={{ color: hasRange ? C.pink : "#9CA3AF" }}
        />
        {triggerLabel}
        {hasRange && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              setDraftStart(undefined);
              setDraftEnd(undefined);
              onClear?.();
            }}
            className="ml-1 rounded-full p-0.5 hover:bg-white/10 transition-colors"
            style={{ color: C.textMuted }}
          >
            <X size={12} />
          </span>
        )}
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border p-6"
            style={{
              background: C.card,
              borderColor: C.border,
              boxShadow:
                "0 25px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,77,141,0.08)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2
                  className="text-base font-semibold"
                  style={{ color: C.textPrimary }}
                >
                  {t("date_range_modal_title")}
                </h2>
                <p className="text-xs mt-0.5" style={{ color: C.textMuted }}>
                  {t("date_range_modal_subtitle")}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 transition-all duration-200"
                style={{ color: C.textMuted }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = C.hover;
                  e.currentTarget.style.color = C.textPrimary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = C.textMuted;
                }}
              >
                <X size={17} />
              </button>
            </div>

            <div className="mb-5 h-px" style={{ background: C.border }} />

            {/* Date Inputs */}
            <div className="flex flex-col gap-4 sm:flex-row">
              {/* Start Date */}
              <div className="flex-1">
                <label
                  className="mb-2 block text-xs font-medium"
                  style={{ color: C.textMuted }}
                >
                  {t("date_range_start_label")}
                </label>
                <Popover
                  open={startPopoverOpen}
                  onOpenChange={setStartPopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <button
                      className="flex h-10 w-full items-center justify-between rounded-lg border px-3 text-sm transition-all duration-200"
                      style={{
                        background: C.card2,
                        borderColor: draftStart ? C.pink : C.border,
                        color: draftStart ? C.textPrimary : C.textMuted,
                        boxShadow: draftStart
                          ? `0 0 0 1px ${C.pink}30`
                          : "none",
                      }}
                    >
                      {draftStart
                        ? format(draftStart, "dd MMM yyyy")
                        : t("date_range_placeholder")}
                      <CalendarIcon
                        size={14}
                        style={{ color: draftStart ? C.pink : C.textMuted }}
                      />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0"
                    style={{
                      background: C.card,
                      border: `1px solid ${C.border}`,
                      borderRadius: 12,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
                    }}
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={draftStart}
                      onSelect={(date) => {
                        setDraftStart(date);
                        if (draftEnd && date && draftEnd < date)
                          setDraftEnd(undefined);
                        setStartPopoverOpen(false);
                      }}
                      initialFocus
                      classNames={darkCalendarClassNames}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="hidden items-end pb-2.5 sm:flex">
                <span
                  className="text-xs font-medium"
                  style={{ color: C.textMuted }}
                >
                  →
                </span>
              </div>

              {/* End Date */}
              <div className="flex-1">
                <label
                  className="mb-2 block text-xs font-medium"
                  style={{ color: C.textMuted }}
                >
                  {t("date_range_end_label")}
                </label>
                <Popover open={endPopoverOpen} onOpenChange={setEndPopoverOpen}>
                  <PopoverTrigger asChild>
                    <button
                      className="flex h-10 w-full items-center justify-between rounded-lg border px-3 text-sm transition-all duration-200"
                      style={{
                        background: C.card2,
                        borderColor: draftEnd ? C.pink : C.border,
                        color: draftEnd ? C.textPrimary : C.textMuted,
                        boxShadow: draftEnd ? `0 0 0 1px ${C.pink}30` : "none",
                      }}
                    >
                      {draftEnd
                        ? format(draftEnd, "dd MMM yyyy")
                        : t("date_range_placeholder")}
                      <CalendarIcon
                        size={14}
                        style={{ color: draftEnd ? C.pink : C.textMuted }}
                      />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0"
                    style={{
                      background: C.card,
                      border: `1px solid ${C.border}`,
                      borderRadius: 12,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
                    }}
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={draftEnd}
                      onSelect={(date) => {
                        setDraftEnd(date);
                        setEndPopoverOpen(false);
                      }}
                      disabled={(date) =>
                        draftStart ? date < draftStart : false
                      }
                      initialFocus
                      classNames={darkCalendarClassNames}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Selected Range Preview */}
            {(draftStart || draftEnd) && (
              <div
                className="mt-4 rounded-lg px-3 py-2.5 text-xs flex items-center gap-2"
                style={{
                  background: `${C.pink}10`,
                  border: `1px solid ${C.pink}25`,
                  color: C.textSecondary,
                }}
              >
                <CalendarIcon
                  size={12}
                  style={{ color: C.pink, flexShrink: 0 }}
                />
                <span>
                  {draftStart ? format(draftStart, "dd MMM yyyy") : "—"}
                  <span style={{ color: C.textMuted }} className="mx-2">
                    {t("date_range_preview_to")}
                  </span>
                  {draftEnd ? format(draftEnd, "dd MMM yyyy") : "—"}
                </span>
              </div>
            )}

            <div className="mt-5 mb-4 h-px" style={{ background: C.border }} />

            {/* Footer */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={handleCancel}
                className="rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200"
                style={{ color: C.textMuted, background: "transparent" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = C.hover;
                  e.currentTarget.style.color = C.textPrimary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = C.textMuted;
                }}
              >
                {t("date_range_cancel")}
              </button>
              <button
                onClick={handleApply}
                disabled={!draftStart || !draftEnd}
                className="rounded-lg px-5 py-2 text-sm font-semibold transition-all duration-200"
                style={{
                  background:
                    draftStart && draftEnd
                      ? `linear-gradient(135deg, ${C.pink}, #c0375e)`
                      : C.border,
                  color: draftStart && draftEnd ? "#fff" : C.textMuted,
                  boxShadow:
                    draftStart && draftEnd
                      ? `0 4px 15px ${C.pinkGlow}`
                      : "none",
                  cursor: draftStart && draftEnd ? "pointer" : "not-allowed",
                }}
                onMouseEnter={(e) => {
                  if (draftStart && draftEnd)
                    e.currentTarget.style.boxShadow = `0 6px 20px rgba(255,77,141,0.4)`;
                }}
                onMouseLeave={(e) => {
                  if (draftStart && draftEnd)
                    e.currentTarget.style.boxShadow = `0 4px 15px ${C.pinkGlow}`;
                }}
              >
                {t("date_range_apply")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DateRangeModal;
