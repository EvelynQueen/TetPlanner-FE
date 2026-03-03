import { Download, Calendar, Plus, CalendarDays } from "lucide-react";

const CalendarHeader = ({ onCreateOccasion, onViewCalendar, onExport }) => (
  <div className="flex items-center justify-between px-8 py-6 bg-(--color-bg-main)/80 backdrop-blur-sm border-b border-(--color-border-light) sticky top-0 z-10 font-(--font-family-base) transition-colors duration-200">
    {/* Left — page title block */}
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-bold text-(--color-text-primary) tracking-tight transition-colors duration-200">
        Occasions & Calendar
      </h1>
      <p className="text-sm text-(--color-text-secondary) transition-colors duration-200">
        Year of the Horse 2026 &bull; BINH NGO
      </p>
    </div>

    {/* Right — action cluster */}
    <div className="flex items-center gap-3">
      {/* Export Button */}
      <button
        onClick={onExport}
        className="flex items-center gap-2 px-4 py-2 bg-(--color-bg-card)/70 border border-(--color-border-light) rounded-xl text-sm font-medium text-(--color-text-primary) shadow-(--shadow-sm) hover:bg-(--color-bg-card) transition-colors whitespace-nowrap cursor-pointer"
      >
        <Download size={15} className="shrink-0" />
        Export
      </button>

      {/* View Calendar/Manage Button */}
      <button
        onClick={onViewCalendar}
        className="flex items-center gap-2 px-4 py-2 bg-(--color-bg-card)/70 border border-(--color-border-light) rounded-xl text-sm font-medium text-(--color-text-primary) shadow-(--shadow-sm) hover:bg-(--color-bg-card) transition-colors whitespace-nowrap cursor-pointer"
      >
        <Calendar size={15} className="shrink-0" />
        Occasion View
      </button>

      {/* Visual separator */}
      <div className="w-px h-6 bg-(--color-border-medium) shrink-0 transition-colors duration-200" />

      {/* New Occasion CTA */}
      <button
        onClick={onCreateOccasion}
        className="flex items-center gap-2 px-4 py-2 bg-(--color-primary-300)/80 hover:bg-(--color-primary-500) transition-colors duration-200 text-(--color-text-primary) rounded-xl text-sm font-medium shadow-(--shadow-sm) whitespace-nowrap cursor-pointer"
      >
        <Plus size={14} />
        New Occasion
      </button>
    </div>
  </div>
);

export default CalendarHeader;
