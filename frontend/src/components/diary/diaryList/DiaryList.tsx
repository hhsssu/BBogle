import style from './DiaryList.module.css';

import EmptyDiary from '../../../assets/image/icon/EmptyDiary.svg';

import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';

import DiaryCard from '../../common/diaryCard/DiaryCard';
import useDiaryStore from '../../../store/useDiaryStore';

function DiaryList() {
  const { pjtId } = useParams();

  const navigate = useNavigate();

  const diaryList = useDiaryStore((state) => state.diaryList);
  const getDiaryList = useDiaryStore((state) => state.getDiaryList);

  const sortIdx = useDiaryStore((state) => state.sortIdx);

  const navDiaryDetail = (diaryID: number) => {
    navigate(`diary/${diaryID}`);
  };

  useEffect(() => {
    getDiaryList(Number(pjtId));
  }, [getDiaryList, pjtId]);

  return (
    <div className={style.container}>
      {diaryList.length !== 0 ? (
        <div className={style.diaryGrid}>
          {(sortIdx === 0 ? diaryList.slice().reverse() : diaryList).map(
            (card, index) => (
              <div
                key={index}
                onClick={() => navDiaryDetail(Number(card.diaryId))}
              >
                <DiaryCard
                  diaryId={Number(card.diaryId)}
                  title={card.title}
                  date={card.createDate}
                />
              </div>
            ),
          )}
        </div>
      ) : (
        <div className={style.emptyDiaryContainer}>
          <img
            className={style.emptyIcon}
            src={EmptyDiary}
            alt="개발일지 없음"
          />
          <div className={style.emptyTextBox}>
            <p>작성한 개발일지가 없어요.</p>
            <p className={style.boldText}>지금 바로 작성하러 갈까요?</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DiaryList;
