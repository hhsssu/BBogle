import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  fetchUserDetail,
  fetchUserNickname,
  updateUserNickName,
} from '../api/authApi';
import useAuthStore from './useAuthStore';

// 회원 정보 타입 정의
interface User {
  id: number | null;
  nickname: string;
  email: string | null;
  profileImage: string | null;
}

// 인증 여부 및 회원 관리 함수 타입 정의
interface UserStore {
  user: User | null;
  isEditingNickname: boolean;
  fetchUserNickname: () => void;
  fetchUser: () => void;
  setEditNickname: () => void;
  updateNickname: (nickname: string) => Promise<void>;
  updateProfile: (profile: string) => Promise<void>;
}

// 회원 정보 상태관리
const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isEditingNickname: false,

      // 유저 닉네임 가져오는 함수
      fetchUserNickname: async () => {
        const { setAuthenticated } = useAuthStore.getState();

        const nickname = await fetchUserNickname();

        set({
          user: {
            id: null,
            nickname: nickname,
            email: null,
            profileImage: null,
          },
        });
        setAuthenticated(true);
      },

      // 유저 정보 가져오는 함수
      fetchUser: async () => {
        const { setAuthenticated } = useAuthStore.getState();

        const user = await fetchUserDetail();

        set({
          user: {
            id: null,
            nickname: user.nickname,
            email: user.email,
            profileImage: user.profileImage,
          },
        });
        setAuthenticated(true);
      },

      // 닉네임 편집 모드 상태 관리 함수
      setEditNickname: () => {
        set((state) => ({ isEditingNickname: !state.isEditingNickname }));
      },

      // 회원 정보 수정 함수
      updateNickname: async (nickname: string) => {
        await updateUserNickName(nickname);
        set((state) => ({
          user: state.user ? { ...state.user, nickname } : state.user,
          isEditingNickname: false,
        }));
      },

      // 프로필 이미지 수정 함수
      updateProfile: async (profile: string) => {
        set((state) => ({
          user: state.user
            ? { ...state.user, profileImage: profile }
            : state.user,
        }));
      },
    }),
    {
      name: 'userStorage',
      partialize: (state) => ({
        user: state.user,
      }),
    },
  ),
);

export default useUserStore;
