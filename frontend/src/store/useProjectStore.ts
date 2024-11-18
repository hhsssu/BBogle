import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  getProject,
  getProjectList,
  getProjectTitles,
} from '../api/projectApi';

interface ProjectCard {
  projectId: number;
  image: string | null;
  title: string;
  description: string;
  status: boolean;
  startDate: string;
  endDate: string;
  notificationStatus: boolean;
}

interface Project {
  projectId: number;
  title: string;
  image: string | null;
  description: string;
  startDate: string;
  endDate: string;
  memberCount: number;
  role: string[];
  skill: string[];
  status: boolean;
  notificationStatus: boolean;
  notificationTime: string;
}

interface ProjectTitle {
  projectId: number;
  title: string;
}

interface ProjectState {
  // 프로젝트 데이터 로딩 상태
  isProjectLoading: boolean;

  // 데이터 찾기 상태
  isProjectNotFound: boolean;

  // 프로젝트 리스트
  projectList: ProjectCard[];
  getProjectList: () => void;
  projectTitles: ProjectTitle[];
  getProjectTitles: () => void;

  // 프로젝트 하나
  project: Project;
  setProject: (pjt: Project) => void;
  initProject: () => void;
  getProject: (pjtId: number) => void;
  updateProjectField: (
    field: string,
    value: string | string[] | number | boolean,
  ) => void;

  // 프로젝트 생성/수정
  projectImage: File | null;
  setProjectImage: (value: File) => void;
  titleError: boolean;
  setTitleError: (value: boolean) => void;
  termError: boolean;
  setTermError: (value: boolean) => void;
  errMsgOn: boolean;
  setErrMsgOn: (value: boolean) => void;

  // 탭 index
  tabIdx: number;
  setTabIdx: (value: number) => void;
}

const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      // 프로젝트 데이터 로딩 상태
      isProjectLoading: false,
      // 데이터 찾기 상태
      isProjectNotFound: false,
      // 프로젝트 리스트
      projectList: [],
      getProjectList: async () => {
        set(() => ({ isProjectLoading: true }));
        const data = await getProjectList();
        set(() => ({ projectList: data, isProjectLoading: false }));
      },

      projectTitles: [],
      getProjectTitles: async () => {
        set(() => ({ isProjectLoading: true }));
        const data = await getProjectTitles();
        set(() => ({ projectTitles: data, isProjectLoading: false }));
      },

      // 프로젝트 하나
      project: {
        projectId: -1,
        image: null,
        title: '',
        description: '',
        status: false,
        startDate: '',
        endDate: '',
        memberCount: 1,
        role: [],
        skill: [],
        notificationStatus: false,
        notificationTime: '17:30',
      },
      setProject: (pjt) => set(() => ({ project: pjt })),
      initProject: () =>
        set(() => ({
          projectImage: null,
          project: {
            projectId: -1,
            image: null,
            title: '',
            description: '',
            status: true,
            startDate: '',
            endDate: '',
            memberCount: 1,
            role: [],
            skill: [],
            notificationStatus: false,
            notificationTime: '17:30',
          },
        })),
      getProject: async (pjtId) => {
        set(() => ({ isProjectLoading: true }));

        const data = await getProject(pjtId);

        if (data.image) {
          // 이미지 URL을 사용해 Blob으로 변환
          const response = await fetch(data.image + '?' + new Date().getTime());
          const blob = await response.blob();

          // Blob을 File로 변환
          const file = new File([blob], 'project_image.jpg', {
            type: blob.type,
          });

          set(() => ({
            isProjectLoading: false,
            project: data,
            projectImage: file,
          }));

          return;
        }

        set(() => ({
          isProjectLoading: false,
          project: data,
          projectImage: null,
        }));
      },
      updateProjectField: (field, value) =>
        set((state) => ({ project: { ...state.project, [field]: value } })),

      // 프로젝트 생성/수정
      projectImage: null,
      setProjectImage: (value) => set(() => ({ projectImage: value })),
      titleError: false,
      setTitleError: (value) => set(() => ({ titleError: value })),
      termError: false,
      setTermError: (value) => set(() => ({ termError: value })),
      errMsgOn: false,
      setErrMsgOn: (value) => set(() => ({ errMsgOn: value })),

      // 탭 index
      tabIdx: 0,
      setTabIdx: (value) => set(() => ({ tabIdx: value })),
    }),
    {
      name: 'projectStorage',
      partialize: (state) => ({
        project: state.project,
        tabIdx: state.tabIdx,
      }),
    },
  ),
);

export default useProjectStore;
