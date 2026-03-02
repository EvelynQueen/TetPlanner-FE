/**
 * categoryMock.js — in-memory mock store for category CRUD.
 * Replace with real API calls when backend is ready.
 */

const DELAY = 400;
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const genId = () => crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);

// ── Default categories (mirrors TaskFormModal constants) ─────────────────────
let _categories = [
  { id: "11111111-1111-1111-1111-111111111111", name: "Dọn dẹp & Trang trí", color: "#f43f5e" },
  { id: "22222222-2222-2222-2222-222222222222", name: "Ẩm thực",             color: "#22c55e" },
  { id: "33333333-3333-3333-3333-333333333333", name: "Lễ nghi & Văn hóa",  color: "#6366f1" },
  { id: "44444444-4444-4444-4444-444444444444", name: "Gia đình",            color: "#a855f7" },
  { id: "55555555-5555-5555-5555-555555555555", name: "Mua sắm",             color: "#0ea5e9" },
  { id: "66666666-6666-6666-6666-666666666666", name: "Phương tiện",         color: "#f97316" },
  { id: "77777777-7777-7777-7777-777777777777", name: "Khác",                color: "#94a3b8" },
];

export const mockGetCategories = async () => {
  await delay(DELAY);
  return [..._categories];
};

export const mockCreateCategory = async ({ name, color }) => {
  await delay(DELAY);
  const newCat = { id: genId(), name, color: color ?? "#94a3b8" };
  _categories = [..._categories, newCat];
  return newCat;
};

export const mockUpdateCategory = async (id, { name, color }) => {
  await delay(DELAY);
  _categories = _categories.map((c) =>
    c.id === id ? { ...c, name: name ?? c.name, color: color ?? c.color } : c
  );
  return _categories.find((c) => c.id === id);
};

export const mockDeleteCategory = async (id) => {
  await delay(DELAY);
  _categories = _categories.filter((c) => c.id !== id);
};
