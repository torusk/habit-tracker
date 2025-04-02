// Firebase設定
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebaseの設定
const firebaseConfig = {
  apiKey: "AIzaSyBEd9J6buXqZTIwBc6qwNZvj7J1qEyiUBE",
  authDomain: "three-habits-tracker.firebaseapp.com",
  projectId: "three-habits-tracker",
  storageBucket: "three-habits-tracker.appspot.com",
  messagingSenderId: "878300262884",
  appId: "1:878300262884:web:33b95427e2f1a65c4d17f1",
};

// Firebase初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
