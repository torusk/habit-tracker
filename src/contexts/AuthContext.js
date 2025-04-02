import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../firebase/config';

// 認証コンテキストを作成
const AuthContext = createContext();

// 認証プロバイダーコンポーネント
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // サインアップ（新規ユーザー登録）
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // ログイン
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // ログアウト
  function logout() {
    return signOut(auth);
  }

  // パスワードリセットメールの送信
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // 認証状態の監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // コンテキストの値
  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// カスタムフック
export const useAuth = () => {
  return useContext(AuthContext);
};