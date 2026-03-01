/**
 * TaskRow – task-specific table row.
 * Contains all task UI logic (priority dot, strike-through, badges, status dropdown).
 * Can be passed as renderRow to <TaskTable />.
 *
 * Props:
 *   task           Task object
 *   onEdit         (task) => void
 *   onDelete       (task) => void
 *   onStatusChange (id, status) => void
 */
import { Pencil, Trash2 } from "lucide-react";
import StatusDropdown from "./StatusDropdown";

// ── Style maps (task-specific) ─────────────────────────────────────────────────
const CATEGORY_STYLES = {
  "Dọn dẹp & Trang trí": "bg-pink-100 text-pink-700",
  "Ẩm thực":             "bg-green-100 text-green-700",
  "Lễ nghi & Văn hóa":  "bg-indigo-100 text-indigo-700",
  "Mua sắm":             "bg-sky-100 text-sky-700",
  "Gia đình":            "bg-purple-100 text-purple-700",
  "Phương tiện":         "bg-orange-100 text-orange-700",
  "Khác":                "bg-gray-100 text-gray-600",
};

const PRIORITY_DOT = {
  high:   "bg-red-500",
  medium: "bg-amber-400",
  low:    "bg-emerald-400",
};

const PRIORITY_STYLES = {
  high:   "bg-red-100 text-red-600",
  medium: "bg-amber-100 text-amber-600",
  low:    "bg-emerald-100 text-emerald-600",
};

const PRIORITY_LABELS = {
  high:   "High",
  medium: "Medium",
  low:    "Low",
};

// ── Badge sub-components ───────────────────────────────────────────────────────
const CategoryBadge = ({ categoryName }) => {
  const name = categoryName ?? "";
  return (
    <span className={`px-3 py-0.5 rounded-full text-xs font-medium ${CATEGORY_STYLES[name] ?? "bg-gray-100 text-gray-600"}`}>
      {name || "—"}
    </span>
  );
};

const PriorityBadge = ({ priority }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-normal ${PRIORITY_STYLES[priority] ?? "bg-gray-100 text-gray-600"}`}>
    {PRIORITY_LABELS[priority] ?? priority}
  </span>
);

// ── Row ────────────────────────────────────────────────────────────────────────
export default function TaskRow({ task, onEdit, onDelete, onStatusChange }) {
  const isDone = task.status === "DONE";

  return (
    <tr className={`border-b transition-colors
      ${ isDone
          ? "bg-slate-50/40 border-slate-100 opacity-60 hover:opacity-80 hover:bg-slate-50"
          : "border-slate-100 hover:bg-slate-50/50"
      }`}>
      {/* Title */}
      <td className="pl-6 pr-6 py-4">
        <div className="flex items-center gap-3">
          <span className={`w-2 h-2 rounded-full shrink-0 ${PRIORITY_DOT[task.priority] ?? "bg-slate-300"}`} />
          <span className={`text-sm font-semibold ${
            isDone ? "text-slate-400 line-through" : "text-slate-800"
          }`}>
            {task.title}
          </span>
        </div>
      </td>

      {/* Category */}
      <td className="px-6 py-4">
        <CategoryBadge categoryName={task.categoryName} />
      </td>

      {/* Schedule */}
      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-slate-500">
        {task.timelineLabel ?? "—"}
      </td>

      {/* Priority */}
      <td className="px-6 py-4">
        <PriorityBadge priority={task.priority} />
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <StatusDropdown task={task} onStatusChange={onStatusChange} />
      </td>

      {/* Actions */}
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onEdit(task)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onDelete(task)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
