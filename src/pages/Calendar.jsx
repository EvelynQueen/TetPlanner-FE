import React, { useState, useEffect, useMemo } from "react";
import CalendarHeader from "../components/calendar/CalendarHeader";
import OccasionFormModal from "../components/calendar/OccasionFormModal";
import { ChevronLeft, ChevronRight, Target } from "lucide-react";
import { useOccasion } from "../hooks/useOccasion";
import { Solar } from "lunar-javascript"; // Import thư viện chuyển đổi lịch Âm

const Calendar = () => {
  const { occasions, fetchOccasions } = useOccasion();
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const todayStr = useMemo(() => new Date().toLocaleDateString("en-CA"), []);

  useEffect(() => {
    fetchOccasions();
  }, [fetchOccasions]);

  const monthNames = [
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
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: null, fullDate: null, lunarDay: null });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;

      const solar = Solar.fromYmd(year, month + 1, i);
      const lunar = solar.getLunar();

      let lunarDisplay = lunar.getDay();
      if (lunarDisplay === 1) {
        lunarDisplay = `${lunar.getDay()}/${lunar.getMonth()}`;
      }

      days.push({
        day: i,
        fullDate: dateStr,
        lunarDay: lunarDisplay, // Lưu giá trị ngày Âm
        occasions: occasions.filter((o) => o.date === dateStr),
        isToday: dateStr === todayStr,
      });
    }
    return days;
  }, [currentDate, occasions, todayStr]);

  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
    );
  const prevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
    );
  const goToToday = () => setCurrentDate(new Date());

  return (
    <div className="min-h-screen bg-(--color-bg-main) flex flex-col transition-colors duration-200">
      <CalendarHeader
        onCreateOccasion={() => setIsModalOpen(true)}
        onViewCalendar={() => {}}
        onExport={() => alert("Exporting calendar...")}
      />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-(--color-bg-card) p-5 rounded-3xl border border-(--color-border-light) shadow-sm">
            <div className="flex flex-col">
              <h2 className="text-2xl font-black text-(--color-text-primary) tracking-tight">
                {monthNames[currentDate.getMonth()]}
              </h2>
              <span className="text-(--color-text-secondary) font-medium">
                {currentDate.getFullYear()}
              </span>
            </div>

            <div className="flex items-center gap-2 bg-(--color-bg-sidebar) p-1.5 rounded-2xl">
              <button
                onClick={prevMonth}
                className="p-2.5 hover:bg-(--color-bg-card) rounded-xl transition-all text-(--color-text-primary) shadow-none hover:shadow-sm"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={goToToday}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-(--color-bg-card) text-(--color-text-primary) rounded-xl shadow-sm border border-(--color-border-light) hover:bg-(--color-primary-500) hover:text-white transition-all active:scale-95"
              >
                <Target size={16} />
                Today
              </button>

              <button
                onClick={nextMonth}
                className="p-2.5 hover:bg-(--color-bg-card) rounded-xl transition-all text-(--color-text-primary) shadow-none hover:shadow-sm"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="bg-(--color-bg-card) rounded-[2rem] border border-(--color-border-light) overflow-hidden shadow-xl shadow-black/5">
            <div className="grid grid-cols-7 bg-(--color-bg-sidebar)/30 border-b border-(--color-border-light)">
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="py-5 text-center text-[10px] font-black uppercase tracking-[0.2em] text-(--color-text-muted)"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 auto-rows-[100px] md:auto-rows-[140px]">
              {calendarDays.map((item, index) => (
                <div
                  key={index}
                  className={`relative border-r border-b border-(--color-border-light) p-2 transition-all group
                    ${!item.day ? "bg-(--color-bg-sidebar)/10" : "hover:bg-(--color-bg-sidebar)/20"}
                    ${item.isToday ? "bg-(--color-primary-500)/5 !border-(--color-primary-400)" : ""}
                  `}
                >
                  {item.day && (
                    <div className="flex flex-col h-full">
                      <div className="flex justify-between items-start">
                        {/* Khu vực hiển thị ngày Dương và ngày Âm */}
                        <div className="flex flex-col items-center">
                          <span
                            className={`text-sm font-black w-8 h-8 flex items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${
                              item.isToday
                                ? "bg-(--color-primary-500) text-white shadow-lg shadow-primary-500/30"
                                : "text-(--color-text-primary)"
                            }`}
                          >
                            {item.day}
                          </span>

                          {/* Dòng hiển thị ngày Âm (Màu nhạt hơn, size nhỏ hơn) */}
                          <span
                            className={`text-[10px] font-medium mt-0.5 ${item.isToday ? "text-(--color-primary-500)" : "text-(--color-text-muted)"}`}
                          >
                            {item.lunarDay}
                          </span>
                        </div>

                        {item.isToday && (
                          <span className="text-[10px] font-bold text-(--color-primary-500) uppercase bg-white px-2 py-0.5 rounded-full border border-(--color-primary-200) shadow-sm">
                            Today
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-1.5 mt-1 overflow-y-auto scrollbar-none pr-1">
                        {item.occasions.map((occ) => (
                          <div
                            key={occ.id}
                            className="px-2.5 py-1.5 text-[10px] font-bold bg-(--color-bg-card) text-(--color-text-primary) rounded-xl border border-(--color-border-light) truncate shadow-sm hover:border-(--color-primary-400) hover:translate-x-1 transition-all cursor-pointer"
                          >
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-(--color-primary-500)"></div>
                              {occ.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <OccasionFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode="create"
      />
    </div>
  );
};

export default Calendar;
