import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router";
import {
  fetchActiveLanguages,
  fetchTranslations,
  setSelectedLanguage,
} from "../store/languageSlice";

const LanguageSwitcher = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const {
    activeLanguages,
    selectedLanguageCode,
    selectedLanguage,
    loadingTranslations,
  } = useSelector((state) => state.language);

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  // Position state
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMoved, setIsMoved] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const dragStart = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const dragThreshold = 5;

  // Keep in bounds on resize (only if it has been moved)
  useEffect(() => {
    const handleResize = () => {
      if (!isMoved || !triggerRef.current) return;

      setPosition((prev) => {
        const rect = triggerRef.current.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width - 24;
        const maxY = window.innerHeight - rect.height - 24;
        return {
          x: Math.min(Math.max(24, prev.x), maxX),
          y: Math.min(Math.max(24, prev.y), maxY),
        };
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMoved]);

  // Fetch active languages on mount
  useEffect(() => {
    dispatch(fetchActiveLanguages());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedLanguageCode) return;
    dispatch(fetchTranslations(selectedLanguageCode));
  }, [selectedLanguageCode, dispatch]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseDown = (e) => {
    // Only allow dragging if clicking the trigger button (or its children)
    if (!triggerRef.current?.contains(e.target)) return;

    const clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;

    dragStart.current = { x: clientX, y: clientY };

    // If first time moving, capture current CSS-based position
    if (!isMoved) {
      const rect = triggerRef.current.getBoundingClientRect();
      startPos.current = { x: rect.left, y: rect.top };
    } else {
      startPos.current = { ...position };
    }

    let moved = false;

    const moveHandler = (moveE) => {
      const moveX =
        moveE.type === "touchmove" ? moveE.touches[0].clientX : moveE.clientX;
      const moveY =
        moveE.type === "touchmove" ? moveE.touches[0].clientY : moveE.clientY;

      const dx = moveX - dragStart.current.x;
      const dy = moveY - dragStart.current.y;

      if (
        !moved &&
        (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold)
      ) {
        moved = true;
        setIsDragging(true);
        setIsMoved(true);
      }

      if (moved) {
        const rect = triggerRef.current.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width - 24;
        const maxY = window.innerHeight - rect.height - 24;
        const newX = Math.min(Math.max(24, startPos.current.x + dx), maxX);
        const newY = Math.min(Math.max(24, startPos.current.y + dy), maxY);
        setPosition({ x: newX, y: newY });
      }
    };

    const upHandler = () => {
      window.removeEventListener("mousemove", moveHandler);
      window.removeEventListener("mouseup", upHandler);
      window.removeEventListener("touchmove", moveHandler);
      window.removeEventListener("touchend", upHandler);

      if (moved) {
        // Small delay to prevent the click event from firing immediately
        setTimeout(() => setIsDragging(false), 50);
      }
    };

    window.addEventListener("mousemove", moveHandler);
    window.addEventListener("mouseup", upHandler);
    window.addEventListener("touchmove", moveHandler, { passive: false });
    window.addEventListener("touchend", upHandler);
  };

  const handleTriggerClick = (e) => {
    if (isDragging) return;
    setOpen((prev) => !prev);
  };

  const handleSelect = (code) => {
    if (code === selectedLanguageCode) {
      setOpen(false);
      return;
    }
    dispatch(setSelectedLanguage(code));
    setOpen(false);
  };

  const currentLabel =
    selectedLanguage?.localLanguageTitle ||
    selectedLanguage?.languageTitle ||
    selectedLanguageCode?.toUpperCase() ||
    "EN";

  const currentFlag = selectedLanguage?.languageIcon;
  const urlLangParam = searchParams.get("language")?.trim();

  // Responsive UI logic (Dynamic thresholds based on window size)
  const isNearTop = isMoved ? position.y < window.innerHeight / 2 : false;
  const isNearLeft = isMoved ? position.x < window.innerWidth / 2 : false;

  return (
    <>
      <style>{`
        .lang-switcher-wrapper {
          position: fixed;
          z-index: 40;
          font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
          touch-action: none;
          user-select: none;
          transition: ${isDragging ? "none" : "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"};
        }

        .lang-dropdown {
          position: absolute;
          ${isNearTop ? "top: calc(100% + 12px);" : "bottom: calc(100% + 12px);"}
          ${isNearLeft ? "left: 0;" : "right: 0;"}
          min-width: 200px;
          max-height: 300px;
          overflow-y: auto;
          background: #161b27;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 8px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          gap: 4px;
          animation: langDropIn 0.25s cubic-bezier(0.22, 1, 0.36, 1);
          transform-origin: ${isNearTop ? "top" : "bottom"} ${isNearLeft ? "left" : "right"};
        }

        .lang-dropdown::-webkit-scrollbar {
          width: 6px;
        }
        .lang-dropdown::-webkit-scrollbar-track {
          background: transparent;
        }
        .lang-dropdown::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.15);
          border-radius: 3px;
        }
        .lang-dropdown::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.25);
        }

        @keyframes langDropIn {
          from { opacity: 0; transform: scale(0.9) translateY(${isNearTop ? "-10px" : "10px"}); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        .lang-dropdown-header {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
          padding: 6px 12px 4px;
        }

        .lang-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
        }

        .lang-option:hover { background: rgba(255,255,255,0.06); }
        .lang-option.active { background: rgba(236,72,153,0.15); }

        .lang-flag {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
          border: 1.5px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
        }

        .lang-flag-placeholder {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ec4899, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
          text-transform: uppercase;
        }

        .lang-name {
          font-size: 14px;
          font-weight: 500;
          color: rgba(255,255,255,0.9);
          flex: 1;
        }

        .lang-code-badge {
          font-size: 10px;
          font-weight: 700;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
        }

        .lang-check {
          color: #ec4899;
          font-size: 16px;
        }

        .lang-trigger {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px 10px 12px;
          background: #161b27;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 50px;
          cursor: ${isDragging ? "grabbing" : "grab"};
          transition: all 0.2s;
          box-shadow: 0 8px 24px rgba(0,0,0,0.5);
          color: rgba(255,255,255,0.9);
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
        }

        .lang-trigger:hover {
          border-color: rgba(236,72,153,0.5);
          transform: translateY(-1px);
          box-shadow: 0 10px 30px rgba(236,72,153,0.15);
        }

        .lang-trigger.open {
          border-color: #ec4899;
          background: #1a2030;
        }

        .lang-globe-icon {
          width: 18px;
          height: 18px;
          color: #ec4899;
        }

        .lang-chevron {
          width: 14px;
          height: 14px;
          color: rgba(255,255,255,0.4);
          transition: transform 0.25s;
        }

        .lang-chevron.rotated { transform: rotate(180deg); }

        .lang-loading-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ec4899;
          animation: langPulse 1.2s infinite;
        }

        @keyframes langPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }

        @media (max-width: 640px) {
          .lang-trigger {
            padding: 8px 12px 8px 10px;
            font-size: 13px;
          }
          .lang-name { font-size: 13px; }
        }
      `}</style>

      <div
        className="lang-switcher-wrapper"
        ref={dropdownRef}
        style={
          isMoved
            ? { left: position.x, top: position.y }
            : { bottom: "24px", right: "24px" }
        }
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        {/* Dropdown */}
        {open && (
          <div className="lang-dropdown">
            <div className="lang-dropdown-header">Language</div>
            {activeLanguages.map((lang) => {
              const isActive = lang.languageCode === selectedLanguageCode;
              return (
                <button
                  key={lang._id}
                  className={`lang-option ${isActive ? "active" : ""}`}
                  onClick={() => handleSelect(lang.languageCode)}
                >
                  {lang.languageIcon ? (
                    <img
                      src={`${import.meta.env.VITE_BASE_URL || ""}${lang.languageIcon}`}
                      alt={lang.languageTitle}
                      className="lang-flag"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="lang-flag-placeholder">
                      {lang.languageCode?.slice(0, 2)}
                    </div>
                  )}
                  <span className="lang-name">
                    {lang.localLanguageTitle || lang.languageTitle}
                  </span>
                  <span className="lang-code-badge">{lang.languageCode}</span>
                  {isActive && <span className="lang-check">✓</span>}
                </button>
              );
            })}
          </div>
        )}

        {/* Trigger Button */}
        <button
          ref={triggerRef}
          className={`lang-trigger${open ? " open" : ""}`}
          onClick={handleTriggerClick}
          title="Drag to move, click to switch"
        >
          <svg
            className="lang-globe-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>

          {currentFlag && !loadingTranslations && (
            <img
              src={`${import.meta.env.VITE_BASE_URL || ""}${currentFlag}`}
              alt={currentLabel}
              className="lang-flag"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          )}

          <span>{currentLabel}</span>

          {loadingTranslations ? (
            <div className="lang-loading-dot" />
          ) : (
            <svg
              className={`lang-chevron${open ? " rotated" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          )}
        </button>
      </div>
    </>
  );
};

export default LanguageSwitcher;
