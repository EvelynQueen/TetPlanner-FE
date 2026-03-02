
import { useState, useEffect, useContext, useMemo } from "react";
import {
  Plus, Pencil, Trash2, CalendarDays, Loader2, X, Save, Moon,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import NotificationModal  from "../components/NotificationModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { getLunarDateLabel, solarToLunar, getOccasionTitleFromLunar } from "../utils/lunarCalendar";
import OccasionContext from "../contexts/OccasionContext";

// â”€â”€ Palette â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const PALETTE = [
  "#e11d48", "#f97316", "#eab308", "#22c55e",
  "#0ea5e9", "#6366f1", "#a855f7", "#ec4899",
  "#14b8a6", "#64748b",
];

// â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const fmtDisplay = (dateStr) => {
  if (!dateStr) return "—";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
};

/**
 * Extract the content inside the first (…) in a lunar label string.
 * e.g. "28 Tháng Chạp (28 Tết)" → "28 Tết"
 * Returns null when there is no parenthetical.
 */
const extractParenthetical = (label) => {
  if (!label) return null;
  const m = label.match(/\(([^)]+)\)/);
  return m ? m[1] : null;
};

/**
 * Strip the (…) portion from a lunar label so it can be shown as a clean subtitle.
 * e.g. "28 Tháng Chạp (28 Tết)" → "28 Tháng Chạp"
 */
const stripParenthetical = (label) =>
  label ? label.replace(/\s*\([^)]*\)/, "").trim() : "";

/**
 * Canonical title for an occasion object:
 *   customTitle (user-set) > parenthetical of LunarLabel ("28 Tết") > full lunar label > lunarDate fallback
 * Always reads from the solar `date` field via getLunarDateLabel, so it stays
 * in sync with the actual day regardless of what's stored in lunarDate.
 */
const resolveOccasionTitle = (occ) => {
  if (occ.customTitle) return occ.customTitle;
  const fullLabel = getLunarDateLabel(occ.date);
  return extractParenthetical(fullLabel) ?? fullLabel ?? getOccasionTitleFromLunar(occ.lunarDate);
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Build the 6-row grid of days (including padding cells) for a given month. */
function buildCalendarGrid(year, month) {
  const firstDow = new Date(year, month - 1, 1).getDay();    // 0=Sun
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

// â”€â”€ Lunar-aware calendar picker â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function OccasionCalendar({ value, onChange, occupiedDates, defaultDates }) {
  const today = new Date();
  const [viewYear,  setViewYear]  = useState(() => value ? Number(value.split("-")[0]) : today.getFullYear());
  const [viewMonth, setViewMonth] = useState(() => value ? Number(value.split("-")[1]) : today.getMonth() + 1);

  const cells = buildCalendarGrid(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 1) { setViewYear((y) => y - 1); setViewMonth(12); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 12) { setViewYear((y) => y + 1); setViewMonth(1); }
    else setViewMonth((m) => m + 1);
  };

  const monthLabel = new Date(viewYear, viewMonth - 1).toLocaleString("en-US", {
    month: "long", year: "numeric",
  });

  return (
    <div className="flex flex-col gap-2">
      {/* Navigation */}
      <div className="flex items-center justify-between px-1">
        <button
          type="button"
          onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-semibold text-slate-700 font-['Plus_Jakarta_Sans']">
          {monthLabel}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 gap-0.5">
        {DAY_NAMES.map((d) => (
          <div key={d} className="text-center text-[10px] font-semibold text-slate-400 py-1">
            {d}
          </div>
        ))}

        {/* Day cells */}
        {cells.map((day, idx) => {
          if (!day) return <div key={`pad-${idx}`} />;

          const dateStr = `${viewYear}-${String(viewMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const lunar   = solarToLunar(day, viewMonth, viewYear);
          const isSelected = dateStr === value;
          const isDefault  = defaultDates.includes(dateStr);
          const isOccupied = occupiedDates.includes(dateStr) && !isSelected;
          const isToday    = dateStr === today.toISOString().slice(0, 10);

          let cellCls = "relative flex flex-col items-center justify-center rounded-lg cursor-pointer transition select-none h-10 ";
          if (isSelected)       cellCls += "bg-rose-600 text-white ";
          else if (isDefault)   cellCls += "bg-rose-100 text-rose-700 ";
          else if (isOccupied)  cellCls += "bg-indigo-100 text-indigo-700 ";
          else if (isToday)     cellCls += "ring-1 ring-rose-400 text-slate-800 hover:bg-slate-100 ";
          else                  cellCls += "text-slate-700 hover:bg-slate-100 ";

          return (
            <div key={dateStr} className={cellCls} onClick={() => onChange(dateStr)} title={dateStr}>
              <span className="text-sm font-semibold leading-none">{day}</span>
              <span className={`text-[9px] leading-none mt-0.5 ${isSelected ? "text-rose-200" : isDefault ? "text-rose-400" : "text-slate-400"}`}>
                ({lunar.day})
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// â”€â”€ Form modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function OccasionFormModal({ isOpen, initial, onClose, onSubmit, loading, occupiedDates, defaultDates }) {
  const EMPTY = { customTitle: "", date: "", color: "#e11d48" };
  const [form,      setForm]      = useState(EMPTY);
  const [errors,    setErrors]    = useState({});

  useEffect(() => {
    if (isOpen) {
      setForm(initial
        ? { customTitle: initial.customTitle ?? "", date: initial.date, color: initial.color }
        : EMPTY
      );
      setErrors({});
    }
  }, [isOpen, initial?.id]);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  // Derived title based on the currently selected date's lunar equivalent
  const derivedLunar = form.date ? (() => {
    const [yyyy, mm, dd] = form.date.split("-").map(Number);
    return solarToLunar(dd, mm, yyyy);
  })() : null;
  const derivedTitle = derivedLunar ? getOccasionTitleFromLunar(derivedLunar) : "";

  const validate = () => {
    const e = {};
    if (!form.date)        e.date = "Please select a date.";
    // Duplicate check (exclude self when editing)
    const taken = occupiedDates.filter((d) => initial?.id
      ? d === form.date && d !== initial.date
      : d === form.date
    );
    if (taken.length) e.date = "This date already has an occasion.";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit({
      ...form,
      customTitle: form.customTitle.trim() || null,   // null → auto-derive from lunarDate
    });
  };

  if (!isOpen) return null;

  const lunarLabel = getLunarDateLabel(form.date);

  // Dates already occupied **excluding** the one being edited
  const blockedForCalendar = initial?.id
    ? occupiedDates.filter((d) => d !== initial.date)
    : occupiedDates;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-[480px] mx-4 bg-white rounded-2xl border border-slate-200 shadow-[0_25px_50px_0_rgba(0,0,0,0.25)] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 bg-rose-600">
          <div className="flex items-center gap-3">
            <CalendarDays size={22} className="text-white" />
            <div>
              <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-white">
                {initial?.id ? "Edit Occasion" : "Add Occasion"}
              </h2>
              <p className="text-xs text-rose-200 font-['Plus_Jakarta_Sans']">Marking your special day</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6">

          {/* Custom title (optional) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700 font-['Plus_Jakarta_Sans']">
              Custom title
              <span className="text-xs font-normal text-slate-400 ml-2">optional — leave blank to auto-derive</span>
            </label>
            {/* Show the auto-derived title as a read-only hint when no custom value */}
            {derivedTitle && !form.customTitle && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100">
                <Moon size={12} className="text-indigo-400 shrink-0" />
                <span className="text-xs text-indigo-600 font-['Plus_Jakarta_Sans']">
                  Auto title: <strong>{derivedTitle}</strong>
                </span>
              </div>
            )}
            <input
              type="text"
              value={form.customTitle}
              onChange={(e) => set("customTitle", e.target.value)}
              placeholder={derivedTitle || "e.g. Family Reunion"}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-['Plus_Jakarta_Sans'] text-slate-700 placeholder:text-slate-400 outline-none transition focus:ring-2 focus:ring-rose-200"
            />
          </div>

          {/* Calendar */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700 font-['Plus_Jakarta_Sans']">
              Date <span className="text-rose-500">*</span>
            </label>

            <div className={`rounded-xl border p-3 ${errors.date ? "border-rose-400 bg-rose-50" : "border-slate-200 bg-slate-50"}`}>
              <OccasionCalendar
                value={form.date}
                onChange={(d) => { set("date", d); setErrors((p) => ({ ...p, date: "" })); }}
                occupiedDates={blockedForCalendar}
                defaultDates={defaultDates}
              />
            </div>

            {/* Selected date preview */}
            {form.date && (
              <div className="flex items-center gap-2 text-sm text-slate-600 font-['Plus_Jakarta_Sans']">
                <CalendarDays size={14} className="text-rose-500" />
                <span className="font-medium">{fmtDisplay(form.date)}</span>
                {lunarLabel && (
                  <>
                    <Moon size={12} className="text-indigo-400" />
                    <span className="text-indigo-600 text-xs">{lunarLabel}</span>
                  </>
                )}
              </div>
            )}
            {errors.date && <p className="text-xs text-rose-500">{errors.date}</p>}
          </div>

          {/* Colour picker */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700 font-['Plus_Jakarta_Sans']">
              Label colour
            </label>
            <div className="flex flex-wrap gap-2.5">
              {PALETTE.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => set("color", c)}
                  style={{ backgroundColor: c }}
                  className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
                    form.color === c ? "border-slate-700 scale-110" : "border-white"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 font-['Plus_Jakarta_Sans'] hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-bold font-['Plus_Jakarta_Sans'] shadow-[0_4px_6px_0_rgba(225,29,72,0.2)] hover:bg-rose-700 disabled:opacity-60 transition"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {initial?.id ? "Save changes" : "Save occasion"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function OccasionManagement() {
  const {
    occasions,
    loading,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useContext(OccasionContext);

  const [saving,       setSaving]       = useState(false);
  const [modalData,    setModalData]    = useState(undefined);   // undefined = closed
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notif,        setNotif]        = useState(null);
  const [dateError,    setDateError]    = useState(false);

  // All occupied dates (for calendar highlighting / validation)
  const occupiedDates = useMemo(() => occasions.map((o) => o.date), [occasions]);
  const defaultDates  = useMemo(() => occasions.filter((o) => o.isDefault).map((o) => o.date), [occasions]);

  // â”€â”€ Create / Update â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleSubmit = async (payload) => {
    setSaving(true);
    setDateError(false);
    try {
      if (modalData?.id) {
        const updated = await handleUpdate(modalData.id, payload);
        setNotif({ type: "edit",   title: resolveOccasionTitle(updated) });
      } else {
        const created = await handleCreate(payload);
        setNotif({ type: "create", title: resolveOccasionTitle(created) });
      }
      setModalData(undefined);
    } catch (err) {
      if (err.message === "DATE_TAKEN") setDateError(true);
    } finally {
      setSaving(false);
    }
  };

  // â”€â”€ Delete â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleDeleteConfirm = async () => {
    const target = deleteTarget;
    setDeleteTarget(null);
    try {
      await handleDelete(target.id);
      setNotif({ type: "delete", title: resolveOccasionTitle(target) });
    } catch (_) { /* ignore */ }
  };

  return (
    <>
      {/* Form modal */}
      <OccasionFormModal
        isOpen={modalData !== undefined}
        initial={modalData}
        onClose={() => { setModalData(undefined); setDateError(false); }}
        onSubmit={handleSubmit}
        loading={saving}
        occupiedDates={occupiedDates}
        defaultDates={defaultDates}
      />

      {/* Delete confirmation */}
      <DeleteConfirmModal
        isOpen={deleteTarget !== null}
        name={deleteTarget ? resolveOccasionTitle(deleteTarget) : ""}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />

      {/* Notifications */}
      {notif?.type === "create" && (
        <NotificationModal
          type="success"
          title="Occasion created!"
          message={<>Occasion <span className="font-bold">"{notif.title}"</span> has been added.</>}
          onClose={() => setNotif(null)}
          actions={[
            {
              label: "Add another",
              onClick: () => { setNotif(null); setModalData(null); },
              variant: "primary",
            },
          ]}
        />
      )}
      {notif?.type === "edit" && (
        <NotificationModal
          type="success"
          title="Updated!"
          message={<>Occasion <span className="font-bold">"{notif.title}"</span> has been updated.</>}
          onClose={() => setNotif(null)}
        />
      )}
      {notif?.type === "delete" && (
        <NotificationModal
          type="success"
          title="Deleted!"
          message={<>Occasion <span className="font-bold">"{notif.title}"</span> has been removed.</>}
          onClose={() => setNotif(null)}
        />
      )}

      {/* Page */}
      <div className="flex flex-col flex-1 overflow-y-auto bg-slate-50 font-['Plus_Jakarta_Sans']">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
              <CalendarDays size={20} className="text-rose-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Occasion Management</h1>
              <p className="text-sm text-slate-500">Capture every meaningful moment in your calendar</p>
            </div>
          </div>
          <button
            onClick={() => setModalData(null)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-bold shadow-[0_4px_6px_0_rgba(225,29,72,0.2)] hover:bg-rose-700 transition"
          >
            <Plus size={16} />
            Add occasion
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 px-8 py-6">

          {loading && occasions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
              <Loader2 size={36} className="animate-spin text-rose-400" />
              <span className="text-sm">Loading occasionsâ€¦</span>
            </div>
          ) : occasions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
              <CalendarDays size={40} />
              <span className="text-sm">No occasions yet. Add the first one!</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {occasions.map((occ) => {
                const fullLunarLabel = getLunarDateLabel(occ.date);
                const displayTitle   = resolveOccasionTitle(occ);
                const lunarSubtitle  = stripParenthetical(fullLunarLabel);
                return (
                  <div
                    key={occ.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 flex items-start gap-4 hover:shadow-sm transition-shadow"
                  >
                    {/* Colour bar */}
                    <div
                      className="w-1.5 rounded-full shrink-0 self-stretch min-h-[48px]"
                      style={{ backgroundColor: occ.color ?? "#e11d48" }}
                    />

                    {/* Info */}
                    <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-semibold text-slate-800 truncate">{displayTitle}</span>
                        {occ.isDefault && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-600 uppercase tracking-wide shrink-0">
                            Default
                          </span>
                        )}
                      </div>

                      {/* Solar date */}
                      <div className="flex items-center gap-1.5 text-sm text-slate-700 font-medium">
                        <CalendarDays size={13} className="text-slate-400 shrink-0" />
                        {fmtDisplay(occ.date)}
                      </div>

                      {/* Lunar date — subtitle without the (…) to avoid repetition with the title */}
                      {lunarSubtitle && (
                        <div className="flex items-center gap-1.5 text-xs text-indigo-600">
                          <Moon size={11} className="shrink-0" />
                          {lunarSubtitle}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setModalData(occ)}
                        className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(occ)}
                        className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <p className="text-xs text-slate-400 text-right">{occasions.length} occasion{occasions.length !== 1 ? "s" : ""}</p>
        </div>
      </div>
    </>
  );
}
