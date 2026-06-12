import { create } from "zustand";

export type DateRange = "7D" | "30D" | "90D" | "1Y";

interface DateRangeStore {
  range: DateRange;
  setRange: (r: DateRange) => void;
}

export const useDateRange = create<DateRangeStore>((set) => ({
  range: "30D",
  setRange: (range) => set({ range }),
}));
