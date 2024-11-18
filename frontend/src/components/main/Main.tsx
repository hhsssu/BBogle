import style from './Main.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProgressProjectList } from '../../api/projectApi';

// lottie
import Lottie from 'lottie-react';
import Welcome from '../../assets/lottie/Welcome.json';
import Scroll from '../../assets/lottie/Scroll.json';

// 이미지
import Empty from '../../assets/image/icon/EmptyFolder.svg';

// 컴포넌트
import ProjectCard from '../common/projectCard/ProjectCard';
import GoToDiary from '../common/button/GoToDiary';
import HorizontalScroll from '../common/scroll/HorizontalScroll';

// store
import useProjectSelectStore from '../../store/useProjectSelectStore';
import useUserStore from '../../store/useUserStore';
import { getFCMToken, requestPermission } from '../../config/firebase';
import { transferToken } from '../../api/alarmApi';

interface Project {
  projectId: number;
  image: string;
  title: string;
  description: string;
  status: boolean;
  startDate: string;
  endDate: string;
  notificationStatus: boolean;
}

function Main() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isRedirected = queryParams.get('login') === 'true';
  const { activeProjectId, setActiveProjectId } = useProjectSelectStore();
  const { fetchUserNickname, user } = useUserStore();
  const [scrollGuide, setScrollGuide] = useState(true); // 스크롤 가이드 상태관리
  const [pjtList, setPjtList] = useState<Project[]>([]); // 프로젝트 리스트 상태관리

  useEffect(() => {
    // 로그인 후 메인으로 넘어온 경우에만
    if (isRedirected) {
      const askNotificationPermission = async () => {
        const isGranted = await requestPermission();
        // 알림 권한을 허용받은 경우이거나, 이미 알림 권한이 허용되어 있는 경우
        if (isGranted) {
          // 서비스 워커 준비 상태 보장
          const registration = await navigator.serviceWorker.ready;

          // FCM 토큰 발급
          const token = await getFCMToken(registration);
          if (token) {
            await transferToken(token); // 백엔드로 전송
          }
        }
      };
      askNotificationPermission();
    }
  }, [isRedirected]);

  useEffect(() => {
    const fetchProjects = async () => {
      const projectList = await getProgressProjectList();

      if (projectList) setPjtList(projectList);
    };

    // 유저 닉네임 조회
    fetchUserNickname();

    // 진행 중인 프로젝트 조회
    fetchProjects();

    setActiveProjectId(null);
    setTimeout(() => {
      setScrollGuide(false);
    }, 5000);
  }, [fetchUserNickname, setActiveProjectId]);

  // 카드 선택
  const handleCard = (id: number) => {
    if (id === activeProjectId) {
      setActiveProjectId(null);
    } else {
      setActiveProjectId(id);
    }
  };

  return (
    <div className={style.container}>
      <div className={style.header}>
        <Lottie
          animationData={Welcome}
          loop={false}
          autoplay={true}
          className={style.welcome}
        />
        <div className={style.greeting}>
          안녕하세요, {user?.nickname || '-'}님!
        </div>
      </div>
      <div className={style.diary}>
        <div>
          <div className={style.description}>
            <div className={style.mainDescription}>
              오늘의 <span style={{ color: '#FF5C17' }}>성장 기록</span>을
              남겨보세요 :-)
            </div>
            <div className={style.subDescription}>
              개발한 프로젝트를 선택해주세요 !
            </div>
          </div>
          <div
            className={`${style.scrollGuide} ${!scrollGuide ? style.unvisible : ''}`}
          >
            가로로 스크롤해보세요
            <Lottie
              animationData={Scroll}
              loop={false}
              autoplay={true}
              className={style.scroll}
            />
          </div>
        </div>
        {pjtList.length > 0 ? (
          <HorizontalScroll
            children={pjtList.map((pjt, index) => (
              <div
                className={`${style.pjtCard} ${activeProjectId === pjt.projectId ? style.active : ''}`}
                onClick={() => handleCard(pjt.projectId)}
                key={index}
              >
                <ProjectCard
                  pjtId={pjt.projectId}
                  imageSrc={pjt.image}
                  title={pjt.title}
                  status={pjt.status}
                  term={pjt.startDate + ' ~ ' + pjt.endDate}
                  description={pjt.description}
                  notificationStatus={pjt.notificationStatus}
                />
              </div>
            ))}
          ></HorizontalScroll>
        ) : (
          <div className={style.empty}>
            <img className={style.emptyIcon} src={Empty} alt="프로젝트 없음" />
            <div className={style.emptyTextBox}>
              <p>프로젝트가 없어요.</p>
              <span className={style.boldText}>프로젝트를 생성해주세요!</span>
            </div>
          </div>
        )}
        <div className={style.button}>
          <GoToDiary
            isInactive={activeProjectId === null}
            onClick={() => navigate(`/project/${activeProjectId}/diary/create`)}
          />
        </div>
      </div>
    </div>
  );
}

export default Main;
