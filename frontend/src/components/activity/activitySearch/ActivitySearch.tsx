import style from './ActivitySearch.module.css';
import GoBack from '../../../assets/image/icon/GoBack.svg';
import Search from '../../../assets/image/icon/Search.svg';
import useActivityKeywordStore from '../../../store/useActivityKeywordStore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useProjectStore from '../../../store/useProjectStore';
import useActivityStore from '../../../store/useActivityStore';

function ActivitySearch() {
  const navigate = useNavigate();

  // 프로젝트
  const projectTitles = useProjectStore((state) => state.projectTitles);
  const getProjectTitles = useProjectStore((state) => state.getProjectTitles);

  // 키워드
  const activityKeywords = useActivityKeywordStore(
    (state) => state.activityKeywords,
  );
  const fetchActivityKeywords = useActivityKeywordStore(
    (state) => state.fetchActivityKeywords,
  );

  //  list로 보낼 검색 데이터
  const setSearchCriteria = useActivityStore(
    (state) => state.setSearchCriteria,
  );
  const searchCriteria = useActivityStore((state) => state.searchCriteria);

  const [searchWord, setSearchWord] = useState(searchCriteria.word);
  const [selectProjects, setSelectProjects] = useState<number[]>(
    searchCriteria.projects,
  );
  const [selectKeywords, setSelectKeywords] = useState<number[]>(
    searchCriteria.keywords,
  );

  useEffect(() => {
    getProjectTitles();
    fetchActivityKeywords();
  }, []);

  useEffect(() => {
    // 검색어, 키워드, 프로젝트를 list 컴포넌트에 전달
    setSearchCriteria({
      word: searchWord,
      keywords: selectKeywords,
      projects: selectProjects,
    });
  }, [searchWord, selectProjects, selectKeywords]);

  // 키워드 선택 및 해제 함수
  const handleKeywords = (id: number) => async () => {
    setSelectKeywords(
      (prev) =>
        prev.includes(id)
          ? prev.filter((prevId) => prevId !== id) // 이미 선택된 키워드인 경우 키워드 제외
          : [...prev, id], // 선택 안된 경우 추가
    );
  };

  // 프로젝트 선택 및 해제 함수
  const handleProject = (id: number) => () => {
    setSelectProjects((prev) =>
      prev.includes(id)
        ? prev.filter((prevId) => prevId !== id)
        : [...prev, id],
    );
  };

  // 검색어 입력
  const handleWordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchWord(value);
  };

  // 검색 요청
  const handleActivitySearch = async () => {
    navigate('/activity');
  };

  return (
    <div className={style.container}>
      <div className={style.searchContainer}>
        <img
          src={GoBack}
          alt=""
          onClick={() => {
            navigate('/activity');
          }}
        />
        <div>
          <img src={Search} alt="검색" />
          <input
            className={style.searchBar}
            type="text"
            placeholder="검색어를 입력하세요 (제목)"
            value={searchWord}
            onChange={handleWordChange}
          />
        </div>
        <button onClick={handleActivitySearch} className={style.searchButton}>
          검색
        </button>
      </div>
      <div className={style.filterContainer}>
        <div className={style.filter}>
          <div className={style.title}>프로젝트명</div>
          <div className={style.tags}>
            {projectTitles.map((project, idx) => (
              <div
                key={idx}
                className={`${style.tag} ${style.project} ${selectProjects.includes(project.projectId) ? style.active : ''}`}
                onClick={handleProject(project.projectId)}
              >
                {project.title}
              </div>
            ))}
          </div>
        </div>
        <div className={style.filter}>
          <div className={style.title}>기술 키워드</div>
          <div className={style.tags}>
            {activityKeywords
              .filter((keyword) => !keyword.type)
              .map((keyword, idx) => (
                <div
                  key={idx}
                  className={`${style.tag} ${style.skill} ${selectKeywords.includes(keyword.id) ? style.active : ''}`}
                  onClick={handleKeywords(keyword.id)}
                >
                  {keyword.name}
                </div>
              ))}
          </div>
        </div>
        <div className={style.filter}>
          <div className={style.title}>인성 키워드</div>
          <div className={style.tags}>
            {activityKeywords
              .filter((keyword) => keyword.type)
              .map((keyword, idx) => (
                <div
                  key={idx}
                  className={`${style.tag} ${style.kind} ${selectKeywords.includes(keyword.id) ? style.active : ''}`}
                  onClick={handleKeywords(keyword.id)}
                >
                  {keyword.name}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivitySearch;
