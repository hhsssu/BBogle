import style from '../DiaryCreateUpdate.module.css';

import Bubble from '../../../../assets/lottie/Bubble.json';
import AlertTriangle from '../../../../assets/image/icon/AlertTriangle.svg';
import Back from '../../../../assets/image/icon/Back.svg';
import DiaryForm from '../diaryForm/DiaryForm';

import useDiaryStore from '../../../../store/useDiaryStore';

import { useNavigate, useParams } from 'react-router-dom';
import { ChangeEvent, useEffect, useState } from 'react';
import Modal from '../../../common/modal/Modal';
import { patchDiary } from '../../../../api/diaryApi';
import Loading from '../../../common/loading/Loading';

function DiaryUpdate() {
  const navigate = useNavigate();
  const { pjtId, diaryId } = useParams();

  const {
    isLoading,
    title,
    answerList,
    imageList,
    getDiaryDetail,
    updateTitle,
  } = useDiaryStore();

  const [titleErr, setTitleErr] = useState(false);
  const [textLengthErr, setTextLengthErr] = useState(true);
  const [errMsgOn, setErrMsgOn] = useState(false);

  const [isBackModalOpen, setBackModalOpen] = useState(false);

  const navDiaryDetail = () => {
    navigate(`/project/${pjtId}/diary/${diaryId}`);
  };

  const handleBackModal = () => {
    setBackModalOpen(!isBackModalOpen);
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    updateTitle(value);

    if (value.length === 0) {
      setTitleErr(true);
    } else {
      setTitleErr(false);
      setErrMsgOn(false);
    }
  };

  const updateDiary = async () => {
    if (titleErr || textLengthErr) {
      setErrMsgOn(true);
    } else {
      setTextLengthErr(true);
      setErrMsgOn(false);

      await patchDiary(Number(pjtId), Number(diaryId), {
        title: title,
        answers: answerList,
        images: imageList,
      });

      alert('개발일지 수정 완료!');
      navigate(`/project/${pjtId}/diary/${diaryId}`);
    }
  };

  const checkTotalLength = () => {
    let totalTextLength = 0;
    answerList.map((answer) => (totalTextLength += answer.length));

    if (totalTextLength >= 50) {
      setTextLengthErr(false);
      setErrMsgOn(false);
    } else {
      setTextLengthErr(true);
    }
  };

  useEffect(() => {
    checkTotalLength();
    setTitleErr(false);
  }, [answerList]);

  useEffect(() => {
    getDiaryDetail(Number(pjtId), Number(diaryId));
  }, []);

  if (isLoading) {
    return (
      <Loading
        isLoading={isLoading}
        title="데이터 로딩 중 ..."
        animationData={Bubble}
      />
    );
  }

  return (
    <div className={style.container}>
      <div className={style.backBtn} onClick={handleBackModal}>
        <img src={Back} alt="뒤로가기 버튼" />
        돌아가기
      </div>

      <div className={style.titleContainer}>
        <input
          className={`${style.diaryTitle} ${style.diaryInput}`}
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          maxLength={30}
          onChange={handleTitleChange}
        />
        {titleErr && (
          <div className={style.titleErrMsg}>
            <img className={style.warnIcon} src={AlertTriangle} alt="경고" />
            <span>제목은 필수 입력 값입니다.</span>{' '}
          </div>
        )}
      </div>

      <DiaryForm />

      <button
        className={`${style.submitBtn} ${(titleErr || textLengthErr) && style.failBtn}`}
        onClick={updateDiary}
      >
        완료
      </button>
      {errMsgOn && (
        <div className={style.errMsg}>
          <img className={style.warnIcon} src={AlertTriangle} alt="경고" />
          제목을 작성하지 않았거나, 답변 길이가 너무 짧습니다! 50자 이상
          작성해주세요{' '}
        </div>
      )}

      <Modal
        isOpen={isBackModalOpen}
        title={'이 페이지를 벗어나시겠어요?'}
        content={'작성 내용이 초기화됩니다.'}
        onClose={handleBackModal}
        onConfirm={navDiaryDetail}
        confirmText={'이동'}
        cancleText={'취소'}
      />
    </div>
  );
}

export default DiaryUpdate;
