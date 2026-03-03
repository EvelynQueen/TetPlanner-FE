import React, { useState, useEffect } from "react";
import { useTaskCategory } from "../../hooks/useTaskCategory";
import { Plus, Edit3, Trash2, Check, RotateCcw, Tag, X } from "lucide-react";

export default function ManageTaskCategoryModal({ isOpen, onClose }) {
  const {
    categories,
    loading,
    addCategory,
    editCategory,
    removeCategory,
    fetchCategories,
  } = useTaskCategory();

  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    if (isOpen && categories.length === 0) {
      fetchCategories();
    }
  }, [isOpen, fetchCategories, categories.length]);

  if (!isOpen) return null;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const res = await addCategory({ name: newCategoryName });
    if (res.success) setNewCategoryName("");
  };

  const handleUpdate = async (id) => {
    if (!editName.trim()) return;
    const res = await editCategory(id, { name: editName });
    if (res.success) setEditingId(null);
  };

  const handleClose = () => {
    setNewCategoryName("");
    setEditingId(null);
    setEditName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-10 px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* HEADER */}
        <div className="flex items-start justify-between px-8 py-6 border-b border-gray-100 bg-white">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[color-mix(in_srgb,var(--color-primary-500)_15%,transparent)] text-[--color-primary-500] rounded-xl">
                <Tag size={22} strokeWidth={2.5} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Manage Categories
              </h1>
            </div>
            <p className="text-sm text-gray-500 font-medium">
              Organize your tasks efficiently.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer"
          >
            <X size={22} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-6 bg-white relative">
          {/* Lớp mờ (Loading overlay) khi đang tải dữ liệu (Chỉ áp dụng cho vùng body) */}
          {loading && categories.length === 0 && (
            <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center backdrop-blur-[1px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[--color-primary-500]"></div>
            </div>
          )}

          {/* Add Form */}
          <form
            onSubmit={handleAdd}
            className="flex flex-col gap-2 relative z-0"
          >
            <label className="text-sm font-semibold text-gray-900">
              Add New Category
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter category name..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                disabled={loading}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-[--color-primary-500] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-primary-500)_20%,transparent)] transition font-medium placeholder:text-gray-400"
              />
              <button
                type="submit"
                disabled={loading || !newCategoryName.trim()}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[--btn-primary-bg] text-white font-bold text-base shadow-[--btn-primary-shadow] hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition cursor-pointer"
              >
                <Plus size={20} strokeWidth={2.5} />
                Add
              </button>
            </div>
          </form>

          {/* Categories List */}
          <div className="flex flex-col gap-2 relative z-0">
            <label className="text-sm font-semibold text-gray-900 flex justify-between items-center">
              <span>Existing Categories</span>
              {/* Hiển thị chữ Loading nhỏ ở góc phải nếu đang tải nền */}
              {loading && categories.length > 0 && (
                <span className="text-xs text-gray-400 italic">
                  Updating...
                </span>
              )}
            </label>
            <div className="flex flex-col gap-3">
              {!loading && (!categories || categories.length === 0) ? (
                <div className="text-center py-8 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50">
                  <p className="text-sm font-medium text-gray-500">
                    No categories found. Create one above.
                  </p>
                </div>
              ) : (
                categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all group"
                  >
                    {editingId === cat.id ? (
                      /* Edit Mode */
                      <div className="flex items-center flex-1 gap-2 pr-2">
                        <input
                          autoFocus
                          className="flex-1 px-3 py-2 rounded-lg bg-gray-50 text-gray-900 font-medium focus:outline-none border border-[--color-primary-500] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-primary-500)_20%,transparent)]"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                        <button
                          onClick={() => handleUpdate(cat.id)}
                          className="p-2 text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors cursor-pointer shadow-sm"
                        >
                          <Check size={18} strokeWidth={3} />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-2 text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-700 rounded-lg transition-colors cursor-pointer"
                        >
                          <RotateCcw size={18} strokeWidth={2.5} />
                        </button>
                      </div>
                    ) : (
                      /* Display Mode */
                      <>
                        <span className="text-base font-semibold text-gray-800 px-2">
                          {cat.name}
                        </span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setEditingId(cat.id);
                              setEditName(cat.name);
                            }}
                            className="p-2 text-gray-400 bg-white border border-gray-200 hover:border-[--color-primary-500] hover:text-[--color-primary-500] rounded-lg transition-all cursor-pointer shadow-sm"
                          >
                            <Edit3 size={18} strokeWidth={2.5} />
                          </button>
                          <button
                            onClick={() => removeCategory(cat.id)}
                            className="p-2 text-gray-400 bg-white border border-gray-200 hover:border-red-500 hover:text-red-500 rounded-lg transition-all cursor-pointer shadow-sm"
                          >
                            <Trash2 size={18} strokeWidth={2.5} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex gap-3 pt-4 pb-6 px-8 border-t border-gray-100 bg-gray-50">
          <div className="flex-1"></div>
          <button
            type="button"
            onClick={handleClose}
            className="px-8 py-3 rounded-xl text-sm font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-900 transition-all cursor-pointer shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
