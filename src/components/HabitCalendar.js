import React, { useState, useEffect } from 'react';
import { addDays, subDays, startOfWeek } from 'date-fns';
import DayCard from './DayCard';
import { formatDate, getTodayDate } from '../utils/habitStorage';

const HabitCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState([]);
  
  // 週の日付を生成
  useEffect(() => {
    const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // 月曜始まり
    const dates = [];
    
    for (let i = 0; i < 7; i++) {
      const date = addDays(startDate, i);
      dates.push(formatDate(date));
    }
    
    setWeekDates(dates);
  }, [currentDate]);
  
  // 前の週へ
  const goToPreviousWeek = () => {
    setCurrentDate(prevDate => subDays(prevDate, 7));
  };
  
  // 次の週へ
  const goToNextWeek = () => {
    setCurrentDate(prevDate => addDays(prevDate, 7));
  };
  
  // 今日の日付へ
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  const todayDate = getTodayDate();
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={goToPreviousWeek}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          前の週
        </button>
        
        <button
          onClick={goToToday}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          今日
        </button>
        
        <button
          onClick={goToNextWeek}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          次の週
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDates.map(date => (
          <DayCard 
            key={date} 
            date={date}
            isCurrentDay={date === todayDate} 
          />
        ))}
      </div>
    </div>
  );
};

export default HabitCalendar;