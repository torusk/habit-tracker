import React, { useState, useEffect } from "react";
import {
  addMonths,
  subMonths,
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addDays,
} from "date-fns";
import { ja } from "date-fns/locale";
import { getDayRecord, formatDate } from "../utils/habitStorage";

// 固定の習慣リスト
const FIXED_HABITS = ["瞑想", "読書"];

const HabitContributionGraph = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthData, setMonthData] = useState([]);

  // 月のカレンダーデータを生成
  useEffect(() => {
    const startDate = startOfMonth(currentDate);
    const endDate = endOfMonth(currentDate);

    // その月の日付すべてを取得
    const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });

    // 1日目が月曜日からスタートするように前月の日を追加
    const dayOfWeek = startDate.getDay() || 7; // 日曜は0ではなく7として扱う
    const mondayStart = dayOfWeek - 1;
    let calendarDays = [...Array(mondayStart)].map((_, i) => {
      const prevMonthDay = addDays(startDate, -mondayStart + i);
      return {
        date: formatDate(prevMonthDay),
        isCurrentMonth: false,
      };
    });

    // 当月の日を追加
    calendarDays = [
      ...calendarDays,
      ...daysInMonth.map((day) => ({
        date: formatDate(day),
        isCurrentMonth: true,
      })),
    ];

    // 最後の週を埋めるために次月の日を追加
    const remainingDays = 7 - (calendarDays.length % 7);
    if (remainingDays < 7) {
      const lastDate = endDate;
      calendarDays = [
        ...calendarDays,
        ...Array(remainingDays)
          .fill()
          .map((_, i) => {
            const nextMonthDay = addDays(lastDate, i + 1);
            return {
              date: formatDate(nextMonthDay),
              isCurrentMonth: false,
            };
          }),
      ];
    }

    setMonthData(calendarDays);
  }, [currentDate]);

  // 前月へ
  const goToPreviousMonth = () => {
    setCurrentDate((prevDate) => subMonths(prevDate, 1));
  };

  // 次月へ
  const goToNextMonth = () => {
    setCurrentDate((prevDate) => addMonths(prevDate, 1));
  };

  // 今月へ
  const goToCurrentMonth = () => {
    setCurrentDate(new Date());
  };

  // 日付ごとの達成率を計算して色を決定
  const getContributionColor = (date) => {
    const dayRecord = getDayRecord(date);
    if (!dayRecord || !FIXED_HABITS.length) return "#ebedf0"; // デフォルト色（灰色）

    // 固定習慣のうち、完了したものをカウント
    const completedCount = FIXED_HABITS.filter(
      (habit) => dayRecord.completedHabits && dayRecord.completedHabits[habit]
    ).length;

    // 完了数に応じて色を返す（GitHubの草の色に近づける）
    if (completedCount === 0) return "#ebedf0"; // 0件：灰色
    if (completedCount === 1) return "#9be9a8"; // 1件：薄緑
    return "#39d353"; // 2件：濃い緑
  };

  return (
    <div className="contribution-graph">
      <div className="contribution-header">
        <h2 className="month-title">
          {format(currentDate, "yyyy年M月", { locale: ja })}
        </h2>
        <div className="month-navigation">
          <button onClick={goToPreviousMonth} className="nav-button">
            ←
          </button>
          <button onClick={goToCurrentMonth} className="nav-button current">
            今月
          </button>
          <button onClick={goToNextMonth} className="nav-button">
            →
          </button>
        </div>
      </div>

      {/* 曜日ヘッダー */}
      <div className="weekday-header">
        <div>月</div>
        <div>火</div>
        <div>水</div>
        <div>木</div>
        <div>金</div>
        <div>土</div>
        <div>日</div>
      </div>

      {/* 草グラフ */}
      <div className="contribution-cells">
        {monthData.map((day, index) => {
          const isToday = day.date === formatDate(new Date());
          const contributionColor = getContributionColor(day.date);

          return (
            <div
              key={day.date + index}
              className={`contribution-cell ${
                !day.isCurrentMonth ? "faded" : ""
              } ${isToday ? "today" : ""}`}
              style={{ backgroundColor: contributionColor }}
              title={`${day.date}: ${
                getDayRecord(day.date)
                  ? FIXED_HABITS.filter(
                      (habit) =>
                        getDayRecord(day.date).completedHabits &&
                        getDayRecord(day.date).completedHabits[habit]
                    ).length
                  : 0
              }/${FIXED_HABITS.length} 完了`}
            >
              <div className="date-label">{new Date(day.date).getDate()}</div>
            </div>
          );
        })}
      </div>

      {/* 凡例 */}
      <div className="contribution-legend">
        <span>レベル:</span>
        <span>0件</span>
        <div
          className="legend-cell"
          style={{ backgroundColor: "#ebedf0" }}
        ></div>
        <span>1件</span>
        <div
          className="legend-cell"
          style={{ backgroundColor: "#9be9a8" }}
        ></div>
        <span>2件</span>
        <div
          className="legend-cell"
          style={{ backgroundColor: "#39d353" }}
        ></div>
      </div>
    </div>
  );
};

export default HabitContributionGraph;
