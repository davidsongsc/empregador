import { create } from 'zustand';

interface UIState {
  isScrolled: boolean;
  setScrolled: (value: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isScrolled: false,
  setScrolled: (value) => set({ isScrolled: value }),
}));