import { ChevronLeft, ChevronRight } from "lucide-react";

const C = {
  border: "#1F2937",
  pink: "#FF4D8D",
  card: "#111827",
  textMuted: "#6B7280",
  textSecondary: "#9CA3AF",
  textPrimary: "#F9FAFB",
  hover: "#1E293B",
};

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-2 py-1">
      <p className="text-xs" style={{ color: C.textMuted }}>
        Page{" "}
        <span style={{ color: C.textPrimary, fontWeight: 600 }}>
          {currentPage}
        </span>{" "}
        of{" "}
        <span style={{ color: C.textPrimary, fontWeight: 600 }}>
          {totalPages}
        </span>
      </p>

      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border transition-all"
          style={{
            borderColor: C.border,
            color: currentPage === 1 ? C.textMuted : C.textSecondary,
            background: "transparent",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
            opacity: currentPage === 1 ? 0.4 : 1,
          }}
          onMouseEnter={(e) => {
            if (currentPage !== 1) e.currentTarget.style.background = C.hover;
          }}
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <ChevronLeft size={14} />
        </button>

        {/* Page numbers */}
        {getPages().map((page, i) =>
          page === "..." ? (
            <span
              key={`dot-${i}`}
              className="w-8 h-8 flex items-center justify-center text-xs"
              style={{ color: C.textMuted }}
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border text-xs font-medium transition-all"
              style={{
                borderColor: currentPage === page ? C.pink : C.border,
                background:
                  currentPage === page
                    ? "rgba(255,77,141,0.10)"
                    : "transparent",
                color: currentPage === page ? C.pink : C.textSecondary,
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                if (currentPage !== page)
                  e.currentTarget.style.background = C.hover;
              }}
              onMouseLeave={(e) => {
                if (currentPage !== page)
                  e.currentTarget.style.background = "transparent";
              }}
            >
              {page}
            </button>
          ),
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg border transition-all"
          style={{
            borderColor: C.border,
            color: currentPage === totalPages ? C.textMuted : C.textSecondary,
            background: "transparent",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            opacity: currentPage === totalPages ? 0.4 : 1,
          }}
          onMouseEnter={(e) => {
            if (currentPage !== totalPages)
              e.currentTarget.style.background = C.hover;
          }}
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
