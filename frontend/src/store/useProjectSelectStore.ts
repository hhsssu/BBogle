import { create } from 'zustand';

// 프로젝트 타입 정의
interface ProjectSelectStore {
  activeProjectId: number | null;
  setActiveProjectId: (id: number | null) => void;
}

// 프로젝트 id 상태관리
const useProjectSelectStore = create<ProjectSelectStore>((set) => ({
  activeProjectId: null,
  setActiveProjectId: (id: number | null) =>
    set(() => ({ activeProjectId: id })),
}));

export default useProjectSelectStore;
