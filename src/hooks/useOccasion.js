import { useEffect, useState } from "react";
import {
  getOccasions,
  createOccasion,
  updateOccasion,
  deleteOccasion,
} from "../service/occasionService";

export const useOccasion = () => {
  const [occasions, setOccasions] = useState([]);
  const [loading,   setLoading]   = useState(false);

  // ── Fetch ────────────────────────────────────────────────────────────────────
  const fetchOccasions = async () => {
    try {
      setLoading(true);
      const data = await getOccasions();
      setOccasions(data ?? []);
    } catch (error) {
      console.error("Fetch occasions failed", error);
    } finally {
      setLoading(false);
    }
  };

  // ── Create ───────────────────────────────────────────────────────────────────
  /**
   * @param {{ name: string, date: string, lunarDate?: object, color?: string }} payload
   * @throws {Error} if a duplicate date is detected locally before the API call
   */
  const handleCreate = async (payload) => {
    const duplicate = occasions.find((o) => o.date === payload.date);
    if (duplicate) throw new Error("DATE_TAKEN");

    const newOcc = await createOccasion(payload);
    setOccasions((prev) => [...prev, newOcc]);
    return newOcc;
  };

  // ── Update ───────────────────────────────────────────────────────────────────
  const handleUpdate = async (id, patch) => {
    if (patch.date) {
      const duplicate = occasions.find((o) => o.date === patch.date && o.id !== id);
      if (duplicate) throw new Error("DATE_TAKEN");
    }

    const updated = await updateOccasion(id, patch);
    setOccasions((prev) => prev.map((o) => (o.id === id ? updated : o)));
    return updated;
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

export default useOccasion;
