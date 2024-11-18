import style from './ProjectList.module.css';

import Bubble from '../../../assets/lottie/Bubble.json';
import EmptyFolder from '../../../assets/image/icon/EmptyFolder.svg';
import Loading from '../../common/loading/Loading';

import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import ProjectCard from '../../common/projectCard/ProjectCard';
import useProjectStore from '../../../store/useProjectStore';

function ProjectList() {
  const [onlyProgress, setOnlyProgress] = useState(false);

  const { isProjectLoading, projectList, getProjectList, setTabIdx } =
    useProjectStore();

  const navigate = useNavigate();

  const navCreate = () => {
    navigate('/project/create');
  };

  const navPjtDetail = (pjtID: number) => {
    navigate(`${pjtID}`);
  };

  const handleProgress = () => {
    setOnlyProgress(!onlyProgress);
  };

  useEffect(() => {
    getProjectList();
    setTabIdx(0);
  }, []);

  if (isProjectLoading) {
    return (
      <Loading
        isLoading={isProjectLoading}
        title="데이터 로딩 중 ..."
        animationData={Bubble}
      />
    );
  }

  return (
    <div className={style.container}>
      <section className={style.headerSection}>
        <div className={style.pageTitle}>프로젝트</div>
        <button className={style.pjtAddBtn} onClick={navCreate}>
          + 프로젝트 추가
        </button>
      </section>

      <section className={style.pjtSection}>
        <div
          className={`${style.checkProgress} ${onlyProgress ? style.active : ''}`}
          onClick={handleProgress}
        >
          {onlyProgress ? '전체보기' : '진행중인 것만 보기'}
        </div>
        {projectList.length !== 0 ? (
          <div className={style.projectGrid}>
            {onlyProgress
              ? projectList
                  .filter((pjt) => pjt.status)
                  .map((card, index) => (
                    <div
                      key={index}
                      onClick={() => navPjtDetail(card.projectId)}
                    >
                      <ProjectCard
                        pjtId={card.projectId}
                        imageSrc={card.image}
                        title={card.title}
                        status={card.status}
                        term={card.startDate + ' ~ ' + card.endDate}
                        description={card.description}
                        notificationStatus={card.notificationStatus}
                      />
                    </div>
                  ))
              : projectList.map((card, index) => (
                  <div key={index} onClick={() => navPjtDetail(card.projectId)}>
                    <ProjectCard
                      pjtId={card.projectId}
                      imageSrc={card.image}
                      title={card.title}
                      status={card.status}
                      term={card.startDate + ' ~ ' + card.endDate}
                      description={card.description}
                      notificationStatus={card.notificationStatus}
                    />
                  </div>
                ))}
          </div>
        ) : (
          <div className={style.emptyPjtContainer}>
            <img
              className={style.emptyIcon}
              src={EmptyFolder}
              alt="프로젝트 없음"
            />
            <div className={style.emptyTextBox}>
              <p>프로젝트가 없어요.</p>
              <p className={style.boldText}>프로젝트를 생성해주세요!</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default ProjectList;
