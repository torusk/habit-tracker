import React, { useState, useEffect } from "react";
import {
  formatDate,
  getDayRecord,
  saveHabitCompletion,
} from "../utils/habitStorage";

// 固定の習慣リスト
const FIXED_HABITS = ["瞑想", "読書"];

const TodayCheckList = () => {
  const today = formatDate(new Date());
  const [todayRecord, setTodayRecord] = useState(
    getDayRecord(today) || { completedHabits: {} }
  );

  // 日付が変わったら再読み込み
  useEffect(() => {
    const checkDate = () => {
      const currentDate = formatDate(new Date());
      if (currentDate !== today) {
        window.location.reload();
      }
    };

    // 1分ごとに日付チェック
    const intervalId = setInterval(checkDate, 60000);
    return () => clearInterval(intervalId);
  }, [today]);

  // 習慣の完了状態を切り替え
  const toggleHabit = (habit) => {
    const isCurrentlyCompleted = todayRecord.completedHabits[habit] || false;
    const success = saveHabitCompletion(today, habit, !isCurrentlyCompleted);

    if (success) {
      setTodayRecord((prev) => ({
        ...prev,
        completedHabits: {
          ...prev.completedHabits,
          [habit]: !isCurrentlyCompleted,
        },
      }));
    }
  };

  // 日付の日本語表示
  const formatDateJP = (dateStr) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
    const weekday = weekdays[date.getDay()];

    return `${month}/${day} (${weekday})`;
  };

  return (
    <div className="today-checklist">
      <h3 className="checklist-header">
        今日の習慣チェック ({formatDateJP(today)})
      </h3>
      <div className="habit-items">
        {FIXED_HABITS.map((habit) => (
          <div key={habit} className="habit-item">
            <label className="habit-label">
              <input
                type="checkbox"
                checked={todayRecord.completedHabits[habit] || false}
                onChange={() => toggleHabit(habit)}
                className="habit-checkbox"
              />
              <span className="habit-name">{habit}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodayCheckList;
