import React, { useState, useEffect } from "react";
import {
  format,
  addDays,
  subYears,
  addYears,
  parseISO,
  isEqual,
  getDay,
  startOfDay
} from "date-fns";
import { ja } from "date-fns/locale";
import { getDayRecord, formatDate } from "../utils/habitStorage";

// 固定の習慣リスト
const FIXED_HABITS = ["瞑想", "読書"];

const HabitContributionGraph = () => {
  const [yearData, setYearData] = useState([]);
  const [currentYear, setCurrentYear] = useState(new Date("2025-04-01")); // 2025/04/01スタート

  // 1年分のデータを生成
  useEffect(() => {
    // 開始日を設定
    const startDate = startOfDay(currentYear);
    
    // 53週分のデータを生成（年をまたぐ可能性を考慮して53週）
    let allDays = [];
    
    // 最初の週の月曜日を見つける（開始日が月曜でない場合）
    const dayOfWeek = getDay(startDate);
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // 月曜日は1、日曜日は0
    const firstMonday = addDays(startDate, mondayOffset);
    
    // 1年分（53週）のデータを生成
    for (let day = 0; day < 7; day++) {
      for (let week = 0; week < 53; week++) {
        const currentDate = addDays(firstMonday, week * 7 + day);
        const dateString = formatDate(currentDate);
        
        // 1年分のデータのみを表示（開始日から365日分）
        const isInTargetYear = currentDate >= startDate && 
                              currentDate < addYears(startDate, 1);
        
        allDays.push({
          date: dateString,
          isInTargetYear,
          day,
          week
        });
      }
    }
    
    setYearData(allDays);
  }, [currentYear]);

  // 前年へ
  const goToPreviousYear = () => {
    setCurrentYear((prevDate) => subYears(prevDate, 1));
  };

  // 次年へ
  const goToNextYear = () => {
    setCurrentYear((prevDate) => addYears(prevDate, 1));
  };

  // 今年へ
  const goToCurrentYear = () => {
    setCurrentYear(new Date("2025-04-01"));
  };

  // 日付ごとの達成率を計算して色を決定
  const getContributionColor = (date) => {
    const dayRecord = getDayRecord(date);
    if (!dayRecord || !FIXED_HABITS.length) return "#ebedf0"; // デフォルト色（灰色）

    // 固定習慣のうち、完了したものをカウント
    const meditationCompleted = dayRecord.completedHabits && dayRecord.completedHabits["瞑想"];
    const readingCompleted = dayRecord.completedHabits && dayRecord.completedHabits["読書"];

    // 完了状況に応じて色を返す
    if (meditationCompleted && readingCompleted) return "#ffd700"; // 両方完了：金色
    if (meditationCompleted) return "#9966cc"; // 瞑想のみ：紫色
    if (readingCompleted) return "#90ee90"; // 読書のみ：黄緑
    return "#ebedf0"; // 何も完了していない：灰色
  };
  
  // 現在の日付から1年前の日付を計算
  const yearStartDate = format(currentYear, "yyyy/MM/dd", { locale: ja });
  const yearEndDate = format(addYears(currentYear, 1), "yyyy/MM/dd", { locale: ja });

  return (
    <div className="contribution-graph">
      <div className="contribution-header">
        <h2 className="year-title">
          {yearStartDate.replace('/','年').replace('/','月')} - {yearEndDate.replace('/','年').replace('/','月')}
        </h2>
        <div className="year-navigation">
          <button onClick={goToPreviousYear} className="nav-button">
            ←
          </button>
          <button onClick={goToCurrentYear} className="nav-button current">
            初期年
          </button>
          <button onClick={goToNextYear} className="nav-button">
            →
          </button>
        </div>
      </div>

            {/* 草グラフ（1年分） */}
      <div className="contribution-container">
        {/* 曜日ラベル（左側） */}
        <div className="day-labels">
          <div>月</div>
          <div>水</div>
          <div>金</div>
        </div>

        {/* グラフ本体 */}
        <div className="graph-area">
          {/* 月ラベル（上部） */}
          <div className="month-labels">
            <div>4月</div>
            <div>5月</div>
            <div>6月</div>
            <div>7月</div>
            <div>8月</div>
            <div>9月</div>
            <div>10月</div>
            <div>11月</div>
            <div>12月</div>
            <div>1月</div>
            <div>2月</div>
            <div>3月</div>
          </div>

          {/* 草グラフ */}
          <div className="contribution-cells year-view">
            {yearData.map((day, index) => {
              const isToday = day.date === formatDate(new Date());
              const contributionColor = getContributionColor(day.date);

              return (
                <div
                  key={day.date + index}
                  className={`contribution-cell ${
                    !day.isInTargetYear ? "faded" : ""
                  } ${isToday ? "today" : ""}`}
                  style={{
                    backgroundColor: contributionColor,
                    gridColumn: day.week + 1,
                    gridRow: day.day + 1
                  }}
                  title={`${day.date}: ${
                    getDayRecord(day.date) && getDayRecord(day.date).completedHabits
                      ? (getDayRecord(day.date).completedHabits["瞑想"] ? "瞑想 " : "") + 
                        (getDayRecord(day.date).completedHabits["読書"] ? "読書" : "")
                      : "なし"
                  }`}
                >
                  <div className="date-label">{new Date(day.date).getDate()}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 凡例 */}
      <div className="contribution-legend">
        <span>レベル:</span>
        <span>なし</span>
        <div
          className="legend-cell"
          style={{ backgroundColor: "#ebedf0" }}
        ></div>
        <span>瞑想</span>
        <div
          className="legend-cell"
          style={{ backgroundColor: "#9966cc" }}
        ></div>
        <span>読書</span>
        <div
          className="legend-cell"
          style={{ backgroundColor: "#90ee90" }}
        ></div>
        <span>両方</span>
        <div
          className="legend-cell"
          style={{ backgroundColor: "#ffd700" }}
        ></div>
      </div>
    </div>
  );
};

export default HabitContributionGraph;
