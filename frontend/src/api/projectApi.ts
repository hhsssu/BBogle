import axios from 'axios';
import axiosInstance from './axiosInstance';

interface Project {
  title: string;
  image: string | null;
  description: string;
  startDate: string;
  endDate: string;
  memberCount: number;
  role: string[];
  skill: string[];
  notificationStatus: boolean;
  notificationTime: string;
}

export const getProjectList = async () => {
  try {
    const response = await axiosInstance.get('/projects');

    return response.data.projectList;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response!.status) {
        return [];
      }
    }
  }
};

// 진행중인 프로젝트 조회 API
export const getProgressProjectList = async () => {
  const response = await axiosInstance.get('/projects/in-progress');
  return response?.data.projectList;
};

export const getProject = async (projectId: number) => {
  const response = await axiosInstance.get(`/projects/${projectId}`);

  return response.data;
};

export const addProject = async (project: Project, file: File | null) => {
  const formData = new FormData();

  // JSON 데이터를 FormData에 추가
  formData.append(
    'request',
    new Blob(
      [
        JSON.stringify({
          title: project.title,
          description: project.description,
          startDate: project.startDate,
          endDate: project.endDate,
          memberCount: project.memberCount,
          role: project.role,
          skill: project.skill,
          notificationStatus: project.notificationStatus,
          notificationTime: project.notificationTime,
        }),
      ],
      { type: 'application/json' },
    ),
  );

  // 파일을 FormData에 추가
  formData.append(
    'file',
    file || new Blob([], { type: 'application/octet-stream' }),
  );

  // axios 요청 보내기
  await axiosInstance.post('/projects', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const changeNotificationStatus = async (
  projectId: number,
  status: boolean,
) => {
  await axiosInstance.patch(`/projects/${projectId}/notification`, {
    status: status,
  });
};

export const patchProject = async (
  projectId: number,
  project: Project,
  file: File | null,
) => {
  const formData = new FormData();

  // JSON 데이터를 FormData에 추가
  formData.append(
    'request',
    new Blob(
      [
        JSON.stringify({
          title: project.title,
          description: project.description,
          startDate: project.startDate,
          endDate: project.endDate,
          memberCount: project.memberCount,
          role: project.role,
          skill: project.skill,
          notificationStatus: project.notificationStatus,
          notificationTime: project.notificationTime,
        }),
      ],
      { type: 'application/json' },
    ),
  );

  // 파일을 FormData에 추가
  formData.append(
    'file',
    file || new Blob([], { type: 'application/octet-stream' }),
  );

  await axiosInstance.patch(`/projects/${projectId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteProject = async (projectId: number) => {
  await axiosInstance.delete(`/projects/${projectId}`);
};

export const finishProject = async (projectId: number) => {
  await axiosInstance.patch(`/projects/${projectId}/end`);
};

// 프로젝트 조회 - 검색 조건용 (프로젝트 id, 제목만 나옴)
export const getProjectTitles = async () => {
  const response = await axiosInstance.get('/projects/title');
  return response.data.projects;
};
