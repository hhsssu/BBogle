import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 열림/닫힘 상태 및 현재 탭 타입 정의
interface SideBarState {
  isOpen: boolean;
  activeTab: string;
  toggleSideBar: () => void;
  setActiveTab: (tab: string) => void;
}

// Zustand store
const useSideBarStore = create<SideBarState>()(
  persist<SideBarState>(
    (set) => ({
      isOpen: true,
      toggleSideBar: () => set((state) => ({ isOpen: !state.isOpen })),
      activeTab: 'main',
      setActiveTab: (tab: string) => set(() => ({ activeTab: tab })),
    }),
    {
      name: 'sidebarStorage',
    },
  ),
);

export default useSideBarStore;
