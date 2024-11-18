import axiosInstance from './axiosInstance';

// 키워드 불러오기
export const fetchActivityKeywords = async () => {
  const response = await axiosInstance.get('/keywords');
  return response.data.keywords;
};
