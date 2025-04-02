import React, { useEffect, useState } from "react";
import HabitContributionGraph from "./components/HabitContributionGraph";
import TodayCheckList from "./components/TodayCheckList";
import Login from "./components/Login";
import { lockDayRecord, formatDate, migrateLocalStorageToFirestore } from "./utils/habitStorage";
import { auth } from "./firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataMigrated, setDataMigrated] = useState(false);

  // 認証状態の監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);

      // ログイン時にLocalStorageのデータを移行（初回のみ）
      if (user && !dataMigrated) {
        await migrateLocalStorageToFirestore();
        setDataMigrated(true);
      }
    });

    return () => unsubscribe();
  }, [dataMigrated]);

  // 日付が変わった時に前日の記録をロック（編集不可に）
  useEffect(() => {
    const checkAndLockPreviousDay = async () => {
      const yesterday = formatDate(
        new Date(new Date().setDate(new Date().getDate() - 1))
      );
      await lockDayRecord(yesterday);
    };

    // 初回実行
    checkAndLockPreviousDay();

    // 毎日午前0時に実行するタイマー
    const setMidnightTimer = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const timeUntilMidnight = tomorrow - now;

      return setTimeout(() => {
        checkAndLockPreviousDay();
        // 次の日のタイマーをセット
        setMidnightTimer();
      }, timeUntilMidnight);
    };

    const timerId = setMidnightTimer();
    return () => clearTimeout(timerId);
  }, []);

  // ログアウト処理
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("ログアウトに失敗しました:", error);
    }
  };

  // ローディング中
  if (loading) {
    return (
      <div className="app-container">
        <header className="app-header">
          <h1>習慣トラッカー</h1>
        </header>
        <main className="app-main" style={{ overflowX: 'visible' }}>
          <div className="loading">
            <p>読み込み中...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>習慣トラッカー</h1>
        {user && (
          <div className="user-info">
            <span className="user-email">{user.email}</span>
            <button onClick={handleLogout} className="logout-button">
              ログアウト
            </button>
          </div>
        )}
      </header>

      <main className="app-main" style={{ overflowX: 'visible' }}>
        {user ? (
          <>
            <div className="checklist-container">
              <TodayCheckList />
            </div>
            <div className="graph-container">
              <HabitContributionGraph />
            </div>
          </>
        ) : (
          <Login />
        )}
      </main>

      <footer className="app-footer">
        <p>© 2025 習慣トラッカー</p>
      </footer>
    </div>
  );
}

export default App;
