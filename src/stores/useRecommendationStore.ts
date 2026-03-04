import { create } from 'zustand';
import type { Recommendation } from '@/types/recommendation';

interface RecommendationState {
  recommendations: Recommendation[];
  isLoading: boolean;
  error: string | null;
  selectedMoodId: string | null;
  isSurprise: boolean;

  setRecommendations: (recs: Recommendation[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setMood: (moodId: string, isSurprise: boolean) => void;
  toggleSaved: (recId: string) => void;
  getSavedItems: () => Recommendation[];
  clear: () => void;
}

export const useRecommendationStore = create<RecommendationState>((set, get) => ({
  recommendations: [],
  isLoading: false,
  error: null,
  selectedMoodId: null,
  isSurprise: false,

  setRecommendations: (recommendations) =>
    set({ recommendations, isLoading: false, error: null }),

  setLoading: (isLoading) =>
    set({ isLoading }),

  setError: (error) =>
    set({ error, isLoading: false }),

  setMood: (moodId, isSurprise) =>
    set({ selectedMoodId: moodId, isSurprise }),

  toggleSaved: (recId) =>
    set((state) => ({
      recommendations: state.recommendations.map((rec) =>
        rec.id === recId ? { ...rec, saved: !rec.saved } : rec
      ),
    })),

  getSavedItems: () =>
    get().recommendations.filter((rec) => rec.saved),

  clear: () =>
    set({
      recommendations: [],
      isLoading: false,
      error: null,
      selectedMoodId: null,
      isSurprise: false,
    }),
}));
