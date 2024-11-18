import axiosInstance from './axiosInstance';

// 알림 구독을 위한 토큰 전송
export const transferToken = async (token: string) => {
  await axiosInstance.post('/fcm', {
    fcmToken: token,
  });
};
