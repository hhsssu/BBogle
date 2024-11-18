import { useNavigate } from 'react-router-dom';
import useActivityStore from '../../../store/useActivityStore';

import ActivityForm from './ActivityForm';
import Modal from '../../common/modal/Modal';

import ActivityStyles from '../Activity.module.css';
import ActivityCreateStyles from './ActivityCreate.module.css';

import AlertTriangle from '../../../assets/image/icon/AlertTriangle.svg';
import BackIcon from '../../../assets/image/icon/Back.svg';

import { useEffect, useState } from 'react';

// 경험 수동 생성 컴포넌트
function ActivityCreate() {
  const nav = useNavigate();
  const activity = useActivityStore((state) => state.activity);
  const createActivity = useActivityStore((state) => state.createActivity);
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
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    resetActivity();
    setTitleError(false);
    setContentError(true);
    setTermError(false);
    setErrMsgOn(false);

    // 초기화가 완료되면 표시하도록 상태 설정
    setIsInitialized(true);
  }, []);

  if (!isInitialized) {
    return null;
  }

  // ✅ 돌아가기
  const handleGoBack = () => {
    nav('/activity');
  };

  const handleBackModal = () => {
    setBackModalOpen(!isBackModalOpen);
  };

  const handleCreateModal = () => {
    setCreateModalOpen(!isCreateModalOpen);
  };

  // ✅ 폼 제출 로직
  const submitForm = async () => {
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

  // ✅ 경험 생성
  const handleCreateActivity = async () => {
    setCreateModalOpen(!isCreateModalOpen);

    await createActivity(activity);
    nav('/activity');
  };

  return (
    <>
      <div className={ActivityStyles.backBtn} onClick={handleBackModal}>
        <img src={BackIcon} alt="돌아가기" />
        돌아가기
      </div>

      <section className={ActivityStyles.between}>
        <div
          className={`${ActivityStyles.center} ${ActivityStyles.title} ${ActivityCreateStyles.title}`}
        >
          경험 작성
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
        등록하기
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
        title={'경험을 생성하시겠어요?'}
        content={''}
        onClose={handleCreateModal}
        onConfirm={handleCreateActivity}
        confirmText={'확인'}
        cancleText={'취소'}
      />
    </>
  );
}

export default ActivityCreate;
