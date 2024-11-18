import style from './My.module.css';

// 이미지 파일
import EditIcon from '../../assets/image/icon/Edit.svg';
import Empty from '../../assets/image/default/Diary.png';
import EnterIcon from '../../assets/image/icon/Enter.svg';
import DefaultImage from '../../assets/image/default/Profile.svg';

import ImageWithDefault from './ImageWithDefault';
import GoToDiary from '../common/button/GoToDiary';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../store/useUserStore';
import { useEffect, useState } from 'react';
import ProfileImageUploader from './ProfileImageUploader';
import { fetchTodayDiary } from '../../api/diaryApi';
import DiaryCard from '../common/diaryCard/DiaryCard';
import HorizontalScroll from '../common/scroll/HorizontalScroll';

// 타입 정의
interface DiaryItem {
  projectId: number;
  diaryId: number;
  title: string;
  createDate: string;
  projectTitle: string;
}

function My() {
  const navigate = useNavigate();
  const {
    user,
    isEditingNickname,
    setEditNickname,
    updateNickname,
    fetchUser,
  } = useUserStore();
  const [newNickname, setNewNickname] = useState(user?.nickname || '');
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가
  const [diaryList, setDiaryList] = useState<DiaryItem[]>([]);

  useEffect(() => {
    const fetchDiaries = async () => {
      const todayDiary = await fetchTodayDiary();
      if (todayDiary) setDiaryList(todayDiary);
    };

    fetchUser();
    fetchDiaries();
  }, [fetchUser]);

  // 카드 선택 시 프로젝트 페이지로 이동하는 함수
  const selectCard = (projectId: number, diaryId: number) => {
    navigate(`/project/${projectId}/diary/${diaryId}`);
  };

  // 닉네임 업데이트 함수
  const handleUpdate = () => {
    updateNickname(newNickname);
  };

  // 엔터 입력 시 닉네임 업데이트
  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleUpdate();
    }
  };

  // 이미지 클릭 시 모달 열기
  const openModal = () => {
    setIsModalOpen(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={style.container}>
      <div className={style.infoContainer}>
        <div>
          <ImageWithDefault
            src={user?.profileImage}
            alt="프로필"
            defaultSrc={DefaultImage}
            onClick={openModal}
          ></ImageWithDefault>
        </div>
        <div className={style.detailInfo}>
          {!isEditingNickname ? (
            <div className={style.greeting}>
              <div className={style.name}>
                안녕하세요, <span>{user?.nickname || '-'}</span>님
              </div>
              <img
                className={style.editIcon}
                src={EditIcon}
                alt="편집"
                onClick={setEditNickname}
              />
            </div>
          ) : (
            <div className={style.edit}>
              <div className={style.editDesc}>닉네임 입력</div>
              <div>
                <input
                  className={style.editInput}
                  type="text"
                  placeholder="최대 8자"
                  value={newNickname}
                  onChange={(e) => setNewNickname(e.target.value)}
                  onKeyDown={handleEnter}
                  maxLength={8}
                />
                <img src={EnterIcon} alt="등록" onClick={handleUpdate} />
              </div>
            </div>
          )}
          <div className={style.cheer}>
            오늘도 뽀글이 옆에서 응원하고 있어요 !
          </div>
          <div className={style.email}>{user?.email || '-'}</div>
        </div>
      </div>

      {isModalOpen && (
        <div className={style.modalOverlay} onClick={closeModal}>
          <div
            className={style.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <ProfileImageUploader
              initialImage={user?.profileImage || null}
              onComplete={closeModal}
            />
          </div>
        </div>
      )}

      <div className={style.todayDiary}>
        <div className={style.title}>
          오늘 내가 작성한 <span className={style.highlight}>개발 일지</span>
        </div>
        <div className={style.pjtList}>
          {diaryList.length > 0 ? (
            <HorizontalScroll
              children={diaryList.map((card, index) => (
                <div
                  key={index}
                  onClick={() => selectCard(card.projectId, card.diaryId)}
                >
                  <DiaryCard
                    key={index}
                    diaryId={card.diaryId}
                    title={card.title}
                    date={card.createDate}
                  />
                </div>
              ))}
            />
          ) : (
            <div className={style.empty}>
              <div className={style.guide}>
                <img src={Empty} alt="empty" />
                <div className={style.message}>
                  <div>오늘 작성한 개발 일지가 없어요</div>
                  <div>지금 바로 작성하러 갈까요 ?</div>
                </div>
              </div>
              <div className={style.button}>
                <GoToDiary
                  isInactive={false}
                  onClick={() => navigate('/project')}
                ></GoToDiary>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* <AlarmPermissinon /> */}
    </div>
  );
}

export default My;
