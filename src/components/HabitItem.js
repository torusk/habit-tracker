import React from "react";
import { saveHabitCompletion, isToday } from "../utils/habitStorage";

const HabitItem = ({ date, habit, completed, onChange }) => {
  const isEditable = isToday(date);

  const handleChange = (e) => {
    const isChecked = e.target.checked;
    const success = saveHabitCompletion(date, habit, isChecked);
    if (success && onChange) {
      onChange(habit, isChecked);
    }
  };

  return (
    <div className="flex items-center p-2 border-b">
      <input
        type="checkbox"
        id={`habit-${date}-${habit}`}
        checked={completed}
        onChange={handleChange}
        disabled={!isEditable}
        className="checkbox"
      />
      <label
        htmlFor={`habit-${date}-${habit}`}
        style={{
          marginLeft: "0.75rem",
          color: !isEditable ? "#6b7280" : "inherit",
        }}
      >
        {habit}
      </label>
      {!isEditable && completed && (
        <span style={{ marginLeft: "auto", color: "#16a34a" }}>✓</span>
      )}
      {!isEditable && !completed && (
        <span style={{ marginLeft: "auto", color: "#ef4444" }}>✗</span>
      )}
    </div>
  );
};

export default HabitItem;
