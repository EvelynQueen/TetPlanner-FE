import { useContext } from "react";
import { OccasionContext } from "../contexts/OccasionContext";

export function useOccasion() {
  const context = useContext(OccasionContext);
  if (!context) {
    throw new Error("useOccasion phải được sử dụng bên trong OccasionProvider");
  }
  return context;
}
