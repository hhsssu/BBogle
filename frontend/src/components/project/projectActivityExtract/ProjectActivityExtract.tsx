import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import useActivityStore, { Activity } from '../../../store/useActivityStore';

import ActivityStyles from '../../activity/Activity.module.css';
import styles from './ProjectActivity.module.css';

import BackIcon from '../../../assets/image/icon/Back.svg';
import ProjectActivityOrigin from './ProjectActivityOrigin';
import ProjectActivityNew from './ProjectActivityNew';
import ProjectActivityDetail from './ProjectActivityDetail';
import Modal from '../../common/modal/Modal';
import { NewActivity } from '../../../api/activityApi';
import { useParams } from 'react-router-dom';

function ProjectActivityExtract() {
  const navigate = useNavigate();
  const { pjtId } = useParams();

  // 기존 활동 ID 배열
  const [selectedOriginActivities, setSelectedOriginActivities] = useState<
    number[]
  >([]);
  // 새로운 활동 객체 배열
  const [selectedNewActivities, setSelectedNewActivities] = useState<
    NewActivity[]
  >([]);

  // 선택된 데이터 저장할 상태
  const [selectedActivity, setSelectedActivity] = useState<
    Activity | NewActivity | null
  >(null);
  const [isBackModalOpen, setBackModalOpen] = useState(false);
  const [isSaveModalOpen, setSaveModalOpen] = useState(false);

  const { saveActivity, resetNewActivities } = useActivityStore();

  // 돌아가기
  const handleGoBack = () => {
    navigate(-1);
  };

  const handleBackModal = () => {
    setBackModalOpen(!isBackModalOpen);
  };

  const handleSaveModal = () => {
    setSaveModalOpen(!isSaveModalOpen);
  };

  const handleSaveActivities = async () => {
    await saveActivity(
      Number(pjtId),
      selectedOriginActivities,
      selectedNewActivities,
    );
    navigate('/activity');
  };

  useEffect(() => {
    return () => {
      resetNewActivities();
    };
  }, []);

  return (
    <>
      <div className={ActivityStyles.container}>
        <div className={ActivityStyles.backBtn} onClick={handleGoBack}>
          <img src={BackIcon} alt="돌아가기" />
          돌아가기
        </div>
        <div className={`${ActivityStyles.center} ${ActivityStyles.title}`}>
          경험 선택
        </div>
        <div className={styles.description}>
          선택되지 않은 경험은 삭제됩니다. (기존 경험 포함)
        </div>

        <section className={styles.list}>
          <ProjectActivityOrigin
            setSelectedActivity={setSelectedActivity}
            setSelectedOriginActivities={setSelectedOriginActivities}
          />
          <ProjectActivityNew
            setSelectedActivity={setSelectedActivity}
            setSelectedNewActivities={setSelectedNewActivities}
          />
          <ProjectActivityDetail activity={selectedActivity} />
        </section>
        <div className={ActivityStyles.center}>
          <button
            className={ActivityStyles.btn}
            onClick={() => setSaveModalOpen(true)}
          >
            저장
          </button>
        </div>
      </div>

      <Modal
        isOpen={isBackModalOpen}
        title={'이 페이지를 벗어나시겠어요?'}
        content={'생성된 경험이 사라집니다.'}
        onClose={handleBackModal}
        onConfirm={handleGoBack}
        confirmText={'이동'}
        cancleText={'취소'}
      />
      <Modal
        isOpen={isSaveModalOpen}
        title={'경험을 저장하시겠어요?'}
        content={'기존 경험 포함하여 선택하지 않은 모든 경험은 삭제됩니다.'}
        onClose={handleSaveModal}
        onConfirm={handleSaveActivities}
        confirmText={'확인'}
        cancleText={'취소'}
      />
    </>
  );
}

export default ProjectActivityExtract;
