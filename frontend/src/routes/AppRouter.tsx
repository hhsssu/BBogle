import { Route, Routes } from 'react-router-dom';

import OnboardingPage from '../pages/OnboardingPage';
import ProjectPage from '../pages/ProjectPage';
import ActivityPage from '../pages/ActivityPage';
import MainPage from '../pages/MainPage';
import Main from '../components/main/Main';
import MyPage from '../pages/MyPage';

// 페이지 접근 제한
import { PrivateRoute } from './PrivateRoute';
import { PublicRoute } from './PublicRoute';
import NotFoundPage from '../pages/NotFoundPage';

function AppRouter() {
  return (
    <Routes>
      // 로그인 페이지
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<OnboardingPage />}></Route>
      </Route>
      // 메인 페이지
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<MainPage />}>
          <Route index element={<Main />} />
        </Route>
        {/* 프로젝트 페이지 */}
        <Route path="project/*" element={<ProjectPage></ProjectPage>} />
        <Route path="activity/*" element={<ActivityPage />} />
        {/* 마이 페이지 */}
        <Route path="my" element={<MyPage />}></Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
