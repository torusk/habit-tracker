import React, { useState } from 'react';
import { getStoredHabits, saveHabitList } from '../utils/habitStorage';

const HabitManager = ({ onClose }) => {
  const [habits, setHabits] = useState(getStoredHabits());
  const [newHabit, setNewHabit] = useState('');
  
  const handleAddHabit = () => {
    if (newHabit.trim() === '') return;
    
    const updatedHabits = [...habits, newHabit.trim()];
    setHabits(updatedHabits);
    saveHabitList(updatedHabits);
    setNewHabit('');
  };
  
  const handleRemoveHabit = (index) => {
    const updatedHabits = habits.filter((_, i) => i !== index);
    setHabits(updatedHabits);
    saveHabitList(updatedHabits);
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">習慣の管理</h2>
      
      <div className="flex mb-4">
        <input
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="新しい習慣を追加"
          className="flex-1 p-2 border rounded mr-2"
        />
        <button
          onClick={handleAddHabit}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          追加
        </button>
      </div>
      
      <ul className="divide-y">
        {habits.map((habit, index) => (
          <li key={index} className="py-2 flex justify-between items-center">
            <span>{habit}</span>
            <button
              onClick={() => handleRemoveHabit(index)}
              className="p-1 text-red-500 hover:text-red-700"
            >
              削除
            </button>
          </li>
        ))}
      </ul>
      
      <div className="mt-4 text-right">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          閉じる
        </button>
      </div>
    </div>
  );
};

export default HabitManager;