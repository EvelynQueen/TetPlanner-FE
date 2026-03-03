import { useState } from "react";
import * as XLSX from "xlsx";
import {
  Plus,
  Search,
  ChevronDown,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";
import TaskHeader from "../components/task/TaskHeader";
import TaskTable from "../components/task/TaskTable";
import TaskRow from "../components/task/TaskRow";
import TaskFormModal from "../components/task/TaskFormModal";
import DeleteTaskModal from "../components/task/DeleteTaskModal";
import useTask from "../hooks/useTask";
import ManageTaskCategoryModal from "../components/task/ManageTaskCategoryModal";
import { toast } from "react-toastify";
// Table column definitions
const TASK_COLUMNS = [
  { key: "title", label: "Title" },
  { key: "category", label: "Category" },
  { key: "schedule", label: "Timeline" },
  { key: "priority", label: "Priority" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions", align: "right" },
];

// Helper UI
const FilterDropdown = ({ label }) => (
  <button className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl text-sm font-medium text-slate-800 hover:bg-slate-100 transition-colors whitespace-nowrap">
    {label}
    <ChevronDown size={14} className="text-slate-500 shrink-0" />
  </button>
);

// Page
const Tasks = () => {
  const {
    tasks,
    categories,
    occasions,
    loading,
    fetchTaskById,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleStatusChange,
  } = useTask();

  const [search, setSearch] = useState("");
  // undefined = closed | null = create | Task object = edit
  const [modalTask, setModalTask] = useState(undefined);
  const [deleteTarget, setDeleteTarget] = useState(null);
  // "list" | "kanban"
  const [view, setView] = useState("list");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const filtered = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()),
  );

  const handleExport = () => {
    if (!filtered.length) {
      toast.warning("No tasks to export.");
      return;
    }

    const exportData = filtered.map((task, index) => {
      const formatStatus = (status) => {
        if (!status) return "TODO";
        if (status === "IN_PROGRESS") return "In Progress";
        if (status === "DONE") return "Done";
        return "To Do";
      };

      const formatPriority = (priority) => {
        if (priority === "high") return "High";
        if (priority === "medium") return "Medium";
        if (priority === "low") return "Low";
        return "Medium";
      };
      console.log("Exporting task:", task);
      return {
        "No.": index + 1,
        "Task Title": task.title || "Untitled Task",
        Category: task.categoryName || "No Category",
        Timeline: task.timelineLabel || "N/A",
        Status: formatStatus(task.status),
        Priority: formatPriority(task.priority),
        "Start Date": task.start_date || "N/A",
        "Due Date": task.due_date || "N/A",
        Description: task.description || "",
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");

    XLSX.writeFile(workbook, "Tet_Preparation_Tasks.xlsx");

    toast.success("Exported tasks to Excel successfully!");
  };

  const handleEditClick = async (task) => {
    // Set partial task to open modal in loading state
    setModalTask({ id: task.id, _isLoading: true });
    try {
      const fullTask = await fetchTaskById(task.id);
      setModalTask(fullTask);
    } catch {
      setModalTask(undefined);
    }
  };

  const handleFormSubmit = async (form) => {
    if (modalTask?.id) {
      await handleUpdate(modalTask.id, form);
      setModalTask(undefined);
    } else {
      await handleCreate(form);
      setModalTask(undefined);
    }
  };

  const handleDeleteConfirm = async () => {
    const deleted = deleteTarget;
    setDeleteTarget(null);
    await handleDelete(deleted.id);
  };

  return (
    <>
      <ManageTaskCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />
      {/* Create / Edit form modal */}
      <TaskFormModal
        isOpen={modalTask !== undefined}
        mode={modalTask?.id ? "edit" : "create"}
        initialData={modalTask ?? undefined}
        categories={categories}
        occasions={occasions}
        onClose={() => setModalTask(undefined)}
        onSubmit={handleFormSubmit}
      />

      {/* Delete confirmation modal */}
      <DeleteTaskModal
        isOpen={deleteTarget !== null}
        task={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />

      <div className="flex flex-col flex-1 overflow-y-auto bg-(--color-bg-main)">
        {/* Header */}
        <TaskHeader
          currentView={view}
          onViewChange={setView}
          onCreateTask={() => setModalTask(null)}
          onManageCategories={() => setIsCategoryModalOpen(true)}
          onExport={handleExport}
        />

        {/* Body */}
        <div className="flex flex-col gap-6 px-8 py-6">
          {/* Search + Filters */}
          <div className="flex items-center gap-3 p-4 bg-(--color-bg-card) rounded-2xl border border-(--color-border-light) shadow-(--shadow-sm) transition-colors duration-200">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-muted)"
              />
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-(--color-bg-sidebar) rounded-xl text-sm text-(--color-text-primary) placeholder:text-(--color-text-muted) outline-none focus:ring-2 focus:ring-(--color-primary-500)/20 transition"
              />
            </div>
            <div className="flex items-center gap-3">
              <FilterDropdown label="All Timelines" />
              <FilterDropdown label="All Categories" />
              <FilterDropdown label="All Priorities" />
              <button className="w-10 h-10 flex items-center justify-center bg-(--color-bg-sidebar) rounded-xl hover:bg-(--color-border-light) transition-colors text-(--color-text-secondary)">
                <SlidersHorizontal size={16} />
              </button>
            </div>
          </div>

          {/* ── List View ── */}
          {view === "list" && (
            <TaskTable
              columns={TASK_COLUMNS}
              data={filtered}
              loading={loading}
              emptyMessage={
                search
                  ? `No tasks matching "${search}".`
                  : "No tasks yet. Create your first one!"
              }
              renderRow={(task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onEdit={handleEditClick}
                  onDelete={(t) => setDeleteTarget(t)}
                  onStatusChange={handleStatusChange}
                />
              )}
              pagination={
                <div className="px-6 py-4">
                  <p className="text-sm text-(--color-text-secondary)">
                    Showing{" "}
                    <span className="font-bold text-(--color-text-primary)">
                      {filtered.length}
                    </span>{" "}
                    task{filtered.length !== 1 ? "s" : ""}
                  </p>
                </div>
              }
            />
          )}

          {/* ── Kanban View ── */}
          {view === "kanban" && (
            <KanbanBoard
              tasks={filtered}
              onEdit={handleEditClick}
              onDelete={(t) => setDeleteTarget(t)}
              onAddTask={() => setModalTask(null)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Tasks;
