import { create } from "zustand";

export const useGameStateStore = create((set) => ({
    gameID: 0,
    newGame: () => {
        set((state) => ({gameID: state.gameID + 1}))
    }
}))