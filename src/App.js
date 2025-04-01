import React, { useState, useEffect } from "react";
import HabitCalendar from "./components/HabitCalendar";
import HabitManager from "./components/HabitManager";
import Stats from "./components/Stats";
import { lockDayRecord, formatDate } from "./utils/habitStorage";

function App() {
  const [showHabitManager, setShowHabitManager] = useState(false);

  // 日付が変わった時に前日の記録をロック
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

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6" }}>
      <header className="header">
        <div className="header-content">
          <h1 className="text-2xl font-bold">習慣トラッカー</h1>
          <button
            onClick={() => setShowHabitManager(true)}
            className="btn btn-secondary"
          >
            習慣を管理
          </button>
        </div>
      </header>

      <main className="container mt-8">
        <HabitCalendar />

        <div className="mt-8">
          <Stats />
        </div>
      </main>

      {showHabitManager && (
        <div className="modal-overlay">
          <div style={{ maxWidth: "28rem", width: "100%" }}>
            <HabitManager onClose={() => setShowHabitManager(false)} />
          </div>
        </div>
      )}

      <footer className="footer">
        <p>© 2025 習慣トラッカー - 毎日の達成を記録しよう</p>
      </footer>
    </div>
  );
}

export default App;
