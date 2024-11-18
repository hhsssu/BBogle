import style from './ProjectDetail.module.css';

import Back from '../../../assets/image/icon/Back.svg';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useProjectStore from '../../../store/useProjectStore';

import ProjectInfoSection from './projectInfoSection/ProjectInfoSection';
import ProjectLogSection from './projectLogSection/ProjectLogSection';
import Modal from '../../common/modal/Modal';
import { finishProject } from '../../../api/projectApi';
import useDiaryStore from '../../../store/useDiaryStore';

function ProjectDetail() {
  const project = useProjectStore((state) => state.project);
  const diaryCnt = useDiaryStore((state) => state.diaryList.length);

  const navigate = useNavigate();

  const [isLessModalOpen, setLessModalOpen] = useState(false);
  const [isFinModalOpen, setFinModalOpen] = useState(false);

  const navPjtList = () => {
    navigate('/project');
  };

  const handleLessModal = () => {
    setLessModalOpen(!isLessModalOpen);
  };

  const handleFinModal = () => {
    if (diaryCnt < 3) {
      setLessModalOpen(true);
      return;
    }
    setFinModalOpen(!isFinModalOpen);
  };

  const onFinishProject = async () => {
    setFinModalOpen(false);

    await finishProject(project.projectId);
    navigate(0);
  };

  return (
    <div className={style.container}>
      <div>
        <div className={style.backBtn} onClick={navPjtList}>
          <img src={Back} alt="뒤로가기 버튼" />
          프로젝트 목록
        </div>

        <div className={style.pjtInfoSection}>
          <ProjectInfoSection />

          {project.status && (
            <button className={style.pjtEndBtn} onClick={handleFinModal}>
              프로젝트 종료
            </button>
          )}
        </div>
      </div>

      <ProjectLogSection />

      {isLessModalOpen && (
        <div className={style.overlay} onClick={handleLessModal}>
          <div
            className={style.modalContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className={style.title}>{'개발일지가 너무 적어요'}</h2>
            <p className={style.content}>{'3개 이상 작성해주세요!'}</p>
            <div className={style.actions}>
              <button className={style.confirm} onClick={handleLessModal}>
                {'확인'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={isFinModalOpen}
        title={'프로젝트를 종료하시겠어요?'}
        content={
          '종료하면 개발일지를 작성할 수 없어요.\n 5개 이상 작성하면 더 나은 회고록을 제공해드려요.'
        }
        onClose={handleFinModal}
        onConfirm={onFinishProject}
        confirmText={'종료'}
        cancleText={'취소'}
      />
    </div>
  );
}

export default ProjectDetail;
