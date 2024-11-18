import axios, { AxiosRequestConfig } from 'axios';
import { refreshAccessToken } from '../api/authApi';
import useAuthStore from '../store/useAuthStore';

const API_LINK = import.meta.env.VITE_API_URL;

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: API_LINK,
  timeout: 10000, // 요청 제한 시간 설정 (10초)
  headers: {
    'Content-Type': 'application/json',
  },
});

// 상태 플래그 및 대기 중인 요청 처리를 위한 배열 선언
let isRefreshing = false; // 토큰 갱신 중 여부를 나타내는 플래그
let refreshSubscribers: ((token: string) => void)[] = []; // 대기 중인 요청을 저장할 배열

// 대기 중인 요청을 다시 실행하기 위한 함수
const onRefreshed = (token: string) => {
  // 대기 중인 모든 요청에 새로 갱신된 토큰을 전달
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = []; // 배열 초기화
};

// 토큰이 갱신될 때까지 대기 중인 요청을 배열에 추가하는 함수
const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// 요청 인터셉터로 인증 헤더 추가
axiosInstance.interceptors.request.use(
  async (config) => {
    // localStorage에서 accessToken 가져오기
    let token = localStorage.getItem('accessToken');

    // accessToken이 없으면 refresh로 새 토큰 요청
    if (!token) {
      try {
        token = await refreshAccessToken();
        localStorage.setItem('accessToken', token!);
      } catch (error) {
        return Promise.reject(error);
      }
    }

    // 토큰이 있으면, 헤더에 accesstoken을 넣어 인증
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터 : 401 오류 발생 시 토큰 갱신 및 재요청 처리
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // 네트워크 오류 또는 서버 미응답에 대한 처리
    if (!error.response) {
      return Promise.reject(error);
    }

    // 401 Unauthorized 오류 처리
    const originalRequest: AxiosRequestConfig & { _retry?: boolean } =
      error.config;

    // 401 오류가 발생했고, 재시도 중이 아닌 경우
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // 이미 토큰 갱신이 진행 중인 경우 대기 중인 요청에 추가하고 Promise 반환
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((newToken: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }

            // 새로운 토큰으로 대기 중인 요청 재실행
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      // 토큰 갱신 시작
      isRefreshing = true;

      try {
        // 새로 갱신된 토큰 요청
        const newAccessToken = await refreshAccessToken();

        if (newAccessToken) {
          localStorage.setItem('accessToken', newAccessToken);
          onRefreshed(newAccessToken);
        }

        // 갱신된 토큰으로 원래 요청 재시도
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // RefreshToken이 만료된 경우 예외 처리
        const { setAuthenticated, setLoading } = useAuthStore.getState();
        setAuthenticated(false);
        setLoading(false);

        return Promise.reject(refreshError);
      } finally {
        // 토큰 갱신 상태 초기화
        isRefreshing = false;
      }
    }
    // 401 이외의 에러는 그대로 반환
    return Promise.reject(error);
  },
);

export default axiosInstance;
