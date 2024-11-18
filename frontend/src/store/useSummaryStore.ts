import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  fetchSummaryInfo as fetchSummaryInfoApi,
  createSummary as createSummaryApi,
  updateSummary as updateSummaryApi,
  createSummaryAi as createSummaryAiApi,
} from '../api/summaryApi';

export interface Summary {
  summaryId: number;
  content: string;
}

interface SummaryState {
  // 회고 데이터 로딩 상태
  isSummaryLoading: boolean;
  // 회고 ai생성 로딩 상태
  isSummaryCreateLoading: boolean;

  // 회고 데이터
  summary: Summary;

  // 회고 데이터 초기화
  resetSummary: () => void;

  // 회고 데이터 가져오기
  fetchSummaryInfo: (projectId: number) => void;

  // 회고 수동 생성
  createSummary: (projectId: number, content: string) => void;

  // 회고 수정
  updateSummary: (
    projectId: number,
    summaryId: number,
    content: string,
  ) => void;

  // 회고 생성&수정 시 필드 수정
  updateSummaryContent: (content: string) => void;

  // 회고 AI 생성
  createSummaryAi: (projectId: number) => void;

  // 빈 내용 에러
  contentError: boolean;
  setContentError: (value: boolean) => void;

  // 에러 메시지
  errMsgOn: boolean;
  setErrMsgOn: (value: boolean) => void;
}

const useSummaryStore = create<SummaryState>()(
  persist(
    (set) => ({
      // 초기 로딩 상태
      isSummaryLoading: false,
      // 회고 ai 로딩 상태
      isSummaryCreateLoading: false,

      // 초기 회고 상태
      summary: {
        summaryId: -1,
        content: '',
      },

      resetSummary: () =>
        set(() => ({
          summary: {
            summaryId: -1,
            content: '',
          },
        })),

      // 회고 가져오기
      fetchSummaryInfo: async (projectId: number) => {
        set(() => ({ isSummaryLoading: true }));
        const data = await fetchSummaryInfoApi(projectId);
        if (data !== '') {
          set(() => ({ summary: data }));
        } else {
          set(() => ({
            summary: {
              summaryId: -1,
              content: '',
            },
          }));
        }
        set(() => ({ isSummaryLoading: false }));
      },

      // 회고 수동 생성
      createSummary: async (projectId: number, content: string) => {
        await createSummaryApi(projectId, content);
        window.location.reload();
      },

      // 회고 수정
      updateSummary: async (
        projectId: number,
        summaryId: number,
        content: string,
      ) => {
        await updateSummaryApi(projectId, summaryId, content);
      },

      // 회고 내용 수정
      updateSummaryContent: (content: string) => {
        set((state) => ({
          summary: {
            ...state.summary,
            content: content,
          },
        }));
      },

      // 회고 AI 생성
      createSummaryAi: async (projectId: number) => {
        set(() => ({ isSummaryCreateLoading: true }));
        const data = await createSummaryAiApi(projectId);
        await createSummaryApi(projectId, data);
        set(() => ({ isSummaryCreateLoading: false }));
        window.location.reload();
      },

      // 회고 작성 시 오류 (내용값 오류)
      contentError: false,
      setContentError: (value) => set(() => ({ contentError: value })),
      errMsgOn: false,
      setErrMsgOn: (value) => set(() => ({ errMsgOn: value })),
    }),
    {
      name: 'summaryStorage',
      partialize: () => ({}),
    },
  ),
);

export default useSummaryStore;
