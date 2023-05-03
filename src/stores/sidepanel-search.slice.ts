import { StateCreator } from "zustand";

export interface SidepanelSearchState {
  value: string;
  updateValue: (x: string) => void;
}

export const createSidepanelSearchSlice: StateCreator<SidepanelSearchState> = (set) => ({
  value: '',
  updateValue: (value: string) => set({ value }),
})