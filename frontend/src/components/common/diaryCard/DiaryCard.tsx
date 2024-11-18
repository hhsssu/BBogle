import style from './DiaryCard.module.css';

import MoreVertical from '../../../assets/image/icon/MoreVertical.svg';
import Pencil from '../../../assets/image/icon/Pencil.svg';
import RedTrash from '../../../assets/image/icon/RedTrash.svg';

import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Modal from '../modal/Modal';
import { deleteDiary } from '../../../api/diaryApi';

interface Props {
  diaryId: number;
  title: string;
  date: string;
}

function DiaryCard({ diaryId, title, date }: Props) {
  const { pjtId } = useParams();
  const navigate = useNavigate();
  const moreIconRef = useRef<HTMLImageElement>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleModalOpen = () => {
    setModalOpen(!isModalOpen);
  };

  const navDiaryUpdate = () => {
    navigate(`diary/${diaryId}/update`);
  };

  const handleDeleteModal = () => {
    setModalOpen(false);
    setDeleteModalOpen(!isDeleteModalOpen);
  };

  const onDeleteDiary = async () => {
    await deleteDiary(Number(pjtId), diaryId);
    setDeleteModalOpen(!isDeleteModalOpen);
    navigate(0);
  };

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
        <section className={style.cardContents}>
          <span className={style.title}>{title}</span>
          <div className={style.date}>{date}</div>
        </section>
        <div
          ref={moreIconRef}
          className={`${style.moreIconContainer} ${isModalOpen && style.selected}`}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            className={style.moreIcon}
            src={MoreVertical}
            alt="더보기"
            onClick={handleModalOpen}
          />
          {isModalOpen && (
            <div className={style.modalBox}>
              <div className={style.modalContent} onClick={navDiaryUpdate}>
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

      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          title={'정말 개발일지를 삭제하시겠어요?'}
          content={'삭제 시 복구가 어려워요'}
          onClose={handleDeleteModal}
          onConfirm={onDeleteDiary}
          confirmText={'확인'}
          cancleText={'취소'}
        />
      )}
    </div>
  );
}

export default DiaryCard;
