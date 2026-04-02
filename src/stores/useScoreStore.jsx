import { create } from "zustand";

export const useScoreStore = create((set) => ({
    score: 0,
    increment: (amount) => {
        set((state) => ({score: state.score + amount}))
    },
    reset: () => {
        set(() => ({score: 0}))
    }
}))