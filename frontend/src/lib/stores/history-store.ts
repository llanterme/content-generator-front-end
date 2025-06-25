import { create } from "zustand";
import { HistoryStore, HistoryItem } from "../types";

const STORAGE_KEY = "content-generation-history";

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  history: [],

  addHistoryItem: (item: HistoryItem) => {
    const currentHistory = get().history;
    const newHistory = [item, ...currentHistory].slice(0, 50); // Keep only last 50 items
    
    set({ history: newHistory });
    get().saveHistory();
  },

  removeHistoryItem: (id: string) => {
    const newHistory = get().history.filter((item) => item.id !== id);
    set({ history: newHistory });
    get().saveHistory();
  },

  clearHistory: () => {
    set({ history: [] });
    localStorage.removeItem(STORAGE_KEY);
  },

  loadHistory: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const history = JSON.parse(stored);
        set({ history });
      }
    } catch (error) {
      console.error("Failed to load history from localStorage:", error);
    }
  },

  saveHistory: () => {
    try {
      const { history } = get();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save history to localStorage:", error);
    }
  },
}));