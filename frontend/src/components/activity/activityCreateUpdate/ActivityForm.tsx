import { useEffect, useState } from 'react';

import useActivityKeywordStore from '../../../store/useActivityKeywordStore';
import useProjectStore from '../../../store/useProjectStore';
import useActivityStore from '../../../store/useActivityStore';

import ActivityStyles from '../Activity.module.css';
import ActivityCreateStyles from './ActivityCreate.module.css';

import BlueXIcon from '../../../assets/image/icon/BlueX.svg';
import YellowXIcon from '../../../assets/image/icon/YellowX.svg';

interface Props {
  title: string;
  content: string;
  startDate: Date;
  endDate: Date;
  projectId: number | undefined;
  keywords: { id: number; type: boolean; name: string }[];
}

// 경험 수동 생성 & 수정 폼 컴포넌트
function ActivityForm({
  title,
  content,
  startDate,
  endDate,
  projectId,
  keywords,
}: Props) {
  const updateActivityField = useActivityStore(
    (state) => state.updateActivityField,
  );

  // 폼 오류 설정하기
  const {
    titleError,
    setTitleError,
    contentError,
    setContentError,
    termError,
    setTermError,
    setErrMsgOn,
  } = useActivityStore();

  // 내 프로젝트 목록
  const projectList = useProjectStore((state) => state.projectList);
  // 프로젝트 가져오기 API
  const getProjectList = useProjectStore((state) => state.getProjectList);

  // 키워드 목록
  const activityKeywords = useActivityKeywordStore(
    (state) => state.activityKeywords,
  );
  // 키워드 가져오기 API
  const fetchActivityKeywords = useActivityKeywordStore(
    (state) => state.fetchActivityKeywords,
  );
  // 선택된 키워드
  const [selectedKeywords, setSelectedKeywords] = useState<number[]>(
    keywords.map((keyword) => keyword.id),
  );

  // ✅입력이 변경된 상태에서 페이지 이탈 시 경고 알림
  // 페이지를 떠나기 전에 경고 메시지 표시

  // ✅데이터 불러오기
  useEffect(() => {
    fetchActivityKeywords();
    getProjectList();
  }, []);

  // 🟢제목 오류
  const handleTitleError = (value: boolean) => {
    setTitleError(value);

    if (!titleError) {
      setErrMsgOn(false);
    }
  };

  // 🟢내용 오류
  const handleContentError = (value: boolean) => {
    setContentError(value);

    if (!contentError) {
      setErrMsgOn(false);
    }
  };

  // 🟢날짜 오류
  const handleTermError = (value: boolean) => {
    setTermError(value);

    if (!termError) {
      setErrMsgOn(false);
    }
  };

  // ✅제목 입력
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    updateActivityField('title', value);
    updateActivityField('keywords', selectedKeywords); // ID 값만 전달
    if (value !== '') {
      // 제목 값이 없을 때 오류 처리
      handleTitleError(false);
    }
  };

  // ✅내용 입력
  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const value = event.target.value;

    updateActivityField('content', value);
    updateActivityField('keywords', selectedKeywords); // ID 값만 전달
    if (content !== '') {
      // 내용 값이 없을 때 오류 처리
      handleContentError(false);
    }
  };

  // ✅내용 700자 제한
  function handleTextareaChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const maxLength = 700;
    if (event.target.value.length > maxLength) {
      event.target.value = event.target.value.slice(0, maxLength);
    }
  }

  // ✅시작 날짜 입력
  const handleStartDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    updateActivityField('startDate', value);
    // 시작 날짜가 종료 날짜보다 이후일 때 오류 처리
    handleTermError(false);
    updateActivityField('keywords', selectedKeywords); // ID 값만 전달
  };

  // ✅종료 날짜 입력
  const handleEndDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    updateActivityField('endDate', value);
    // 시작 날짜가 종료 날짜보다 이후일 때 오류 처리
    handleTermError(false);
    updateActivityField('keywords', selectedKeywords); // ID 값만 전달
  };

  // ✅키워드 선택
  const handleSelectKeyword = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedKeyword = activityKeywords.find(
      (keyword) => keyword.name === event.target.value,
    );

    if (
      selectedKeyword &&
      !selectedKeywords.includes(selectedKeyword.id) // ID 중복 체크
    ) {
      if (selectedKeywords.length < 3) {
        const updatedKeywords = [...selectedKeywords, selectedKeyword.id];
        setSelectedKeywords(updatedKeywords);
        updateActivityField('keywords', updatedKeywords); // ID 값만 전달
      } else {
        alert('키워드는 최대 3개까지 선택 가능합니다.');
      }
    }
  };

  // ✅키워드 삭제
  const deleteKeyword = (keywordId: number) => {
    const updatedKeywords = selectedKeywords.filter((id) => id !== keywordId);
    setSelectedKeywords(updatedKeywords);
    updateActivityField('keywords', updatedKeywords); // ID 값만 전달
  };

  // ✅프로젝트 ID & Title
  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value); // 숫자로 변환
    updateActivityField('projectId', value);
    updateActivityField('keywords', selectedKeywords); // ID 값만 전달
  };

  return (
    // 수정 / 작성하는 부분
    <section className={ActivityCreateStyles.container}>
      {/* 제목 */}
      <div className={ActivityStyles.flex}>
        <p className={ActivityStyles.semibold}>제목</p>
        <span className={`${ActivityStyles.orange} ${ActivityStyles.semibold}`}>
          *
        </span>
      </div>
      <input
        type="text"
        maxLength={20}
        placeholder="제목을 입력하세요 (최대 20자)"
        value={title}
        onChange={handleTitleChange}
        className={ActivityCreateStyles.subtitle}
      />

      {/* 내용 */}
      <div className={ActivityStyles.flex}>
        <p className={ActivityStyles.semibold}>내용</p>
        <span className={`${ActivityStyles.orange} ${ActivityStyles.semibold}`}>
          *
        </span>
      </div>
      <textarea
        name="content"
        rows={10}
        placeholder="내용을 입력하세요 (최대 700자)"
        value={content}
        onChange={handleContentChange}
        className={ActivityCreateStyles.content}
        onInput={handleTextareaChange}
      />

      {/* TODO 프로젝트 작성과 디자인 통일하기 */}
      {/* 시작일 ~ 종료일 */}
      <div className={ActivityStyles.flex}>
        <p className={ActivityStyles.semibold}>경험 기간</p>
        <span className={`${ActivityStyles.orange} ${ActivityStyles.semibold}`}>
          *
        </span>
      </div>
      <div className={ActivityStyles.flex}>
        <div className={ActivityCreateStyles.margin}>
          <p className={ActivityCreateStyles.datedes}>시작일</p>
          <input
            type="date"
            max={
              endDate instanceof Date
                ? endDate.toISOString().split('T')[0]
                : endDate
            }
            value={
              startDate instanceof Date
                ? startDate.toISOString().split('T')[0]
                : startDate
            }
            onChange={handleStartDate}
            className={ActivityCreateStyles.graybox}
          />
        </div>
        <div>
          <p className={ActivityCreateStyles.datedes}>종료일</p>
          <input
            type="date"
            min={
              startDate instanceof Date
                ? startDate.toISOString().split('T')[0]
                : startDate
            }
            value={
              endDate instanceof Date
                ? endDate.toISOString().split('T')[0]
                : endDate
            }
            onChange={handleEndDate}
            className={ActivityCreateStyles.graybox}
          />
        </div>
      </div>
      {termError && (
        <span className={ActivityCreateStyles.error}>
          프로젝트 기간을 확인해주세요(미입력/입력오류)
        </span>
      )}

      {/* 경험 키워드 */}
      <p className={ActivityStyles.semibold}>관련 키워드</p>
      <div className={ActivityStyles.flex}>
        <select
          name="keywords"
          id="keywords"
          defaultValue=""
          onChange={handleSelectKeyword}
          className={ActivityCreateStyles.graybox}
        >
          <option value="" disabled>
            키워드를 선택하세요
          </option>
          <optgroup label="기술 키워드">
            {activityKeywords
              .filter((keyword) => !keyword.type)
              .map((keyword) => (
                <option value={keyword.name} key={keyword.name}>
                  {keyword.name}
                </option>
              ))}
          </optgroup>
          <optgroup label="인성 키워드">
            {activityKeywords
              .filter((keyword) => keyword.type)
              .map((keyword) => (
                <option value={keyword.name} key={keyword.name}>
                  {keyword.name}
                </option>
              ))}
          </optgroup>
        </select>
        {/* 선택한 키워드 */}
        <div className={ActivityStyles.flex}>
          {selectedKeywords.map((id) => {
            const keyword = activityKeywords.find(
              (keyword) => keyword.id === id,
            );
            return keyword ? (
              <div
                key={id}
                className={
                  !keyword.type
                    ? ActivityCreateStyles.bluekeyword
                    : ActivityCreateStyles.yellowkeyword
                }
              >
                {keyword.name}
                <img
                  src={!keyword.type ? BlueXIcon : YellowXIcon}
                  alt="키워드 삭제"
                  onClick={() => deleteKeyword(id)}
                  style={{ cursor: 'pointer', marginLeft: '5px' }}
                />
              </div>
            ) : null;
          })}
        </div>
      </div>

      {/* 관련 프로젝트 */}
      <p className={ActivityStyles.semibold}>관련 프로젝트</p>
      <select
        name="projects"
        id="projects"
        value={projectId ?? ''}
        onChange={handleProjectChange}
        className={ActivityCreateStyles.graybox}
      >
        <option value={''}>선택 안함</option>
        {projectList.map((option) => (
          <option value={option.projectId} key={option.projectId}>
            {option.title}
          </option>
        ))}
      </select>
    </section>
  );
}

export default ActivityForm;
