import React, { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router";
import {
  LayoutDashboard,
  Building2,
  Users,
  DollarSign,
  ArrowDownToLine,
  TrendingUp,
  Menu,
  ArrowLeftRight,
  User,
} from "lucide-react";
import { Toaster } from "../components/ui/sonner";
import { useDispatch } from "react-redux";
import LanguageSwitcher from "../components/LanguageSwitcher";
import useTranslation from "../../util/useTranslation";
import { projectName } from "../../util/config";

const C = {
  bg: "#0F172A",
  sidebar: "#111827",
  border: "#1F2937",
  pink: "#FF4D8D",
  pinkBg: "rgba(255,77,141,0.10)",
  textPrimary: "#F9FAFB",
  textSecondary: "#9CA3AF",
  textMuted: "#6B7280",
};

const navItems = [
  { icon: LayoutDashboard, labelKey: "layout_nav_dashboard", path: "/" },
  { icon: Building2, labelKey: "layout_nav_my_agencies", path: "/agencies" },
  { icon: Users, labelKey: "layout_nav_hosts", path: "/hosts" },
  { icon: DollarSign, labelKey: "layout_nav_commission", path: "/commission" },
  { icon: ArrowDownToLine, labelKey: "layout_nav_withdraw", path: "/withdraw" },
  {
    icon: ArrowLeftRight,
    labelKey: "layout_nav_transactions",
    path: "/transactions",
  },
  { icon: User, labelKey: "layout_nav_profile", path: "/profile" },
];

export default function DashboardLayout() {
  const location = useLocation();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentNavItem = navItems.find((i) =>
    i.path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(i.path),
  );
  const pageTitle = t(currentNavItem?.labelKey ?? "layout_nav_dashboard");

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className="h-16 flex items-center px-6 border-b"
        style={{ borderColor: C.border }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #FF4D8D, #A78BFA)" }}
          >
            <TrendingUp size={16} color="white" />
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: C.textPrimary }}>
              {projectName}
            </p>
            <p className="text-xs" style={{ color: C.textMuted }}>
              {t("layout_brand_subtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        <p
          className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider"
          style={{ color: C.textMuted }}
        >
          {t("layout_nav_heading")}
        </p>
        {navItems.map((item) => {
          const isActive =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background: isActive ? C.pinkBg : "transparent",
                color: isActive ? C.pink : C.textSecondary,
                borderLeft: isActive
                  ? `3px solid ${C.pink}`
                  : "3px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = "#1F2937";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              <item.icon
                size={17}
                style={{ color: isActive ? C.pink : C.textMuted }}
              />
              {t(item.labelKey)}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div
      className="min-h-screen flex"
      style={{ background: C.bg, fontFamily: "'Inter', sans-serif" }}
    >
      <Toaster position="top-right" />

      {/* Desktop Sidebar */}
      <aside
        className="w-60 fixed h-screen z-20 hidden md:flex flex-col border-r"
        style={{ background: C.sidebar, borderColor: C.border }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="absolute left-0 top-0 bottom-0 w-64 flex flex-col border-r"
            style={{ background: C.sidebar, borderColor: C.border }}
          >
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 md:ml-60 flex flex-col min-h-screen">
        {/* Header */}
        <header
          className="h-14 sticky top-0 z-10 px-4 sm:px-6 flex justify-between items-center max-sm:gap-2 gap-4 border-b"
          style={{ background: C.sidebar, borderColor: C.border }}
        >
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-1.5 rounded-lg"
              style={{ color: C.textMuted }}
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h1
              className="text-base font-semibold"
              style={{ color: C.textPrimary }}
            >
              {pageTitle}
            </h1>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 p-6 max-sm:w-[calc(100vw)] max-lg:w-[calc(100vw-240px)] lg:w-[calc(100vw-250px)] xl:w-full">
          <Outlet />
        </div>
      </main>
      <LanguageSwitcher />
    </div>
  );
}
