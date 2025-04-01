import React, { useEffect } from "react";
import HabitContributionGraph from "./components/HabitContributionGraph";
import TodayCheckList from "./components/TodayCheckList";
import { lockDayRecord, formatDate } from "./utils/habitStorage";

function App() {
  // 日付が変わった時に前日の記録をロック（編集不可に）
  useEffect(() => {
    const checkAndLockPreviousDay = () => {
      const yesterday = formatDate(
        new Date(new Date().setDate(new Date().getDate() - 1))
      );
      lockDayRecord(yesterday);
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

  // URLから秘密キーを取得（簡易的なアクセス制限）
  const urlParams = new URLSearchParams(window.location.search);
  const secretKey = urlParams.get("key");
  const hasAccess = !secretKey || secretKey === "kazuki"; // 'kazuki'を任意の秘密キーに変更

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>習慣トラッカー</h1>
      </header>

      <main className="app-main">
        {hasAccess ? (
          <>
            <div className="graph-container">
              <HabitContributionGraph />
            </div>
            <div className="checklist-container">
              <TodayCheckList />
            </div>
          </>
        ) : (
          <div className="access-denied">
            <p>アクセス権限がありません。正しいURLをご利用ください。</p>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>© 2025 習慣トラッカー</p>
      </footer>
    </div>
  );
}

export default App;
