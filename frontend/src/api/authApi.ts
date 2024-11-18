import axios from 'axios';
import axiosInstance from './axiosInstance';

const API_LINK = import.meta.env.VITE_API_URL;

// Refresh Token 요청 전용 인스턴스
const refreshInstance = axios.create({
  baseURL: API_LINK,
  withCredentials: true, // Refresh Token을 쿠키로 보내기 위해 설정
});

// AccessToken을 재발급하는 API
export const refreshAccessToken = async () => {
  try {
    const response = await refreshInstance.get('/auth/refresh');
    return response.data.accessToken;
  } catch (error) {
    return Promise.reject(error);
  }
};

// 유저 정보를 가져오는 API
export const fetchUserDetail = async () => {
  const response = await axiosInstance.get('/users');
  return response.data;
};

// 유저 닉네임을 가져오는 API
export const fetchUserNickname = async () => {
  const response = await axiosInstance.get('/users/nickname');
  return response.data.nickname;
};

// 유저 닉네임을 수정하는 API
export const updateUserNickName = async (nickname: string) => {
  await axiosInstance.patch('/users/nickname', { nickname });
};

// 유저 프로필 이미지를 수정하는 API
export const updateUserProfile = async (profile: FormData) => {
  // 서버에 이미지 업로드 요청
  await axiosInstance.patch('/users/profile', profile, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// 로그아웃 API
export const logoutUser = async () => {
  await axiosInstance.post('/users/logout');
};
