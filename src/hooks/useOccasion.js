import { useEffect, useState } from "react";
import {
  getOccasions,
  createOccasion,
  updateOccasion,
  deleteOccasion,
} from "../service/occasionService";

export const useOccasion = () => {
  const [occasions, setOccasions] = useState([]);
  const [loading, setLoading] = useState(false);

  // ── Fetch ────────────────────────────────────────────────────────────────────
  const fetchOccasions = async () => {
    try {
      setLoading(true);
      const data = await getOccasions();
      setOccasions((data ?? []).map((occ) => normaliseOccasion(occ)));
    } catch (error) {
      console.error("Fetch occasions failed", error);
    } finally {
      setLoading(false);
    }
  };

  // ── Create ───────────────────────────────────────────────────────────────────
  /**
   * @param {{ customTitle?: string|null, date: string, color?: string }} payload
   *   - customTitle is mapped to `name` for the backend OccasionRequest
   *   - date is sent as-is (yyyy-MM-dd)
   */
  const handleCreate = async (payload) => {
    const duplicate = occasions.find((o) => o.date === payload.date);
    if (duplicate) throw new Error("DATE_TAKEN");

    // Map frontend shape → backend OccasionRequest { name, date }
    const apiPayload = {
      name: payload.customTitle || payload.name || "Occasion",
      date: payload.date,
    };

    const newOcc = await createOccasion(apiPayload);

    // Normalise the returned OccasionResponse to include frontend-expected fields
    const normalised = normaliseOccasion(newOcc, payload);
    setOccasions((prev) => [...prev, normalised]);
    return normalised;
  };

  // ── Update ───────────────────────────────────────────────────────────────────
  const handleUpdate = async (id, patch) => {
    if (patch.date) {
      const duplicate = occasions.find((o) => o.date === patch.date && o.id !== id);
      if (duplicate) throw new Error("DATE_TAKEN");
    }

    // Map frontend shape → backend OccasionUpdateRequest { name?, date? }
    const apiPayload = {};
    if (patch.customTitle !== undefined) {
      apiPayload.name = patch.customTitle || patch.name || undefined;
    }
    if (patch.name !== undefined) {
      apiPayload.name = patch.name;
    }
    if (patch.date) {
      apiPayload.date = patch.date;
    }

    const updated = await updateOccasion(id, apiPayload);

    const normalised = normaliseOccasion(updated, patch);
    setOccasions((prev) => prev.map((o) => (o.id === id ? normalised : o)));
    return normalised;
  };

  // ── Delete ───────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    await deleteOccasion(id);
    setOccasions((prev) => prev.filter((o) => o.id !== id));
  };

  useEffect(() => {
    fetchOccasions();
  }, []);

  return {
    occasions,
    loading,
    fetchOccasions,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
};

/**
 * Normalise an OccasionResponse from the backend so it carries the fields
 * the UI already expects (customTitle, color, isDefault).
 *
 * Backend shape:  { id, name, date, tasks }
 * Frontend shape: { id, customTitle, date, color, isDefault, tasks }
 */
function normaliseOccasion(apiOcc, localPatch = {}) {
  return {
    ...apiOcc,
    customTitle: apiOcc.name ?? localPatch.customTitle ?? null,
    color: localPatch.color ?? apiOcc.color ?? "#e11d48",
    isDefault: apiOcc.isDefault ?? false,
  };
}

export default useOccasion;
