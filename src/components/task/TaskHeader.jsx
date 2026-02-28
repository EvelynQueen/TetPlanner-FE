import { Download, LayoutGrid, List, Plus, Tag } from "lucide-react";

/**
 * TaskHeader
 *
 * Reusable header for the Task Management page.
 * Shared by both List view and Kanban view.
 *
 * Props:
 *   currentView  "list" | "kanban"
 *   onViewChange (view: string) => void
 *   onCreateTask () => void
 */
const TaskHeader = ({ currentView, onViewChange, onCreateTask }) => (
  <div className="flex items-center justify-between px-8 py-6 bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10 font-['Plus_Jakarta_Sans']">
    {/* Left — page title block */}
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
        Tet Preparation Tasks
      </h1>
      <p className="text-sm text-slate-500">
        Year of the Horse 2026 &bull; BINH NGO
      </p>
    </div>

    {/* Right — action cluster */}
    <div className="flex items-center gap-3">
      {/* Utility buttons */}
      <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50 transition-colors whitespace-nowrap">
        <Download size={15} className="shrink-0" />
        Export
      </button>
      <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50 transition-colors whitespace-nowrap">
        <Tag size={15} className="shrink-0" />
        Manage Categories
      </button>

      {/* Visual separator */}
      <div className="w-px h-6 bg-slate-200 shrink-0" />

      {/* Kanban / List view toggle */}
      <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1">
        <button
          onClick={() => onViewChange("kanban")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
            currentView === "kanban"
              ? "bg-white shadow-sm text-[var(--color-primary-500)]"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <LayoutGrid size={14} />
          Kanban
        </button>
        <button
          onClick={() => onViewChange("list")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
            currentView === "list"
              ? "bg-white shadow-sm text-[var(--color-primary-500)]"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <List size={14} />
          List
        </button>
      </div>

      {/* New Task CTA */}
      <button
        onClick={onCreateTask}
        className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary-500)] hover:opacity-90 text-[var(--color-text-inverse)] rounded-xl text-sm font-medium shadow-[var(--btn-primary-shadow)] transition-opacity whitespace-nowrap"
      >
        <Plus size={14} />
        New Task
      </button>
    </div>
  </div>
);

export default TaskHeader;
