// Firebase 라이브러리를 importScripts로 가져오기
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts(
  'https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js',
);

// Firebase 설정
const firebaseConfig = {
  apiKey: 'AIzaSyAR8FQp4IyRD7xOZJdlw3uKpokhTJrg0EA',
  authDomain: 'bbogle-c47b4.firebaseapp.com',
  projectId: 'bbogle-c47b4',
  storageBucket: 'bbogle-c47b4.firebasestorage.app',
  messagingSenderId: '284508974366',
  appId: '1:284508974366:web:89fb4006f16b03621f6d0f',
};

// Firebase 초기화
firebase.initializeApp(firebaseConfig);

// Messaging 인스턴스 생성
const messaging = firebase.messaging();
