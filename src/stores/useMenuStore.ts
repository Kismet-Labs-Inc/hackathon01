import { create } from 'zustand';
import type { MenuItem } from '@/types/menu';

interface MenuState {
  items: MenuItem[];
  isProcessing: boolean;
  error: string | null;
  setItems: (items: MenuItem[]) => void;
  setProcessing: (isProcessing: boolean) => void;
  setError: (error: string | null) => void;
  clear: () => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  items: [],
  isProcessing: false,
  error: null,

  setItems: (items) =>
    set({ items, isProcessing: false, error: null }),

  setProcessing: (isProcessing) =>
    set({ isProcessing }),

  setError: (error) =>
    set({ error, isProcessing: false }),

  clear: () =>
    set({ items: [], isProcessing: false, error: null }),
}));
