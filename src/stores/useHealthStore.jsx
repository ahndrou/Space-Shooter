import { create } from "zustand";

export const useHealthStore = create((set) => ({
    health: 5,
    decrement: () => {
        set((state) => ({health: state.health - 1}))
    },
    reset: () => {
        set(() => ({health: 5}))
    }
}))