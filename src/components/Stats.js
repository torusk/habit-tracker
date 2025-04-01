import React, { useMemo } from 'react';
import { getAllRecords, getStoredHabits } from '../utils/habitStorage';

const Stats = () => {
  const records = getAllRecords();
  const habits = getStoredHabits();
  
  // 統計データの計算
  const stats = useMemo(() => {
    // ストリーク（連続達成）の計算
    const streaks = {};
    const completionRates = {};
    
    // 習慣ごとの初期化
    habits.forEach(habit => {
      streaks[habit] = 0;
      completionRates[habit] = { completed: 0, total: 0 };
    });
    
    // 日付でソート
    const sortedRecords = [...records].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // ストリークと達成率の計算
    sortedRecords.forEach(record => {
      habits.forEach(habit => {
        const isCompleted = record.completedHabits && record.completedHabits[habit];
        
        // 達成率の更新
        completionRates[habit].total += 1;
        if (isCompleted) {
          completionRates[habit].completed += 1;
        }
      });
    });
    
    // ストリークの最終計算
    Object.keys(completionRates).forEach(habit => {
      completionRates[habit].rate = Math.round(
        (completionRates[habit].completed / Math.max(1, completionRates[habit].total)) * 100
      );
    });
    
    return {
      streaks,
      completionRates,
      totalDays: records.length
    };
  }, [records, habits]);
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">統計</h2>
      
      <div className="mb-4">
        <h3 className="font-medium text-gray-700">記録日数</h3>
        <p className="text-2xl font-bold">{stats.totalDays}日</p>
      </div>
      
      <div className="mb-4">
        <h3 className="font-medium text-gray-700">習慣の達成率</h3>
        <div className="space-y-2 mt-2">
          {habits.map(habit => (
            <div key={habit} className="flex items-center">
              <span className="w-24 truncate">{habit}</span>
              <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500" 
                  style={{ width: `${stats.completionRates[habit]?.rate || 0}%` }}
                ></div>
              </div>
              <span className="ml-2 text-sm font-medium">
                {stats.completionRates[habit]?.rate || 0}%
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="font-medium text-gray-700">最近のトレンド</h3>
        <p className="text-sm text-gray-500 mt-1">
          {records.length > 0 
            ? '記録を続けて、より詳細なトレンドを確認しましょう！' 
            : '記録を始めると、ここにトレンドが表示されます。'}
        </p>
      </div>
    </div>
  );
};

export default Stats;