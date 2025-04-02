// Firebase設定
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebaseの設定（環境変数から取得）
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyBsalvDzPH7abcdefghijklmnopqrstuvwxyz",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "habit-tracker-xxxxx.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "habit-tracker-xxxxx",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "habit-tracker-xxxxx.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123456789012:web:abcdef1234567890"
};

// 開発用メッセージ
if (process.env.NODE_ENV === 'development') {
  console.log('Firebase Config: ', firebaseConfig);
  
  // 環境変数が設定されているか確認
  if (firebaseConfig.apiKey === "AIzaSyBsalvDzPH7abcdefghijklmnopqrstuvwxyz") {
    console.warn('Firebase設定が完了していません。.envファイルを設定してください。');
  }
}

// Firebase初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
