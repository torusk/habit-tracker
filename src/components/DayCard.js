import React, { useState, useEffect } from "react";
import HabitItem from "./HabitItem";
import { getDayRecord, getStoredHabits } from "../utils/habitStorage";

const DayCard = ({ date, isCurrentDay }) => {
  const habits = getStoredHabits(); // ここを修正
  const [dayData, setDayData] = useState(
    getDayRecord(date) || { completedHabits: {} }
  );

  // データ更新時に再読込
  useEffect(() => {
    setDayData(getDayRecord(date) || { completedHabits: {} });
  }, [date]);

  // 習慣状態の変更ハンドラ
  const handleHabitChange = (habit, completed) => {
    setDayData((prev) => ({
      ...prev,
      completedHabits: {
        ...prev.completedHabits,
        [habit]: completed,
      },
    }));
  };

  // 完了率を計算
  const completionRate =
    habits.length > 0
      ? Math.round(
          (Object.values(dayData.completedHabits).filter(Boolean).length /
            habits.length) *
            100
        )
      : 0;

  // 日付フォーマット
  const formatDisplayDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <div
      className={`border rounded-lg shadow overflow-hidden ${
        isCurrentDay ? "ring-2 ring-green-500" : ""
      }`}
    >
      <div
        className={`p-3 ${
          isCurrentDay ? "bg-green-100" : "bg-gray-100"
        } flex justify-between items-center`}
      >
        <h3 className="font-semibold">
          {formatDisplayDate(date)}
          {isCurrentDay && (
            <span className="ml-2 text-sm text-green-600">今日</span>
          )}
        </h3>
        <div className="text-sm font-medium">{completionRate}%</div>
      </div>

      <div className="bg-white">
        {habits.map((habit) => (
          <HabitItem
            key={`${date}-${habit}`}
            date={date}
            habit={habit}
            completed={!!dayData.completedHabits[habit]}
            onChange={handleHabitChange}
          />
        ))}
      </div>

      {dayData.locked && (
        <div className="p-2 bg-gray-100 text-xs text-center text-gray-500">
          ロック済み
        </div>
      )}
    </div>
  );
};

export default DayCard;
