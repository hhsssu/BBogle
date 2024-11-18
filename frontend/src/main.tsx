import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// 서비스 워커 등록 및 FCM 토큰 요청
if ('serviceWorker' in navigator) {
  // 현재 활성 서비스 워커가 있는지 확인
  if (navigator.serviceWorker.controller) {
    //
  } else {
    // 서비스 워커 등록
    navigator.serviceWorker.register('/firebase-messaging-sw.js');
  }
}

// React 앱 렌더링
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
