import axiosInstance from './axiosInstance';

interface Diary {
  title: string;
  answers: string[];
  images: Map<string, File>;
}

interface Question {
  question: string;
  description: string;
}

export const getDiaryList = async (projectId: number) => {
  const response = await axiosInstance.get(`/projects/${projectId}/diaries`);

  return response.data.diaryList;
};

export const getDiary = async (projectId: number, diaryId: number) => {
  const response = await axiosInstance.get(
    `/projects/${projectId}/diaries/${diaryId}`,
  );

  return response.data;
};

export const getQuestion = async () => {
  const response = await axiosInstance.get('/diaries/questions');

  return response.data;
};

// 개발일지 TITLE 생성 API
export const getDiaryTitle = async (
  questions: Question[],
  answers: string[],
) => {
  const response = await axiosInstance.post(
    '/rabbitmq/send/title',
    [
      { question: questions[0].question, answer: answers[0] },
      { question: questions[1].question, answer: answers[1] },
      { question: questions[2].question, answer: answers[2] },
    ],
    {
      timeout: 300000, // 5분 타임아웃
    },
  );

  return response.data.result;
};

export const addDiary = async (projectId: number, diary: Diary) => {
  const formData = new FormData();

  formData.append(
    'request',
    new Blob(
      [
        JSON.stringify({
          title: diary.title,
          answers: diary.answers,
        }),
      ],
      { type: 'application/json' },
    ),
  );

  if (diary.images.size === 0) {
    formData.append(
      'files',
      new Blob([], { type: 'application/octet-stream' }),
    );
  } else {
    [...diary.images.values()].map((image) => {
      formData.append('files', image);
    });
  }

  await axiosInstance.post(`/projects/${projectId}/diaries`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const patchDiary = async (
  projectId: number,
  diaryId: number,
  diary: Diary,
) => {
  const formData = new FormData();

  formData.append(
    'request',
    new Blob(
      [
        JSON.stringify({
          title: diary.title,
          answers: diary.answers,
        }),
      ],
      { type: 'application/json' },
    ),
  );

  if (diary.images.size === 0) {
    formData.append(
      'files',
      new Blob([], { type: 'application/octet-stream' }),
    );
  } else {
    [...diary.images.values()].map((image) => {
      formData.append('files', image);
    });
  }

  await axiosInstance.patch(
    `/projects/${projectId}/diaries/${diaryId}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
};

export const deleteDiary = async (projectId: number, diaryId: number) => {
  await axiosInstance.delete(`/projects/${projectId}/diaries/${diaryId}`);
};

// 오늘 작성한 개발일지 조회 API
export const fetchTodayDiary = async () => {
  const response = await axiosInstance.get('/diaries/today');
  return response.data.diaries;
};
