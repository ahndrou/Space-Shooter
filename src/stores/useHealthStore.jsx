import { create } from "zustand";

export const useHealthStore = create((set) => ({
  health: 5,
  decrement: () => {
    set((state) => ({
      health: state.health > 0 ? state.health - 1 : state.health,
    }));
  },
  reset: () => {
    set(() => ({ health: 5 }));
  },
}));
