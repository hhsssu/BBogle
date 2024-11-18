import style from './ProjectInfoSection.module.css';

import Bubble from '../../../../assets/lottie/Bubble.json';
import Setting from '../../../../assets/image/icon/Setting.svg';
import Pencil from '../../../../assets/image/icon/Pencil.svg';
import RedTrash from '../../../../assets/image/icon/RedTrash.svg';
import DefaultProject from '../../../../assets/image/icon/DefaultProject.svg';

import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useProjectStore from '../../../../store/useProjectStore';
import { deleteProject } from '../../../../api/projectApi';
import ImageWithDefault from '../../../my/ImageWithDefault';
import Modal from '../../../common/modal/Modal';
import Loading from '../../../common/loading/Loading';
import useSummaryStore from '../../../../store/useSummaryStore';

function ProjectInfoSection() {
  const { pjtId } = useParams();
  const PROJECT = useProjectStore((state) => state.project);
  const getProject = useProjectStore((state) => state.getProject);
  const isProjectLoading = useProjectStore((state) => state.isProjectLoading);
  const { isSummaryLoading } = useSummaryStore();

  const settingIconRef = useRef<HTMLImageElement>(null);

  const [isClamped, setClamped] = useState(false);
  const [isExpandOpen, setExpandOpen] = useState(false);

  const [isModalOpen, setModalOpen] = useState(false);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const navigate = useNavigate();

  const calculateLineCountFromNewlines = (text: string) => {
    const lines = text.split('\n'); // 줄바꿈 문자 기준으로 나누기

    setClamped(lines.length > 3);
  };

  const handleModalOpen = () => {
    setModalOpen(!isModalOpen);
  };

  const handleDeleteModal = () => {
    setDeleteModalOpen(!isDeleteModalOpen);
  };

  const navProjectUpdate = () => {
    setModalOpen(false);
    navigate(`update`);
  };

  const handleExpand = () => {
    setExpandOpen(!isExpandOpen);
  };

  const onDeleteProject = async () => {
    setDeleteModalOpen(!isDeleteModalOpen);

    await deleteProject(Number(pjtId));
    navigate('/project');
  };

  useEffect(() => {
    getProject(Number(pjtId));
    setExpandOpen(false);
  }, [getProject, pjtId]);

  useEffect(() => {
    if (PROJECT.description) {
      calculateLineCountFromNewlines(PROJECT.description);
    }
  }, [PROJECT.description]); // description이 변경될 때만 실행

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        settingIconRef.current &&
        !settingIconRef.current.contains(event.target as Node)
      ) {
        setModalOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (isProjectLoading) {
    return (
      <Loading
        isLoading={isProjectLoading}
        title="데이터 로딩 중 ..."
        animationData={Bubble}
      />
    );
  }

  if (isSummaryLoading) {
    return (
      <Loading
        isLoading={isSummaryLoading}
        title="데이터 로딩 중 ..."
        animationData={Bubble}
      />
    );
  }

  return (
    <div className={style.container}>
      <div className={style.infoHeader}>
        <div className={style.pjtTitleContainer}>
          <div className={style.img}>
            <ImageWithDefault
              src={PROJECT.image}
              alt="로고"
              defaultSrc={DefaultProject}
            />
          </div>

          <span className={style.title}>{PROJECT.title}</span>
          <div ref={settingIconRef} className={style.settingBox}>
            <img
              className={style.setting}
              src={Setting}
              alt="설정"
              onClick={handleModalOpen}
            />
            <div
              className={`${style.status} ${PROJECT.status ? style.statusActive : style.statusInActive}`}
            >
              {PROJECT.status ? '진행 중' : '종료'}
            </div>
            {isModalOpen && (
              <div className={style.modalBox}>
                <div className={style.modalContent} onClick={navProjectUpdate}>
                  <img className={style.modalImg} src={Pencil} alt="수정" />
                  <p>수정</p>
                </div>
                <div className={style.modalContent} onClick={handleDeleteModal}>
                  <img className={style.modalImg} src={RedTrash} alt="삭제" />
                  삭제
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className={`${style.description} ${!isExpandOpen && style.descriptionUnexpand}`}
      >
        {PROJECT.description}
      </div>
      {isClamped && (
        <p className={style.expandBtn} onClick={handleExpand}>
          {isExpandOpen ? '접기' : '더보기'}
        </p>
      )}
      <div className={style.term}>
        {PROJECT.startDate} ~ {PROJECT.endDate} / {PROJECT.memberCount} 명
      </div>

      <div className={style.tagList}>
        <span className={style.tagLabel}>나의 역할</span>
        <div className={style.tagSection}>
          {PROJECT.role.map((role, index) => (
            <div key={index} className={style.tag}>
              {role}
            </div>
          ))}
        </div>
      </div>

      <div className={style.tagList}>
        <span className={style.tagLabel}>사용 기술</span>
        <div className={style.tagSection}>
          {PROJECT.skill.map((skill, index) => (
            <div key={index} className={style.tag}>
              {skill}
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        title={'정말 프로젝트를 삭제하시겠어요?'}
        content={'삭제 시 복구가 어려워요'}
        onClose={handleDeleteModal}
        onConfirm={onDeleteProject}
        confirmText={'확인'}
        cancleText={'취소'}
      />
    </div>
  );
}

export default ProjectInfoSection;
