import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import style from './App.module.css';
import SideBar from './components/common/sideBar/SideBar';
import AppRouter from './routes/AppRouter';
import useSideBarStore from './store/useSideBarStore';
import { onMessageListener } from './config/firebase';
import useActivityStore from './store/useActivityStore';

function App() {
  const { isOpen } = useSideBarStore();
  const location = useLocation();

  const searchCriteria = useActivityStore((state) => state.searchCriteria);
  const resetSearchCriteria = useActivityStore(
    (state) => state.resetSearchCriteria,
  );

  // 현재 경로가 '/login'이면 SideBar를 렌더링하지 않음
  const isOnboarding = location.pathname === '/login';

  // 알림 권한 및 FCM 토큰 상태 관리
  const [notification, setNotification] = useState<{
    title: string;
    body: string;
  } | null>(null);

  useEffect(() => {
    // 메시지 수신 리스너 설정
    onMessageListener().then((payload) => {
      setNotification({
        title: payload.data?.title ?? '제목 없음', // 메시지 제목
        body: payload.data?.body ?? '내용 없음', // 메시지 내용
      });

      // 5초 후 알림 숨김 처리
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    });
  }, []);

  useEffect(() => {
    if (!location.pathname.startsWith('/activity')) {
      if (
        searchCriteria.word.length > 0 ||
        searchCriteria.keywords.length > 0 ||
        searchCriteria.projects.length > 0
      ) {
        resetSearchCriteria();
      }
    }
  }, [location.pathname]);

  return (
    <div className={style['app-container']}>
      {/* 현재 경로가 '/login'이 아닌 경우에만 SideBar를 표시 */}
      {!isOnboarding && <SideBar />}
      <div
        className={`${style['app-content']} ${isOnboarding ? '' : isOpen ? style.open : style.closed}`}
      >
        <AppRouter />
        {/* 알림 메시지 표시 */}
        {notification && (
          <div className={style['notification']}>
            <h2>{notification.title}</h2>
            <p>{notification.body}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
