// ─── Dummy Task Data (API-Aligned Version) ───────────────────────────────────
// Replace this file with real API integration when the backend is ready.

const DELAY = 500; // ms – simulates network latency
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Simple UUID generator (no external library needed)
const generateUUID = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

// ─── Mock Category & Occasion IDs (simulate DB IDs) ──────────────────────────

export const TASK_CATEGORIES = [
  { id: "11111111-1111-1111-1111-111111111111", name: "Dọn dẹp & Trang trí" },
  { id: "22222222-2222-2222-2222-222222222222", name: "Ẩm thực" },
  { id: "33333333-3333-3333-3333-333333333333", name: "Lễ nghi & Văn hóa" },
  { id: "44444444-4444-4444-4444-444444444444", name: "Gia đình" },
  { id: "55555555-5555-5555-5555-555555555555", name: "Mua sắm" },
  { id: "66666666-6666-6666-6666-666666666666", name: "Phương tiện" },
  { id: "77777777-7777-7777-7777-777777777777", name: "Khác" },
];

export const MOCK_OCCASION_ID =
  "99999999-9999-9999-9999-999999999999";

// ─── In-memory Task Store ─────────────────────────────────────────────────────

let _tasks = [
  {
    id: generateUUID(),
    title: "Dọn dẹp nhà cửa",
    description: "Lau dọn kỹ trước Tết.",
    priority: "low",
    status: "todo",
    category_id: TASK_CATEGORIES[0].id,
    occasion_id: MOCK_OCCASION_ID,
    start_date: "2026-02-01",
    start_time: "08:00",
    due_date: "2026-02-01",
    due_time: "17:00",
    created_at: new Date().toISOString(),
    updated_at: null,
  },
  {
    id: generateUUID(),
    title: "Gói bánh chưng",
    description: "Chuẩn bị lá dong và nếp ngon.",
    priority: "high",
    status: "in_progress",
    category_id: TASK_CATEGORIES[1].id,
    occasion_id: MOCK_OCCASION_ID,
    start_date: "2026-02-08",
    start_time: "06:00",
    due_date: "2026-02-08",
    due_time: "12:00",
    created_at: new Date().toISOString(),
    updated_at: null,
  },
  {
    id: generateUUID(),
    title: "Chuẩn bị phong bì lì xì",
    description: "Mệnh giá 50k, 100k, 200k.",
    priority: "medium",
    status: "todo",
    category_id: TASK_CATEGORIES[2].id,
    occasion_id: MOCK_OCCASION_ID,
    start_date: "2026-01-28",
    start_time: "10:00",
    due_date: "2026-01-28",
    due_time: "12:00",
    created_at: new Date().toISOString(),
    updated_at: null,
  },
{
    id: generateUUID(),
    title: "Mua sắm quần áo Tết",
    description: "Mua áo dài, quần tây cho cả gia đình.",
    priority: "medium",
    status: "todo",
    category_id: TASK_CATEGORIES[4].id,
    occasion_id: MOCK_OCCASION_ID,
    start_date: "2026-01-20",
    start_time: "09:00",
    due_date: "2026-01-25",
    due_time: "18:00",
    created_at: new Date().toISOString(),
    updated_at: null,
},
{
    id: generateUUID(),
    title: "Kiểm tra xe máy",
    description: "Thay dầu, kiểm tra phanh, lốp.",
    priority: "high",
    status: "todo",
    category_id: TASK_CATEGORIES[5].id,
    occasion_id: MOCK_OCCASION_ID,
    start_date: "2026-01-15",
    start_time: "07:00",
    due_date: "2026-01-15",
    due_time: "11:00",
    created_at: new Date().toISOString(),
    updated_at: null,
},
{
    id: generateUUID(),
    title: "Gọi bác, cô thăm hỏi",
    description: "Liên hệ các thành viên gia đình.",
    priority: "low",
    status: "todo",
    category_id: TASK_CATEGORIES[3].id,
    occasion_id: MOCK_OCCASION_ID,
    start_date: "2026-01-25",
    start_time: "14:00",
    due_date: "2026-01-30",
    due_time: "20:00",
    created_at: new Date().toISOString(),
    updated_at: null,
},
];

// ─── Mock API Functions ────────────────────────────────────────────────────────

/**
 * Get single task by id
 */
export const mockGetTaskById = async (id) => {
  await delay(DELAY);
  const task = _tasks.find((t) => t.id === id);
  if (!task) throw new Error("Task not found");
  return {
    status: "success",
    data: task,
  };
};

/**
 * Get paginated tasks
 */
export const mockGetTasks = async (page = 1, size = 10) => {
  await delay(DELAY);

  const start = (page - 1) * size;
  const content = _tasks.slice(start, start + size);

  return {
    status: "success",
    data: {
      content,
      meta: {
        page,
        size,
        totalElements: _tasks.length,
        totalPages: Math.ceil(_tasks.length / size),
      },
    },
  };
};

/**
 * Create task
 */
export const mockCreateTask = async (data) => {
  await delay(DELAY);

  const now = new Date();
  const today = now.toISOString().split("T")[0];

  const newTask = {
    id: generateUUID(),
    title: data.title,
    description: data.description || null,
    priority: data.priority || "medium",
    status: data.status || "todo",
    category_id: data.category_id || null,
    occasion_id: data.occasion_id || null,
    start_date: data.start_date || today,
    start_time: data.start_time || "00:00",
    due_date: data.due_date || today,
    due_time: data.due_time || "23:59",
    created_at: now.toISOString(),
    updated_at: null,
  };

  _tasks = [..._tasks, newTask];

  return {
    status: "success",
    message: "Task created successfully.",
    data: newTask,
  };
};

/**
 * Update task
 */
export const mockUpdateTask = async (id, data) => {
  await delay(DELAY);

  const index = _tasks.findIndex((t) => t.id === id);
  if (index === -1) throw new Error("Task not found");

  const updated = {
    ..._tasks[index],
    ...data,
    updated_at: new Date().toISOString(),
  };

  _tasks[index] = updated;

  return {
    status: "success",
    message: "Task updated successfully.",
    data: updated,
  };
};

/**
 * Delete task
 */
export const mockDeleteTask = async (id) => {
  await delay(DELAY);

  const exists = _tasks.some((t) => t.id === id);
  if (!exists) throw new Error("Task not found");

  _tasks = _tasks.filter((t) => t.id !== id);

  return {
    status: "success",
    message: "Task deleted successfully.",
  };
};