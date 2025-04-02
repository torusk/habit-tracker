// このスクリプトは管理者ユーザーを作成するためのものです
// 一度だけ実行してください

import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// Firebaseの設定情報（config.jsと同じ内容に更新してください）
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// 作成したいユーザーの情報
const adminEmail = "your-email@example.com"; // あなたのメールアドレスに変更
const adminPassword = "your-secure-password"; // 安全なパスワードを設定

// Firebaseを初期化
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 管理者ユーザーを作成
async function createAdminUser() {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    const user = userCredential.user;
    console.log("管理者ユーザーが作成されました:", user.uid);
  } catch (error) {
    console.error("エラー:", error.code, error.message);
  }
}

// 実行
createAdminUser().then(() => {
  console.log("スクリプト完了");
  process.exit(0);
}).catch(error => {
  console.error("スクリプト実行エラー:", error);
  process.exit(1);
});