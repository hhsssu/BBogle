import { Activity } from './../store/useActivityStore';
import { ActivityKeyword } from '../store/useActivityKeywordStore';
import axiosInstance from './axiosInstance';

export interface NewActivity {
  title: string;
  content: string;
  startDate: Date;
  endDate: Date;
  projectTitle?: string;
  keywords: ActivityKeyword[];
}

// 경험 수동 생성
export const createActivity = async (activity: Activity) => {
  const response = await axiosInstance.post('/activities', {
    title: activity.title,
    content: activity.content,
    startDate: activity.startDate,
    endDate: activity.endDate,
    keywords: activity.keywords,
    projectId: activity.projectId,
  });

  return response.data;
};

// 경험 수정
export const updateActivity = async (
  activityId: number,
  activity: Activity,
) => {
  const response = await axiosInstance.patch(`/activities/${activityId}`, {
    title: activity.title,
    content: activity.content,
    startDate: activity.startDate,
    endDate: activity.endDate,
    keywords: activity.keywords,
    projectId: activity.projectId,
  });
  return response.data;
};

// 경험 목록 조회
export const fetchActivities = async (
  word: string | null,
  keywords: number[],
  projects: number[],
) => {
  const response = await axiosInstance.post('/activities/search', {
    word: word,
    keywords: keywords,
    projects: projects,
  });

  return response.data.activities;
};

// 경험 id 조회
export const fetchActivityById = async (activityId: number) => {
  const response = await axiosInstance.get(`/activities/${activityId}`);
  return response.data;
};

export const deleteActivity = async (activityId: number) => {
  await axiosInstance.delete(`/activities/${activityId}`);
};

// 경험 AI 생성
export const createActivityAi = async (content: string) => {
  const data = await axiosInstance.get('/keywords');

  const response = await axiosInstance.post(
    '/rabbitmq/send/experience',
    {
      retrospective_content: content,
      keywords: data.data.keywords,
    },
    { timeout: 300000 }, // 5분 타임아웃
  );

  return response.data.experiences;
};

// 추출된 경험 선택
export const saveActivityApi = async (
  projectId: number,
  savedActivities: number[],
  newActivities: NewActivity[],
) => {
  const transformedActivities = newActivities.map((activity) => ({
    ...activity,
    keywords: activity.keywords[0].id, // keywords를 id만 포함
  }));

  await axiosInstance.post(`/projects/${projectId}/activities`, {
    savedActivities: savedActivities,
    newActivities: transformedActivities,
  });
};
