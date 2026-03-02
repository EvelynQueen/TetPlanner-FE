import OccasionContext from "./OccasionContext";
import { useOccasion } from "../hooks/useOccasion";

export default function OccasionProvider({ children }) {
  const occasionHook = useOccasion();

  return (
    <OccasionContext.Provider value={occasionHook}>
      {children}
    </OccasionContext.Provider>
  );
}
