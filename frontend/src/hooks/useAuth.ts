import { useEffect } from 'react';
import axios from 'axios';
import useAuthStore from '../store/useAuthStore';
import { fetchUserNickname } from '../api/authApi';

export const useAuth = () => {
  const { isAuthenticated, setAuthenticated, loading, setLoading } =
    useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      const verifyUser = async () => {
        try {
          await fetchUserNickname();
          setAuthenticated(true);
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            setAuthenticated(false);
          } else {
            setAuthenticated(false);
          }
        } finally {
          setLoading(false);
        }
      };
      verifyUser();
    } else {
      setLoading(false); // 인증된 경우 바로 로딩 상태 해제
    }
  }, [isAuthenticated, setAuthenticated, setLoading]);

  return { isAuthenticated, loading };
};
