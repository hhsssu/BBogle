import { create } from 'zustand';
import { fetchActivityKeywords } from '../api/activityKeywordsApi';

export interface ActivityKeyword {
  id: number;
  type: boolean;
  name: string;
}

interface ActivityKeywordState {
  activityKeywords: ActivityKeyword[];
  fetchActivityKeywords: () => Promise<void>;
}

const useActivityKeywordStore = create<ActivityKeywordState>((set) => ({
  activityKeywords: [],

  // 키워드 리스트 가져오기
  fetchActivityKeywords: async () => {
    const data = await fetchActivityKeywords();
    set({ activityKeywords: data });
  },
}));

export default useActivityKeywordStore;
