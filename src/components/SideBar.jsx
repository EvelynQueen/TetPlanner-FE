import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import TetPlaner from "./TetPlaner";
import SideBarButton from "./SideBarButton";
import { RiDashboardFill } from "react-icons/ri";
import { RiTaskFill } from "react-icons/ri";
import { RiWallet3Fill } from "react-icons/ri";
import { FaCalendarAlt } from "react-icons/fa";
import { RiSettings3Fill } from "react-icons/ri";
import { Tag, CalendarDays, ChevronDown } from "lucide-react";
import ThemeButton from "./ThemeButton";
import ProfileButton from "./ProfileButton";

// ── Setting dropdown button ────────────────────────────────────────────────────
const SettingDropdown = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const subItemCls = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 caret-transparent ${
      isActive
        ? "text-(--color-primary-500) bg-(--color-primary-300)/25"
        : "text-(--color-text-muted) hover:text-(--color-text-primary)"
    }`;

  return (
    <div ref={ref} className="flex flex-col">
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between gap-2 px-2 h-12 rounded-xl transition-all duration-200 caret-transparent ${
          open
            ? "text-(--color-primary-500) bg-(--color-primary-300)/25"
            : "text-(--color-text-muted) hover:text-(--color-text-primary)"
        }`}
      >
        <div className="flex items-center gap-2">
          <RiSettings3Fill className="text-xl" />
          <span className="font-medium">Setting</span>
        </div>
        <ChevronDown
          size={15}
          className={`transition-transform duration-200 mr-1 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Sub-menu */}
      {open && (
        <div className="flex flex-col gap-0.5 mt-1 ml-4 pl-3 border-l-2 border-(--color-border-light)">
          <NavLink to="/settings/category" className={subItemCls} onClick={() => setOpen(false)}>
            <Tag size={15} />
            <span>Category</span>
          </NavLink>
          <NavLink to="/settings/occasion" className={subItemCls} onClick={() => setOpen(false)}>
            <CalendarDays size={15} />
            <span>Occasion</span>
          </NavLink>
        </div>
      )}
    </div>
  );
};

// ── Sidebar ────────────────────────────────────────────────────────────────────
const SideBar = () => {
  return (
    <div className="w-64 shrink-0 h-full p-4 flex flex-col bg-(--color-bg-sidebar) border-r border-(--color-border-light) caret-transparent">
      {/* Top of sidebar */}
      <div className="w-full flex flex-col gap-4">
        <TetPlaner />

        <nav className="flex flex-col gap-2 mt-4">
          <SideBarButton icon={RiDashboardFill} content="Dashboard" to="/" />
          <SideBarButton icon={RiTaskFill} content="Task" to="/tasks" />
          <SideBarButton
            icon={RiWallet3Fill}
            content="Shopping & Budget"
            to="/shopping"
          />
          <SideBarButton
            icon={FaCalendarAlt}
            content="Calendar"
            to="/calendar"
          />
          <SettingDropdown />
        </nav>
      </div>
      {/* Bottom of sidebar */}
      <div className="mt-auto">
        <ThemeButton />
        <ProfileButton name="John Doe" />
      </div>
    </div>
  );
};

export default SideBar;
