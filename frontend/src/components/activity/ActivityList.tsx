import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useActivityStore from '../../store/useActivityStore';

import ActivityCard from './ActivityCard';
import Loading from '../common/loading/Loading';
import ActivityStyles from './Activity.module.css';

import SearchIcon from '../../assets/image/icon/Search.svg';
import EmptyFolder from '../../assets/image/icon/EmptyFolder.svg';
import Bubble from '../../assets/lottie/Bubble.json';
import useActivityKeywordStore from '../../store/useActivityKeywordStore';
import useProjectStore from '../../store/useProjectStore';

function ActivityList() {
  const navigate = useNavigate();
  const activities = useActivityStore((state) => state.activities);
  const fetchActivities = useActivityStore((state) => state.fetchActivities);
  const isActivityLoading = useActivityStore(
    (state) => state.isActivityLoading,
  );
  const activityKeywords = useActivityKeywordStore(
    (state) => state.activityKeywords,
  );
  const fetchActivityKeywords = useActivityKeywordStore(
    (state) => state.fetchActivityKeywords,
  );
  const projectTitles = useProjectStore((state) => state.projectTitles);
  const getProjectTitles = useProjectStore((state) => state.getProjectTitles);
  const searchCriteria = useActivityStore((state) => state.searchCriteria);

  const [isHaveSearchWord, setIsHaveSearchWord] = useState(false);

  // 경험 수동 생성으로 이동
  const navActivityCreate = () => {
    navigate('create');
  };
  // 경험 상세 페이지로 이동
  const navDetail = (activityId: number) => {
    navigate(`${activityId}`);
  };

  // 경험
  useEffect(() => {
    fetchActivityKeywords();
    getProjectTitles();

    fetchActivities(
      searchCriteria.word,
      searchCriteria.keywords,
      searchCriteria.projects,
    );

    if (
      searchCriteria.word !== '' ||
      searchCriteria.keywords.length > 0 ||
      searchCriteria.projects.length > 0
    ) {
      setIsHaveSearchWord(true);
    } else {
      setIsHaveSearchWord(false);
    }
  }, []);

  const handleSearchPage = () => {
    navigate('search');
  };

  if (isActivityLoading) {
    return (
      <Loading
        isLoading={isActivityLoading}
        title="데이터 로딩 중 ..."
        animationData={Bubble}
      />
    );
  }

  return (
    <>
      <section className={ActivityStyles.between}>
        <div className={ActivityStyles.title}>나의 경험</div>
        <button className={ActivityStyles.btn} onClick={navActivityCreate}>
          + 경험 추가
        </button>
      </section>

      {/* 검색 버튼 - 클릭 시 검색 모달 OPEN */}
      <button onClick={handleSearchPage} className={ActivityStyles.search}>
        <img src={SearchIcon} alt="검색" />
        {!isHaveSearchWord ? (
          <span>키워드, 내용으로 검색</span>
        ) : (
          <div className={ActivityStyles.flexwrap}>
            <span className={ActivityStyles.searchword}>
              {searchCriteria.word}
            </span>
            {searchCriteria.keywords.length > 0
              ? searchCriteria.keywords.map((keywordId, idx) => {
                  const keyword = activityKeywords.find(
                    (activityKeyword) => activityKeyword.id === keywordId,
                  ); // 키워드 타입에 따라 다른 스타일 적용
                  if (keyword) {
                    const keywordClass =
                      keyword.type === false
                        ? ActivityStyles.bluekeyword
                        : ActivityStyles.yellowkeyword;
                    return (
                      <div key={idx} className={keywordClass}>
                        {keyword ? keyword.name : '알 수 없는 키워드'}
                      </div>
                    );
                  }
                })
              : null}
            {searchCriteria.projects.length > 0
              ? searchCriteria.projects.map((projectId, idx) => {
                  const pjt = projectTitles.find(
                    (project) => project.projectId === projectId,
                  );

                  // 프로젝트가 존재하지 않는 경우 null 반환
                  if (!pjt) return null;

                  return (
                    <div key={idx} className={ActivityStyles.projecttitle}>
                      {pjt.title}
                    </div>
                  );
                })
              : null}
            으로 검색한 결과입니다.
          </div>
        )}
      </button>

      <section className={ActivityStyles.list}>
        {Array.isArray(activities) && activities.length > 0 ? (
          activities.map((activityCard, index) => {
            if (activityCard.activityId === undefined) {
              return null;
            }
            return (
              <div key={index}>
                <ActivityCard
                  activityId={activityCard.activityId!}
                  title={activityCard.title}
                  startDate={new Date(activityCard.startDate)}
                  endDate={new Date(activityCard.endDate)}
                  projectId={activityCard.projectId}
                  projectTitle={activityCard.projectTitle ?? ''}
                  keywords={activityCard.keywords}
                  isExtract={false}
                  onClick={() => navDetail(activityCard.activityId!)}
                />
              </div>
            );
          })
        ) : (
          <>
            <div></div>
            <div className={ActivityStyles.nothing}>
              <img src={EmptyFolder} alt="비어있는 경험" />
              <p>만들어진 경험이 없어요.</p>
              <p className={ActivityStyles.semibold}>경험을 추가해 주세요!</p>
            </div>
          </>
        )}
      </section>
    </>
  );
}

export default ActivityList;
