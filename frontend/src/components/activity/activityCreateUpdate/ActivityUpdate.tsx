import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ActivityForm from './ActivityForm';
import useActivityStore from '../../../store/useActivityStore';

import ActivityStyles from '../Activity.module.css';
import ActivityCreateStyles from './ActivityCreate.module.css';

import AlertTriangle from '../../../assets/image/icon/AlertTriangle.svg';
import BackIcon from '../../../assets/image/icon/Back.svg';
import Modal from '../../common/modal/Modal';
import NotFoundPage from '../../../pages/NotFoundPage';

// 경험 수정 컴포넌트
function ActivityUpdate() {
  const nav = useNavigate();
  const { activityId } = useParams();
  // activityId를 숫자로 변환
  const numericActivityId = activityId ? parseInt(activityId, 10) : 0;
  const activity = useActivityStore((state) => state.activity);
  const fetchActivityById = useActivityStore(
    (state) => state.fetchActivityById,
  );
  const updateActivity = useActivityStore((state) => state.updateActivity);
  const resetActivity = useActivityStore((state) => state.resetActivity);

  // 폼 오류 설정하기
  const {
    titleError,
    setTitleError,
    contentError,
    setContentError,
    termError,
    setTermError,
    errMsgOn,
    setErrMsgOn,
  } = useActivityStore();

  const [isBackModalOpen, setBackModalOpen] = useState(false);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  // ✅데이터 불러오기
  useEffect(() => {
    fetchActivityById(numericActivityId);
  }, [activityId]);

  // ✅돌아가기
  const handleGoBack = () => {
    nav(`/activity/${activityId}`);
  };

  const handleBackModal = () => {
    setBackModalOpen(!isBackModalOpen);
  };

  const handleCreateModal = () => {
    setCreateModalOpen(!isCreateModalOpen);
  };

  // ✅ 폼 제출 로직
  const submitForm = () => {
    // 1. 빈 값 오류 확인
    if (activity.title === '') {
      setTitleError(true);
      setErrMsgOn(true);
      return;
    }

    if (activity.content === '') {
      setContentError(true);
      setErrMsgOn(true);
      return;
    }

    // 2. 날짜 오류 확인
    if (activity.startDate === undefined || activity.endDate === undefined) {
      setTermError(true);
      setErrMsgOn(true);
      return;
    }
    setCreateModalOpen(true);
  };

  // ✅경험 생성
  const handleUpdateActivity = async () => {
    setCreateModalOpen(!isCreateModalOpen);

    await updateActivity(numericActivityId, activity);
    nav(`/activity/${activityId}`);
  };

  useEffect(() => {
    resetActivity();
    setTitleError(false);
    setContentError(true);
    setTermError(false);
    setErrMsgOn(false);
  }, []);

  // 유효하지 않은 경험일 경우 NotFoundPage 렌더링
  if (!activity || activity.activityId !== numericActivityId) {
    return <NotFoundPage />;
  }

  return (
    <>
      <div className={ActivityStyles.backBtn} onClick={handleGoBack}>
        <img src={BackIcon} alt="돌아가기" />
        돌아가기
      </div>

      <section className={ActivityStyles.between}>
        <div
          className={`${ActivityStyles.center} ${ActivityStyles.title} ${ActivityCreateStyles.title}`}
        >
          경험 수정
        </div>
      </section>

      <ActivityForm
        title={activity.title}
        content={activity.content}
        startDate={activity.startDate}
        endDate={activity.endDate}
        projectId={activity.projectId}
        keywords={activity.keywords}
      />
      <button
        className={`${ActivityStyles.btn} ${ActivityCreateStyles.regist} ${(titleError || contentError || termError) && errMsgOn && ActivityCreateStyles.failBtn}`}
        onClick={submitForm}
      >
        수정 완료
      </button>
      {errMsgOn && (
        <div className={ActivityCreateStyles.errMsg}>
          <img
            className={ActivityCreateStyles.warnIcon}
            src={AlertTriangle}
            alt="경고"
          />
          필수 입력값을 확인해주세요{' '}
        </div>
      )}
      <Modal
        isOpen={isBackModalOpen}
        title={'이 페이지를 벗어나시겠어요?'}
        content={'작성 내용이 초기화됩니다.'}
        onClose={handleBackModal}
        onConfirm={handleGoBack}
        confirmText={'이동'}
        cancleText={'취소'}
      />

      <Modal
        isOpen={isCreateModalOpen}
        title={'경험을 수정하시겠어요?'}
        content={''}
        onClose={handleCreateModal}
        onConfirm={handleUpdateActivity}
        confirmText={'확인'}
        cancleText={'취소'}
      />
    </>
  );
}

export default ActivityUpdate;
