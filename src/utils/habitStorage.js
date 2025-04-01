// LocalStorageを使用して習慣データを管理するユーティリティ

// 日付をYYYY-MM-DD形式に変換
const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
};

// 今日の日付を取得
const getTodayDate = () => formatDate(new Date());

// 日付が今日かどうかチェック
const isToday = (dateString) => {
  return formatDate(new Date()) === dateString;
};

// 特定の日付の記録を取得
const getDayRecord = (date) => {
  const recordKey = `record_${date}`;
  const stored = localStorage.getItem(recordKey);
  return stored ? JSON.parse(stored) : null;
};

// 全ての日付記録を取得
const getAllRecords = () => {
  const records = [];
  // LocalStorageから記録を検索
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("record_")) {
      const date = key.replace("record_", "");
      const record = JSON.parse(localStorage.getItem(key));
      records.push({ date, ...record });
    }
  }
  // 日付でソート
  return records.sort((a, b) => new Date(b.date) - new Date(a.date));
};

// 習慣の達成状態を記録
const saveHabitCompletion = (date, habit, completed) => {
  const recordKey = `record_${date}`;
  let record = getDayRecord(date) || { completedHabits: {} };

  // 記録が編集可能かチェック（当日以外はロック）
  if (record.locked && !isToday(date)) {
    console.error("過去の記録は編集できません");
    return false;
  }

  // 習慣の完了状態を更新
  record.completedHabits = record.completedHabits || {};
  record.completedHabits[habit] = completed;
  record.updatedAt = new Date().toISOString();

  // 今日でない場合はロック
  if (!isToday(date) && !record.locked) {
    record.locked = true;
  }

  localStorage.setItem(recordKey, JSON.stringify(record));
  return true;
};

// 日付の記録をロック（編集不可に）
const lockDayRecord = (date) => {
  const recordKey = `record_${date}`;
  let record = getDayRecord(date);
  if (!record) return;

  record.locked = true;
  localStorage.setItem(recordKey, JSON.stringify(record));
};

export {
  formatDate,
  getTodayDate,
  isToday,
  getDayRecord,
  getAllRecords,
  saveHabitCompletion,
  lockDayRecord,
};
