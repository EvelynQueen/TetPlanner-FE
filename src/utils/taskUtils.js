/**
 * taskUtils.js – reusable helpers for task data display.
 * All formatting lives here so pages/components stay thin.
 */
import { TASK_CATEGORIES } from "../mocks/taskMock";

// ── Predicates ─────────────────────────────────────────────────────────────────

/** Returns true when the task spans more than one calendar day. */
export const isMultiDayTask = (task) =>
  Boolean(task.start_date && task.due_date && task.start_date !== task.due_date);

// ── Formatters ─────────────────────────────────────────────────────────────────

/**
 * Format a single date+time pair into a human-readable string.
 * @param {string} date  "YYYY-MM-DD"
 * @param {string} time  "HH:mm"  (optional)
 * @returns {string}
 */
export const formatDateTime = (date, time) => {
  if (!date) return "";
  const d = new Date(date + "T00:00:00");
  const dateStr = d.toLocaleDateString("en-US", {
    month: "short",
    day:   "numeric",
    year:  "numeric",
  });
  return time ? `${dateStr} ${time}` : dateStr;
};

/**
 * Format the full schedule of a task into display text.
 *
 * Same-day:  "Feb 10, 2026 • 08:00 – 17:00"
 * Multi-day: "Feb 10, 2026 08:00 → Feb 12, 2026 17:00"
 *
 * @param {object} task
 * @returns {string}
 */
export const formatTaskSchedule = (task) => {
  const { start_date, start_time, due_date, due_time } = task ?? {};
  if (!start_date && !due_date) return "—";

  if (isMultiDayTask(task)) {
    const start = formatDateTime(start_date, start_time);
    const end   = formatDateTime(due_date,   due_time);
    return `${start} → ${end}`;
  }

  // Same-day (or only one date set)
  const date = start_date || due_date;
  const d    = new Date(date + "T00:00:00");
  const dateStr = d.toLocaleDateString("en-US", {
    month: "short",
    day:   "numeric",
    year:  "numeric",
  });

  if (start_time && due_time) return `${dateStr} • ${start_time} – ${due_time}`;
  if (start_time)             return `${dateStr} • ${start_time}`;
  if (due_time)               return `${dateStr} • ${due_time}`;
  return dateStr;
};

// ── Category lookup ────────────────────────────────────────────────────────────

/**
 * Resolve a category_id to its display name.
 * Returns the id itself as fallback so nothing renders blank.
 * @param {string|null} category_id
 * @returns {string}
 */
export const getCategoryName = (category_id) => {
  if (!category_id) return "";
  const cat = TASK_CATEGORIES.find((c) => c.id === category_id);
  return cat?.name ?? category_id;
};
