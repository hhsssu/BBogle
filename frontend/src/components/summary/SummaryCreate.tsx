import { useEffect, useState } from 'react';
import useSummaryStore, { Summary } from '../../store/useSummaryStore';
import styles from './Summary.module.css';
import ActivityCreateStyles from '../activity/activityCreateUpdate/ActivityCreate.module.css';
import SummaryForm from './SummaryForm';
import AlertTriangle from '../../assets/image/icon/AlertTriangle.svg';
import Modal from '../common/modal/Modal';
interface SummaryCreateProps {
  onCancleClick: () => void;
  onUpdateSuccess: () => void;
  projectId: number;
  summary: Summary;
}
// TODO 회고 수동 생성 API 연결

function SummaryCreate({
  onCancleClick,
  onUpdateSuccess,
  projectId,
  summary,
}: SummaryCreateProps) {
  // 폼 오류 설정하기
  const { contentError, setContentError, errMsgOn, setErrMsgOn } =
    useSummaryStore();
  const createSummary = useSummaryStore((state) => state.createSummary);
  const resetSummary = useSummaryStore((state) => state.resetSummary);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isBackModalOpen, setBackModalOpen] = useState(false);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    resetSummary();

    // 초기화가 완료되면 표시하도록 상태 설정
    setIsInitialized(true);
  }, []);

  if (!isInitialized) {
    return null;
  }
  const handleBackModal = () => {
    setBackModalOpen(!isBackModalOpen);
  };

  const handleCreateModal = () => {
    setCreateModalOpen(!isCreateModalOpen);
  };

  // 폼 제출 로직
  const submitForm = () => {
    // content 빈 값 오류 확인
    if (summary.content === '') {
      setContentError(true);
      setErrMsgOn(true);
      return;
    }

    setCreateModalOpen(true);
  };

  // 회고 등록
  const handleCreateSummary = async () => {
    setCreateModalOpen(!isCreateModalOpen);

    await createSummary(projectId, summary.content);
    onUpdateSuccess();
  };

  return (
    <>
      <SummaryForm content={summary.content} />
      <div className={styles.center}>
        <button className={styles.blackbtn} onClick={onCancleClick}>
          취소
        </button>
        <button
          className={`${styles.orangebtn} ${contentError && errMsgOn && ActivityCreateStyles.failBtn}`}
          onClick={submitForm}
        >
          등록
        </button>
      </div>
      {errMsgOn && (
        <div className={ActivityCreateStyles.errMsg}>
          <img
            className={ActivityCreateStyles.warnIcon}
            src={AlertTriangle}
            alt="경고"
          />
          내용을 입력해주세요
        </div>
      )}
      <Modal
        isOpen={isBackModalOpen}
        title={'이 페이지를 벗어나시겠어요?'}
        content={'작성 내용이 초기화됩니다.'}
        onClose={handleBackModal}
        onConfirm={onCancleClick}
        confirmText={'이동'}
        cancleText={'취소'}
      />

      <Modal
        isOpen={isCreateModalOpen}
        title={'경험을 수정하시겠어요?'}
        content={''}
        onClose={handleCreateModal}
        onConfirm={handleCreateSummary}
        confirmText={'확인'}
        cancleText={'취소'}
      />
    </>
  );
}

export default SummaryCreate;
