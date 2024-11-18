import style from '../DiaryCreateUpdate.module.css';

import Bubble from '../../../../assets/lottie/Bubble.json';
import AlertTriangle from '../../../../assets/image/icon/AlertTriangle.svg';
import Back from '../../../../assets/image/icon/Back.svg';

import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import useProjectStore from '../../../../store/useProjectStore';

import Loading from '../../../common/loading/Loading';
import DiaryForm from '../diaryForm/DiaryForm';
import useDiaryStore from '../../../../store/useDiaryStore';
import Modal from '../../../common/modal/Modal';
import { addDiary } from '../../../../api/diaryApi';

import { getDiaryTitle } from '../../../../api/diaryApi';

function DiaryCreate() {
  const navigate = useNavigate();

  const isLoading = useDiaryStore((state) => state.isLoading);

  const { pjtId } = useParams();

  const { project, getProject } = useProjectStore();
  const questionList = useDiaryStore((state) => state.questionList);
  const { title, answerList, imageList, initDiary, updateTitle } =
    useDiaryStore();

  const [textLengthErr, setTextLengthErr] = useState(true);
  const [errMsgOn, setErrMsgOn] = useState(false);

  const [isBackModalOpen, setBackModalOpen] = useState(false);
  const [isFinLoadingOpen, setFinLoadingOpen] = useState(false);
  const [isTitleModalOpen, setTitleModalOpen] = useState(false);

  const [isTitleEmpty, setTitleEmpty] = useState(false);

  const navPjtDetail = () => {
    navigate(`/project/${project.projectId}`);
  };

  const handleBackModal = () => {
    setBackModalOpen(!isBackModalOpen);
  };

  const submitDiaryForm = async () => {
    if (textLengthErr) {
      setErrMsgOn(true);
    } else {
      setFinLoadingOpen(true);

      const title = await getDiaryTitle(questionList, answerList);

      setErrMsgOn(false);
      updateTitle(title);

      setFinLoadingOpen(false);
      setTitleModalOpen(true);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setTitleEmpty(false);
    updateTitle(value);
  };

  const onClose = () => {
    setTitleModalOpen(false);
  };

  const onAddDiary = async () => {
    if (title === '') {
      setTitleEmpty(true);
      return;
    }

    await addDiary(project.projectId, {
      title: title,
      answers: answerList,
      images: imageList,
    });
    setTextLengthErr(true);
    alert('개발일지 저장 완료');
    navigate(`/project/${project.projectId}`);
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
  }, [answerList]);

  useEffect(() => {
    setTitleEmpty(false);
    initDiary();
    getProject(Number(pjtId));
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
        {project.title}
      </div>
      <div className={style.diaryTitle}>오늘의 {project.title}</div>
      <DiaryForm />
      <button
        className={`${style.submitBtn} ${textLengthErr && style.failBtn}`}
        onClick={submitDiaryForm}
      >
        완료
      </button>
      {errMsgOn && (
        <div className={style.errMsg}>
          <img className={style.warnIcon} src={AlertTriangle} alt="경고" />
          답변 길이가 너무 짧습니다! 50자 이상 작성해주세요{' '}
        </div>
      )}
      <Modal
        isOpen={isBackModalOpen}
        title={'이 페이지를 벗어나시겠어요?'}
        content={'작성 내용이 초기화됩니다.'}
        onClose={handleBackModal}
        onConfirm={navPjtDetail}
        confirmText={'이동'}
        cancleText={'취소'}
      />
      <Loading
        isLoading={isFinLoadingOpen}
        title="개발일지 작성 중 ..."
        animationData={Bubble}
      />

      {/* AI 생성 제목 확인 모달 */}

      {isTitleModalOpen && (
        <div className={style.overlay}>
          <div
            className={style.titleModalContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className={style.title}>개발일지 작성이 완료되었습니다!</h2>
            <p className={`${style.content}`}>생성된 제목을 확인해주세요.</p>
            {isTitleEmpty && (
              <p className={style.titleEmpty}>제목을 입력해주세요</p>
            )}
            <input
              className={`${style.titleInput} ${isTitleEmpty && style.errorInput}`}
              value={title}
              maxLength={50}
              onChange={handleTitleChange}
            />
            <div className={style.actions}>
              <button className={style.cancle} onClick={onClose}>
                취소
              </button>
              <button className={style.confirm} onClick={onAddDiary}>
                개발일지 저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DiaryCreate;
