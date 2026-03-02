import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Tag, Loader2, X, Save } from "lucide-react";
import NotificationModal  from "../components/NotificationModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../service/categoryService";

// ── Colour palette ─────────────────────────────────────────────────────────────
const PALETTE = [
  "#f43f5e", "#e11d48", "#f97316", "#eab308",
  "#22c55e", "#0ea5e9", "#6366f1", "#a855f7",
  "#ec4899", "#14b8a6", "#94a3b8", "#78716c",
];

// ── Category form modal ────────────────────────────────────────────────────────
function CategoryFormModal({ isOpen, initial, onClose, onSubmit, loading }) {
  const [name,  setName]  = useState(initial?.name  ?? "");
  const [color, setColor] = useState(initial?.color ?? "#f43f5e");
  const [error, setError] = useState("");

  // Reset when modal opens with new data
  useEffect(() => {
    if (isOpen) {
      setName(initial?.name  ?? "");
      setColor(initial?.color ?? "#f43f5e");
      setError("");
    }
  }, [isOpen, initial?.id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) { setError("Tên danh mục không được để trống."); return; }
    onSubmit({ name: name.trim(), color });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-[480px] mx-4 bg-white rounded-2xl border border-slate-200 shadow-[0_25px_50px_0_rgba(0,0,0,0.25)] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 bg-rose-600">
          <div className="flex items-center gap-3">
            <Tag size={22} className="text-white" />
            <div>
              <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-white">
                {initial?.id ? "Chỉnh sửa danh mục" : "Thêm danh mục"}
              </h2>
              <p className="text-xs text-rose-200 font-['Plus_Jakarta_Sans']">Phân loại công việc Tết</p>
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-8">

          {/* Name input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700 font-['Plus_Jakarta_Sans']">
              Tên danh mục <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              placeholder="e.g. Mua sắm"
              className={`w-full px-4 py-3 rounded-xl border text-sm font-['Plus_Jakarta_Sans'] text-slate-700 placeholder:text-slate-400 outline-none transition focus:ring-2 focus:ring-rose-200 ${
                error ? "border-rose-400 bg-rose-50" : "border-slate-200 bg-slate-50"
              }`}
            />
            {error && <p className="text-xs text-rose-500 font-['Plus_Jakarta_Sans']">{error}</p>}
          </div>

          {/* Colour picker */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-slate-700 font-['Plus_Jakarta_Sans']">
              Màu sắc
            </label>
            <div className="flex flex-wrap gap-3">
              {PALETTE.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                    color === c ? "border-slate-700 scale-110" : "border-white"
                  }`}
                  title={c}
                />
              ))}
            </div>
            {/* Preview */}
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
              <span
                className="w-4 h-4 rounded-full shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm font-medium text-slate-700 font-['Plus_Jakarta_Sans']">
                {name || "Tên danh mục"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 font-['Plus_Jakarta_Sans'] hover:bg-slate-50 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-600 text-white text-sm font-bold font-['Plus_Jakarta_Sans'] shadow-[0_4px_6px_0_rgba(225,29,72,0.2)] hover:bg-rose-700 disabled:opacity-60 transition"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {initial?.id ? "Lưu thay đổi" : "Tạo danh mục"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [saving,     setSaving]     = useState(false);

  // undefined = closed | null = create | object = edit
  const [modalData,  setModalData]  = useState(undefined);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notif,      setNotif]      = useState(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchAll = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  // ── Create / Update ────────────────────────────────────────────────────────
  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      if (modalData?.id) {
        const updated = await updateCategory(modalData.id, payload);
        setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        setNotif({ type: "edit", name: updated.name });
      } else {
        const created = await createCategory(payload);
        setCategories((prev) => [...prev, created]);
        setNotif({ type: "create", name: created.name });
      }
      setModalData(undefined);
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    const target = deleteTarget;
    setDeleteTarget(null);
    setLoading(true);
    try {
      await deleteCategory(target.id);
      setCategories((prev) => prev.filter((c) => c.id !== target.id));
      setNotif({ type: "delete", name: target.name });
    } finally {
      setLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Create / Edit modal */}
      <CategoryFormModal
        isOpen={modalData !== undefined}
        initial={modalData ?? undefined}
        onClose={() => setModalData(undefined)}
        onSubmit={handleSubmit}
        loading={saving}
      />

      {/* Delete confirmation */}
      <DeleteConfirmModal
        isOpen={deleteTarget !== null}
        name={deleteTarget?.name}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />

      {/* Notifications */}
      {notif?.type === "create" && (
        <NotificationModal
          type="success"
          title="Danh mục đã được tạo!"
          message={<>Danh mục <span className="font-bold">"{notif.name}"</span> đã được thêm.</>}
          onClose={() => setNotif(null)}
          actions={[
            { label: "Thêm danh mục khác", onClick: () => { setNotif(null); setModalData(null); }, variant: "primary" },
          ]}
        />
      )}
      {notif?.type === "edit" && (
        <NotificationModal
          type="success"
          title="Đã cập nhật!"
          message={<>Danh mục <span className="font-bold">"{notif.name}"</span> đã được cập nhật.</>}
          onClose={() => setNotif(null)}
        />
      )}
      {notif?.type === "delete" && (
        <NotificationModal
          type="success"
          title="Đã xóa!"
          message={<>Danh mục <span className="font-bold">"{notif.name}"</span> đã được xóa.</>}
          onClose={() => setNotif(null)}
        />
      )}

      {/* Page */}
      <div className="flex flex-col flex-1 overflow-y-auto bg-slate-50 font-['Plus_Jakarta_Sans']">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
              <Tag size={20} className="text-rose-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Quản lý Danh mục</h1>
              <p className="text-sm text-slate-500">Tạo và quản lý danh mục cho công việc Tết</p>
            </div>
          </div>
          <button
            onClick={() => setModalData(null)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-bold shadow-[0_4px_6px_0_rgba(225,29,72,0.2)] hover:bg-rose-700 transition"
          >
            <Plus size={16} />
            Thêm danh mục
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 px-8 py-6">

          {loading && categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
              <Loader2 size={36} className="animate-spin text-rose-400" />
              <span className="text-sm">Đang tải danh mục...</span>
            </div>
          ) : categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
              <Tag size={40} />
              <span className="text-sm">Chưa có danh mục nào. Hãy tạo một danh mục!</span>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    <th className="pl-6 pr-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Màu</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Tên</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide pr-6">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                      <td className="pl-6 pr-4 py-4">
                        <span
                          className="w-6 h-6 rounded-full block shadow-sm"
                          style={{ backgroundColor: cat.color }}
                        />
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-medium text-slate-700">{cat.name}</span>
                      </td>
                      <td className="px-4 py-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setModalData(cat)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(cat)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="Xóa"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="text-xs text-slate-400 text-right">
            {categories.length} danh mục
          </p>
        </div>
      </div>
    </>
  );
}
