import React, { useState, useEffect } from "react";
import {
  formatDate,
  getDayRecord,
  saveHabitCompletion,
  getDayRecordSync
} from "../utils/habitStorage";

// 固定の習慣リスト
const FIXED_HABITS = ["瞑想", "学習", "運動"];

const TodayCheckList = () => {
  const today = formatDate(new Date());
  const [todayRecord, setTodayRecord] = useState(
    { completedHabits: {} }
  );
  const [loading, setLoading] = useState(true);

  // 今日の記録を取得
  useEffect(() => {
    const fetchTodayRecord = async () => {
      try {
        // まずLocalStorageから同期的に取得して初期表示
        const localRecord = getDayRecordSync(today);
        if (localRecord) {
          setTodayRecord(localRecord);
        }
        
        // Firestoreから非同期で取得
        const record = await getDayRecord(today);
        if (record) {
          setTodayRecord(record);
        } else {
          setTodayRecord({ completedHabits: {} });
        }
        setLoading(false);
      } catch (error) {
        console.error('今日の記録の取得に失敗しました:', error);
        setLoading(false);
      }
    };
    
    fetchTodayRecord();
  }, [today]);

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
  const toggleHabit = async (habit) => {
    try {
      const isCurrentlyCompleted = todayRecord.completedHabits[habit] || false;
      
      // UI更新を先に行ってレスポンシブに
      setTodayRecord((prev) => ({
        ...prev,
        completedHabits: {
          ...prev.completedHabits,
          [habit]: !isCurrentlyCompleted,
        },
      }));
      
      // バックグラウンドで保存
      const success = await saveHabitCompletion(today, habit, !isCurrentlyCompleted);
      
      if (!success) {
        // 保存に失敗した場合は元に戻す
        setTodayRecord((prev) => ({
          ...prev,
          completedHabits: {
            ...prev.completedHabits,
            [habit]: isCurrentlyCompleted,
          },
        }));
        console.error('習慣の保存に失敗しました');
      }
    } catch (error) {
      console.error('習慣の切り替えに失敗しました:', error);
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
                checked={todayRecord.completedHabits && todayRecord.completedHabits[habit] || false}
                onChange={() => toggleHabit(habit)}
                className="habit-checkbox"
                disabled={loading}
              />
              <span className="habit-name">{habit}</span>
            </label>
          </div>
        ))}
      </div>
      <div className="checklist-tips">
        {loading ? 'データ読み込み中...' : 'タップして習慣を記録、チェックが即座に反映されます。'}
      </div>
    </div>
  );
};

export default TodayCheckList;
