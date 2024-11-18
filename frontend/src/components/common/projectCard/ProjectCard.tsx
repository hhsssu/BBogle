import MoreVertical from '../../../assets/image/icon/MoreVertical.svg';
import Bell from '../../../assets/image/icon/Bell.svg';
import ActiveBell from '../../../assets/image/icon/ActiveBell.svg';
import Pencil from '../../../assets/image/icon/Pencil.svg';
import RedTrash from '../../../assets/image/icon/RedTrash.svg';
import DefaultProject from '../../../assets/image/icon/DefaultProject.svg';

import style from './ProjectCard.module.css';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../modal/Modal';
import {
  changeNotificationStatus,
  deleteProject,
} from '../../../api/projectApi';
import ImageWithDefault from '../../my/ImageWithDefault';

interface Props {
  pjtId: number;
  imageSrc: string | null;
  title: string;
  status: boolean;
  term: string;
  description: string;
  notificationStatus: boolean;
}

function ProjectCard({
  pjtId,
  imageSrc,
  title,
  status,
  term,
  description,
  notificationStatus,
}: Props) {
  const navigate = useNavigate();
  const moreIconRef = useRef<HTMLImageElement>(null);

  const [isModalOpen, setModalOpen] = useState(false);
  const [isAlarmOn, setAlarmOn] = useState(notificationStatus);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isRequestPending, setRequestPending] = useState(false);

  const handleModalOpen = (e: React.MouseEvent) => {
    setModalOpen(!isModalOpen);
    e.stopPropagation();
  };

  const handleAlarmStatus = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isRequestPending) return;

    setRequestPending(true);

    await changeNotificationStatus(pjtId, !isAlarmOn);
    setAlarmOn(!isAlarmOn);

    setRequestPending(false);
  };

  const navPjtUpdate = (e: React.MouseEvent) => {
    navigate(`/project/${pjtId}/update`);
    e.stopPropagation();
  };

  const handleDeleteModal = () => {
    setModalOpen(false);
    setDeleteModalOpen(!isDeleteModalOpen);
  };

  const onDeleteProject = async () => {
    setDeleteModalOpen(!isDeleteModalOpen);

    await deleteProject(pjtId);
    navigate(0);
  };

  useEffect(() => {
    setAlarmOn(notificationStatus);
  }, [notificationStatus]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        moreIconRef.current &&
        !moreIconRef.current.contains(event.target as Node)
      ) {
        setModalOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className={style.card}>
        <section className={style.cardHeader}>
          <div className={style.img}>
            <ImageWithDefault
              src={imageSrc}
              alt="로고"
              defaultSrc={DefaultProject}
            />
          </div>

          <div>
            <div className={style.titleWrapper}>
              <span className={style.title}>
                {title.length > 7 ? title.substring(0, 8) + '...' : title}
              </span>
              <div
                className={`${style.status} ${status ? style.statusActive : style.statusInactive}`}
              >
                {status ? '진행 중' : '종료'}
              </div>
            </div>
            <div className={style.term}>{term}</div>
          </div>

          <div ref={moreIconRef}>
            <img
              className={`${style.moreIcon} ${isModalOpen && style.optionSelected}`}
              src={MoreVertical}
              alt="더보기"
              onClick={handleModalOpen}
            />
            {isModalOpen && (
              <div className={style.modalBox}>
                <div className={style.modalContent} onClick={navPjtUpdate}>
                  <img className={style.modalImg} src={Pencil} alt="수정" />
                  <p>수정</p>
                </div>
                <div
                  className={style.modalContent}
                  onClick={(e) => {
                    handleDeleteModal();
                    e.stopPropagation();
                  }}
                >
                  <img className={style.modalImg} src={RedTrash} alt="삭제" />
                  삭제
                </div>
              </div>
            )}
          </div>
        </section>

        <section className={style.cardContent}>
          <div className={style.description}>
            {description.length > 20
              ? description.substring(0, 21) + '...'
              : description}
          </div>
          {status &&
            (isAlarmOn ? (
              <img
                className={style.bellIcon}
                src={ActiveBell}
                alt="알림 아이콘"
                onClick={handleAlarmStatus}
              />
            ) : (
              <img
                className={style.bellIcon}
                src={Bell}
                alt="알림 아이콘"
                onClick={handleAlarmStatus}
              />
            ))}
        </section>
      </div>

      {isDeleteModalOpen && (
        <div onClick={(e) => e.stopPropagation()}>
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
      )}
    </div>
  );
}
export default ProjectCard;
