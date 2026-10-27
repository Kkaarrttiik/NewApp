import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchActiveLanguages,
  fetchTranslations,
  setSelectedLanguage,
} from "../store/language/action";
import { baseURL } from "../util/Config";
import "./LanguageSwitcher.css";

// ─── Read URL param directly (no useSearchParams needed) ─────────────────────
// Safe to use outside BrowserRouter since it reads window.location directly.
const getUrlLangParam = () => {
  try {
    return (
      new URLSearchParams(window.location.search)
        .get("language")
        ?.trim()
        ?.toLowerCase() || null
    );
  } catch {
    return null;
  }
};

const LanguageSwitcher = () => {
  const dispatch = useDispatch();
  const {
    activeLanguages,
    selectedLanguageCode,
    selectedLanguage,
    loadingTranslations,
  } = useSelector((state) => state.language);

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // --- Draggable State ---
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const hasMovedRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const initialPosRef = useRef({ x: 0, y: 0 });
  const positionRef = useRef({ x: 0, y: 0 });
  const wrapperRef = useRef(null);

  // Sync Ref with state for internal calculations
  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  // Initialize position to bottom-right (0,0 translation from CSS default)
  useEffect(() => {
    // We start at (0,0) which is bottom: 24px, right: 24px defined in CSS
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;

    isDraggingRef.current = true;
    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    initialPosRef.current = positionRef.current;

    // Prevent text selection while dragging
    document.body.style.userSelect = "none";
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    isDraggingRef.current = true;
    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartRef.current = { x: touch.clientX, y: touch.clientY };
    initialPosRef.current = positionRef.current;
  };

  useEffect(() => {
    const handleMove = (e) => {
      if (!isDraggingRef.current) return;

      if (e.type === "touchmove") {
        e.preventDefault(); // Prevent scrolling while dragging
      }

      const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
      const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;

      const dx = clientX - dragStartRef.current.x;
      const dy = clientY - dragStartRef.current.y;

      if (Math.abs(dx) > 15 || Math.abs(dy) > 15) {
        hasMovedRef.current = true;
      }

      // Calculate new position
      let newX = initialPosRef.current.x + dx;
      let newY = initialPosRef.current.y + dy;

      // Constrain within viewport
      if (wrapperRef.current) {
        const width = wrapperRef.current.offsetWidth;
        const height = wrapperRef.current.offsetHeight;
        const margin = window.innerWidth <= 480 ? 20 : 30;

        // The default position is bottom: margin, right: margin.
        // translate(0,0) is that point.
        const untranslatedLeft = window.innerWidth - margin - width;
        const untranslatedTop = window.innerHeight - margin - height;

        const minX = -untranslatedLeft + (window.innerWidth <= 480 ? 10 : 15);
        const maxX = margin - (window.innerWidth <= 480 ? 10 : 15);
        const minY = -untranslatedTop + (window.innerWidth <= 480 ? 10 : 15);
        const maxY = margin - (window.innerWidth <= 480 ? 10 : 15);

        newX = Math.max(minX, Math.min(newX, maxX));
        newY = Math.max(minY, Math.min(newY, maxY));
      }

      setPosition({ x: newX, y: newY });
    };

    const handleEnd = () => {
      isDraggingRef.current = false;
      setIsDragging(false);
      dragStartRef.current = { x: 0, y: 0 };
      document.body.style.userSelect = "";
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleEnd);
      window.addEventListener("touchmove", handleMove, { passive: false });
      window.addEventListener("touchend", handleEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging]);

  useEffect(() => {
    const handleResize = () => {
      if (!wrapperRef.current) return;

      const width = wrapperRef.current.offsetWidth;
      const height = wrapperRef.current.offsetHeight;
      const margin = window.innerWidth <= 480 ? 20 : 30;
      const untranslatedLeft = window.innerWidth - margin - width;
      const untranslatedTop = window.innerHeight - margin - height;

      const minX = -untranslatedLeft + (window.innerWidth <= 480 ? 10 : 15);
      const maxX = margin - (window.innerWidth <= 480 ? 10 : 15);
      const minY = -untranslatedTop + (window.innerWidth <= 480 ? 10 : 15);
      const maxY = margin - (window.innerWidth <= 480 ? 10 : 15);

      setPosition(prev => ({
        x: Math.max(minX, Math.min(prev.x, maxX)),
        y: Math.max(minY, Math.min(prev.y, maxY))
      }));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const width = wrapperRef.current.offsetWidth;
    const height = wrapperRef.current.offsetHeight;
    const margin = window.innerWidth <= 480 ? 20 : 30;

    const untranslatedLeft = window.innerWidth - margin - width;
    const untranslatedTop = window.innerHeight - margin - height;

    const minX = -untranslatedLeft + (window.innerWidth <= 480 ? 10 : 15);
    const maxX = margin - (window.innerWidth <= 480 ? 10 : 15);
    const minY = -untranslatedTop + (window.innerWidth <= 480 ? 10 : 15);
    const maxY = margin - (window.innerWidth <= 480 ? 10 : 15);

    setPosition((prev) => ({
      x: Math.max(minX, Math.min(prev.x, maxX)),
      y: Math.max(minY, Math.min(prev.y, maxY)),
    }));
  }, [selectedLanguage]);

  const urlLangParam = getUrlLangParam();

  // Fetch active languages on mount
  // Reducer will resolve correct language from URL → localStorage → default
  useEffect(() => {
    dispatch(fetchActiveLanguages());
  }, [dispatch]);

  // Fetch translations whenever selectedLanguageCode changes
  useEffect(() => {
    if (!selectedLanguageCode) return;
    dispatch(fetchTranslations(selectedLanguageCode));
  }, [selectedLanguageCode, dispatch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    if (code?.toLowerCase() === selectedLanguageCode?.toLowerCase()) {
      setOpen(false);
      return;
    }
    dispatch(setSelectedLanguage(code)); // saves to localStorage + updates Redux
    setOpen(false);
  };

  const buildIconSrc = (iconPath) => {
    if (!iconPath) return null;
    if (/^https?:\/\//i.test(iconPath)) return iconPath;
    return `${baseURL || ""}${iconPath}`;
  };

  const currentLabel =
    selectedLanguage?.localLanguageTitle ||
    selectedLanguage?.languageTitle ||
    selectedLanguageCode?.toUpperCase() ||
    "EN";

  const currentFlagSrc = buildIconSrc(selectedLanguage?.languageIcon);

  return (
    <div
      className={`lang-switcher-wrapper${isDragging ? " dragging" : ""}`}
      ref={wrapperRef}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: isDragging ? "none" : "transform 0.1s ease-out",
      }}
    // onMouseDown={handleMouseDown}
    // onTouchStart={handleTouchStart}
    >
      {/* Dropdown — opens upward/downward and left/right depending on position */}
      {open && (
        <div
          className={`lang-dropdown ${wrapperRef.current &&
            wrapperRef.current.getBoundingClientRect().top < window.innerHeight / 2
            ? "open-down"
            : ""
            } ${wrapperRef.current &&
              wrapperRef.current.getBoundingClientRect().left < window.innerWidth / 2
              ? "open-right"
              : ""
            }`}
          role="menu"
          aria-label="Select language"
          ref={dropdownRef}
        >
          <div className="lang-dropdown-header">Select Language</div>

          {activeLanguages?.length ? (
            activeLanguages.map((lang) => {
              const code = lang.languageCode?.toLowerCase();
              const isActive = code === selectedLanguageCode?.toLowerCase();
              const isFromUrl = isActive && urlLangParam === code;
              const iconSrc = buildIconSrc(lang.languageIcon);
              const label = lang.localLanguageTitle || lang.languageTitle;

              return (
                <button
                  key={lang._id || lang.languageCode}
                  className={`lang-option${isActive ? " active" : ""}`}
                  onClick={() => handleSelect(lang.languageCode)}
                  type="button"
                >
                  {iconSrc ? (
                    <img
                      src={iconSrc}
                      alt={label || lang.languageCode}
                      className="lang-flag"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="lang-flag-placeholder">
                      {lang.languageCode?.slice(0, 2)}
                    </div>
                  )}
                  <span className="lang-name">{label}</span>
                  {isFromUrl && <span className="lang-url-tag">URL</span>}
                  <span className="lang-code-badge">{lang.languageCode}</span>
                  {isActive && <span className="lang-check">✓</span>}
                </button>
              );
            })
          ) : (
            <div className="lang-empty">Loading languages...</div>
          )}
        </div>
      )}

      {/* Trigger button */}
      <button
        className={`lang-trigger${open ? " open" : ""}${urlLangParam ? " url-sourced" : ""}`}
        onClick={(e) => {
          if (!hasMovedRef.current) {
            setOpen((prev) => !prev);
          }
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        title="Switch language"
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <svg
          className="lang-globe-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>

        {currentFlagSrc ? (
          <img
            src={currentFlagSrc}
            alt={currentLabel}
            className="lang-flag"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : null}

        <span>{currentLabel}</span>

        {/* {loadingTranslations ? (
          <span className="lang-loading-dot" aria-hidden="true" />
        ) : ( */}
        <svg
          className={`lang-chevron${open ? " rotated" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
        {/* )} */}
      </button>
    </div>
  );
};

export default LanguageSwitcher;
