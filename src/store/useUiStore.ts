import { UIState } from '@/interfaces/isUiState';
import { create } from 'zustand';

export const useUIStore = create<UIState>((set) => ({
  isScrolled: false,
  setScrolled: (value) => set({ isScrolled: value }),
}));