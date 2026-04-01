import { create } from "zustand";

export const useHealthStore = create((set) => ({
    health: 50,
    decrement: () => {
        set((state) => ({health: state.health - 10}))
    }
}))