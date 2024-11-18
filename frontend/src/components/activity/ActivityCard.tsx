import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Modal from '../common/modal/Modal';
import { deleteActivity } from '../../api/activityApi';

import ActivityStyles from './Activity.module.css';

import MoreIcon from '../../assets/image/icon/More.svg';
import DetailIcon from '../../assets/image/icon/Detail.svg';
import Pencil from '../../assets/image/icon/Pencil.svg';
import RedTrash from '../../assets/image/icon/RedTrash.svg';

interface Keyword {
  id: number;
  type: boolean;
  name: string;
}

interface ActivityInfoProps {
  activityId?: number | undefined;
  title: string;
  startDate: Date;
  endDate: Date;
  projectId?: number;
  projectTitle?: string | undefined;
  keywords: Keyword[];
  isExtract: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  onPreviewClick?: (activityId: number) => void;
}

// 경험 카드
function ActivityCard({
  activityId,
  title,
  startDate,
  endDate,
  keywords,
  projectTitle,
  isExtract,
  isSelected,
  onClick,
  onPreviewClick,
}: ActivityInfoProps) {
  const navigate = useNavigate();

  const moreIconRef = useRef<HTMLButtonElement>(null);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  // TODO 경험 추출에서 선택 시 미리보기에 값 전달

  // 경험 추출 선택 페이지에서의 경험 카드
  const handleDetail = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPreviewClick && activityId !== undefined) {
      onPreviewClick(activityId);
    }
  };

  // 경험 목록 페이지에서의 경험 카드
  const handleMenuOpen = (e: React.MouseEvent) => {
    setMenuOpen(!isMenuOpen);
    e.stopPropagation();
  };

  // 경험 삭제 모달
  const handleDeleteModal = () => {
    setDeleteModalOpen(!isDeleteModalOpen);
  };

  // 삭제
  const handleDeleteActivity = async () => {
    setDeleteModalOpen(!isDeleteModalOpen);

    if (activityId) {
      await deleteActivity(activityId);
    }

    navigate(0);
  };

  // 경험 수정 페이지로 이동
  const navActivityUpdate = () => {
    navigate(`/activity/update/${activityId}`);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        moreIconRef.current &&
        !moreIconRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      className={
        isSelected
          ? `${ActivityStyles.card} ${ActivityStyles.selected}`
          : `${ActivityStyles.card} `
      }
      onClick={onClick}
    >
      {/* 소제목과 더보기 메뉴 버튼 */}
      <div className={ActivityStyles.header}>
        <section className={ActivityStyles.between}>
          <div className={ActivityStyles.subtitle}>{title}</div>
          <button ref={moreIconRef} className={ActivityStyles.relative}>
            {isExtract ? (
              <img
                src={DetailIcon}
                alt="미리보기 버튼"
                onClick={handleDetail}
              />
            ) : (
              <img
                src={MoreIcon}
                alt="더 보기 메뉴"
                onClick={handleMenuOpen}
                className={`${isMenuOpen && ActivityStyles.optionSelected}`}
              />
            )}
            {isMenuOpen && (
              <div className={ActivityStyles.modalBox}>
                <div
                  className={ActivityStyles.modalContent}
                  onClick={navActivityUpdate}
                >
                  <img
                    className={ActivityStyles.modalImg}
                    src={Pencil}
                    alt="수정"
                  />
                  <p>수정</p>
                </div>
                <div
                  className={ActivityStyles.modalContent}
                  onClick={(e) => {
                    handleDeleteModal();
                    e.stopPropagation();
                  }}
                >
                  <img
                    className={ActivityStyles.modalImg}
                    src={RedTrash}
                    alt="삭제"
                  />
                  삭제
                </div>
              </div>
            )}
          </button>
        </section>
        {/* 시작일 ~ 종료일 */}
        {startDate && endDate ? (
          <div className={ActivityStyles.date}>
            {startDate.toLocaleDateString()} ~ {endDate.toLocaleDateString()}
          </div>
        ) : (
          ''
        )}
      </div>

      {/* 프로젝트 명 & 태그 */}
      <div className={ActivityStyles.footer}>
        {/* 관련 프로젝트 명 */}
        <div className={ActivityStyles.project}>{projectTitle}</div>

        {/* 경험 태그 */}
        <section className={ActivityStyles.keywords}>
          {keywords.map((keyword, index) => (
            <div key={index}>
              {/* 기술태그 0 blue / 인성태그 1 yellow */}
              {!keyword.type ? (
                <span className={ActivityStyles.bluekeyword}>
                  {keyword.name}
                </span>
              ) : (
                <span className={ActivityStyles.yellowkeyword}>
                  {keyword.name}
                </span>
              )}
            </div>
          ))}
        </section>
      </div>
      {isDeleteModalOpen && (
        <div onClick={(e) => e.stopPropagation()}>
          <Modal
            isOpen={isDeleteModalOpen}
            title={`정말 ${title} 경험을 삭제하시겠어요?`}
            content={'삭제 시 복구가 어려워요'}
            onClose={handleDeleteModal}
            onConfirm={handleDeleteActivity}
            confirmText={'확인'}
            cancleText={'취소'}
          />
        </div>
      )}
    </div>
  );
}

export default ActivityCard;
