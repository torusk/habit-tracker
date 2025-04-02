// Firebase設定
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebaseの設定
const firebaseConfig = {
  apiKey: "AIzaSyBbWPv1CeWaZQE7sVxjTux5_YhA10-54_g",
  authDomain: "p-habit-tracker.firebaseapp.com",
  projectId: "jp-habit-tracker",
  storageBucket: "jp-habit-tracker.firebasestorage.app",
  messagingSenderId: "608025122624",
  appId: "1:608025122624:web:c6c5069c81102472158ca5",
};

// Firebase初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
