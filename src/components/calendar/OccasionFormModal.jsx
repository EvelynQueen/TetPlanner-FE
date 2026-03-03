import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Edit3,
  Loader2,
  Calendar,
  Save,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useOccasion } from "../../hooks/useOccasion";
import { toast } from "react-toastify";

// ── DatePicker Sub-component ──────────────────────────────────────────────────
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function DatePicker({ value, onChange, error }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() =>
    value ? new Date(value) : new Date(),
  );
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const selected = value ? new Date(value) : null;
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const year = view.getFullYear();
  const month = view.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const toISO = (y, mo, d) =>
    `${y}-${String(mo + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  return (
    <div ref={ref} className="relative flex-1">
      <div className="relative cursor-pointer" onClick={() => setOpen(!open)}>
        <Calendar
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-muted) pointer-events-none"
        />
        <input
          readOnly
          value={value || ""}
          placeholder="YYYY-MM-DD"
          className={`w-full pl-10 pr-4 py-3 rounded-xl border text-base outline-none transition cursor-pointer ${
            error
              ? "border-(--color-danger) bg-(--color-danger)/5"
              : "border-(--color-border-light) bg-(--color-bg-card) text-(--color-text-primary) focus:border-(--color-primary-400)"
          }`}
        />
      </div>

      {open && (
        <div className="absolute top-full mt-2 left-0 z-[60] bg-(--color-bg-card) rounded-xl shadow-2xl border border-(--color-border-light) p-4 w-72 transition-all">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setView(new Date(year, month - 1, 1))}
              className="p-1 hover:bg-(--color-bg-sidebar) rounded-lg transition"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-bold text-(--color-text-primary)">
              {MONTHS[month]} {year}
            </span>
            <button
              type="button"
              onClick={() => setView(new Date(year, month + 1, 1))}
              className="p-1 hover:bg-(--color-bg-sidebar) rounded-lg transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-7 mb-1">
            {WEEK.map((d) => (
              <span
                key={d}
                className="text-center text-xs font-bold text-(--color-text-muted)"
              >
                {d}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (!day) return <span key={i} />;
              const thisDate = new Date(year, month, day);
              const isSelected =
                selected && thisDate.toDateString() === selected.toDateString();
              const isToday =
                thisDate.toDateString() === todayDate.toDateString();

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    onChange(toISO(year, month, day));
                    setOpen(false);
                  }}
                  className={`h-8 rounded-lg text-sm font-medium transition ${
                    isSelected
                      ? "bg-(--color-primary-500) text-white shadow-md"
                      : isToday
                        ? "text-(--color-primary-500) bg-(--color-primary-500)/10"
                        : "hover:bg-(--color-bg-sidebar) text-(--color-text-primary)"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── OccasionForm Sub-component ────────────────────────────────────────────────
function OccasionForm({ initialValues, onSubmit, onCancel, isSubmitting }) {
  const [values, setValues] = useState(initialValues || { name: "", date: "" });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const e_msg = {};
    if (!values.name.trim()) e_msg.name = "Occasion name is required";
    if (!values.date) e_msg.date = "Date is required";

    if (Object.keys(e_msg).length > 0) return setErrors(e_msg);
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-(--color-text-primary)">
          Occasion Name *
        </label>
        <input
          type="text"
          placeholder="e.g. Lunar New Year's Eve"
          value={values.name}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
          className={`w-full px-4 py-3 rounded-xl border text-base outline-none transition ${
            errors.name
              ? "border-(--color-danger) bg-(--color-danger)/5"
              : "border-(--color-border-light) bg-(--color-bg-card) text-(--color-text-primary) focus:border-(--color-primary-400)"
          }`}
        />
        {errors.name && (
          <p className="text-xs text-(--color-danger)">{errors.name}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-(--color-text-primary)">
          Date *
        </label>
        <DatePicker
          value={values.date}
          onChange={(v) => setValues({ ...values, date: v })}
          error={errors.date}
        />
        {errors.date && (
          <p className="text-xs text-(--color-danger)">{errors.date}</p>
        )}
      </div>

      <div className="flex gap-3 pt-6 border-t border-(--color-border-light) -mx-8 px-8 mt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3.5 rounded-xl font-bold text-(--color-text-secondary) hover:bg-(--color-bg-sidebar) transition active:scale-95"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-[1.5] flex items-center justify-center gap-2 py-3.5 rounded-xl bg-(--btn-primary-bg) text-(--btn-primary-text) font-bold shadow-lg hover:opacity-90 disabled:opacity-50 transition active:scale-95"
        >
          <Save size={18} />
          {isSubmitting ? "Saving..." : "Save Occasion"}
        </button>
      </div>
    </form>
  );
}

// ── Main Modal Component ──────────────────────────────────────────────────────
export default function OccasionFormModal({
  isOpen,
  onClose,
  mode = "create",
  initialData = null,
}) {
  const { addOccasion, editOccasion } = useOccasion();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const isEdit = mode === "edit";
  const Icon = isEdit ? Edit3 : Plus;

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      let res;
      if (isEdit && initialData?.id) {
        res = await editOccasion(initialData.id, formData);
      } else {
        res = await addOccasion(formData);
      }

      if (res.success) {
        toast.success(
          isEdit ? "Updated successfully!" : "Created successfully!",
        );
        onClose();
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      {/* KHÔNG dùng overflow-hidden ở đây để tránh bị cắt DatePicker */}
      <div className="w-full max-w-md bg-(--color-bg-card) rounded-[2rem] border border-(--color-border-light) shadow-2xl transition-all duration-300">
        {/* Header với Gradient: Thêm rounded-t-[2rem] để bo góc thủ công */}
        <div className="flex items-start justify-between px-8 py-7 bg-(--gradient-primary) rounded-t-[2rem]">
          <div className="flex flex-col gap-1 text-(--color-text-inverse)">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Icon size={22} />
              </div>
              <h1 className="text-2xl font-black tracking-tight">
                {isEdit ? "Edit Occasion" : "New Occasion"}
              </h1>
            </div>
            <p className="text-sm font-medium opacity-80">
              Mark an important date for your Tet prep.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black/10 text-(--color-text-inverse) hover:bg-black/20 transition-all text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8">
          <OccasionForm
            initialValues={initialData}
            onSubmit={handleFormSubmit}
            onCancel={onClose}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
