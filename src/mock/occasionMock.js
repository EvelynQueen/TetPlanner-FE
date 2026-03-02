/**
 * occasionMock.js — in-memory mock store for occasion CRUD.
 *
 * Data model (v3):  1 occasion = 1 day.
 *   { id, customTitle, date, lunarDate: { day, month, year }, color, isDefault }
 *
 * customTitle is null for default Tết occasions — their display title is always
 * derived at render time via getOccasionTitleFromLunar(lunarDate) so it never
 * drifts out of sync with the actual lunar date.
 *
 * Default data: auto-generated Tết 2026 (28 Tết → Mùng 3 Tết).
 */
import { generateDefaultTetOccasions, solarToLunar } from "../utils/lunarCalendar";

const DELAY = 400;
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const genId = () =>
  typeof crypto?.randomUUID === "function"
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

// Seed with current Tết year's defaults (the year the app's current date falls in)
const currentYear = new Date().getFullYear();
let _occasions = generateDefaultTetOccasions(currentYear);

// ── CRUD ───────────────────────────────────────────────────────────────────────

export const mockGetOccasions = async () => {
  await delay(DELAY);
  return [..._occasions];
};

/**
 * @param {{ customTitle?: string|null, date: string, lunarDate?: object, color?: string }} payload
 */
export const mockCreateOccasion = async ({ customTitle, date, lunarDate, color }) => {
  await delay(DELAY);

  // Derive lunarDate from date if not provided
  const resolvedLunar = lunarDate ?? (() => {
    const [yyyy, mm, dd] = date.split("-").map(Number);
    const l = solarToLunar(dd, mm, yyyy);
    return { day: l.day, month: l.month, year: l.year };
  })();

  const newOcc = {
    id: genId(),
    customTitle: customTitle ?? null,
    date,
    lunarDate: resolvedLunar,
    color: color ?? "#e11d48",
    isDefault: false,
  };
  _occasions = [..._occasions, newOcc];
  return newOcc;
};

/**
 * @param {string} id
 * @param {{ customTitle?: string|null, date?: string, lunarDate?: object, color?: string }} patch
 */
export const mockUpdateOccasion = async (id, patch) => {
  await delay(DELAY);

  _occasions = _occasions.map((o) => {
    if (o.id !== id) return o;

    const newDate = patch.date ?? o.date;
    // Always recalculate lunarDate when date changes so title stays in sync
    const newLunar = patch.lunarDate ?? (() => {
      if (patch.date) {
        const [yyyy, mm, dd] = newDate.split("-").map(Number);
        const l = solarToLunar(dd, mm, yyyy);
        return { day: l.day, month: l.month, year: l.year };
      }
      return o.lunarDate;
    })();

    return {
      ...o,
      // undefined means "not touched"; null means "cleared to auto-derive"
      customTitle: patch.customTitle !== undefined ? (patch.customTitle || null) : o.customTitle,
      date:        newDate,
      lunarDate:   newLunar,
      color:       patch.color ?? o.color,
    };
  });

  return _occasions.find((o) => o.id === id);
};

export const mockDeleteOccasion = async (id) => {
  await delay(DELAY);
  _occasions = _occasions.filter((o) => o.id !== id);
};
