import { initializeApp } from 'firebase/app';
import {
  getMessaging,
  getToken,
  onMessage,
  MessagePayload,
} from 'firebase/messaging';

// Firebase 프로젝트 설정 정보
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// vapidKey
const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Firebase Cloud Messaging 인스턴스 생성
const messaging = getMessaging(app);

// 사용자의 알림 권한 요청 함수
export const requestPermission = async () => {
  // Notification API가 브라우저에서 지원하는지 확인
  // 권한이 'default'인 경우 권한 요청 (이미 권한이 있는지 확인)
  if ('Notification' in window && Notification.permission === 'default') {
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      return true;
    } else {
      return false;
    }
  } else if (Notification.permission === 'granted') {
    return true;
  }
};

// FCM 토큰 가져오기
export const getFCMToken = async (registration: ServiceWorkerRegistration) => {
  const token = await getToken(messaging, {
    vapidKey: vapidKey,
    serviceWorkerRegistration: registration,
  }); // VAPID 키를 설정

  // 토큰이 있으면 반환
  if (token) {
    return token;
  }
  return null;
};

// 메시지 수신 리스너
export const onMessageListener = () =>
  new Promise<MessagePayload>((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload); // 수신된 메시지를 전달
    });
  });
