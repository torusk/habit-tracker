// Firestoreを使用して習慣データを管理するユーティリティ
import { db, auth } from '../firebase/config';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  getDocs,
  orderBy 
} from 'firebase/firestore';

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

// キャッシュ機能でパフォーマンス向上
const recordsCache = new Map();
let allRecordsCache = null;
let lastCacheUpdate = 0;
const CACHE_TTL = 60000; // 1分のキャッシュ有効期間

// 特定の日付の記録を取得
const getDayRecord = async (date) => {
  // ログインチェック
  if (!auth.currentUser) {
    // オフラインモードの場合はLocalStorageから取得
    const recordKey = `record_${date}`;
    const stored = localStorage.getItem(recordKey);
    return stored ? JSON.parse(stored) : null;
  }

  // キャッシュをチェック
  const cacheKey = `${auth.currentUser.uid}_${date}`;
  if (recordsCache.has(cacheKey) && (Date.now() - lastCacheUpdate < CACHE_TTL)) {
    return recordsCache.get(cacheKey);
  }

  try {
    const recordRef = doc(db, 'users', auth.currentUser.uid, 'records', date);
    const recordSnap = await getDoc(recordRef);
    
    if (recordSnap.exists()) {
      const data = recordSnap.data();
      // キャッシュに保存
      recordsCache.set(cacheKey, data);
      lastCacheUpdate = Date.now();
      return data;
    } else {
      // キャッシュに保存（nullも保存）
      recordsCache.set(cacheKey, null);
      lastCacheUpdate = Date.now();
      return null;
    }
  } catch (error) {
    console.error('記録の取得に失敗しました:', error);
    return null;
  }
};

// 同期バージョンのgetDayRecord（移行期間用）
const getDayRecordSync = (date) => {
  const recordKey = `record_${date}`;
  const stored = localStorage.getItem(recordKey);
  return stored ? JSON.parse(stored) : null;
};

// 全ての日付記録を取得
const getAllRecords = async () => {
  // ログインチェック
  if (!auth.currentUser) {
    // オフラインモードの場合はLocalStorageから取得
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
  }

  // キャッシュをチェック
  if (allRecordsCache && (Date.now() - lastCacheUpdate < CACHE_TTL)) {
    return allRecordsCache;
  }

  try {
    const recordsRef = collection(db, 'users', auth.currentUser.uid, 'records');
    const q = query(recordsRef, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const records = [];
    querySnapshot.forEach((doc) => {
      records.push({
        date: doc.id,
        ...doc.data()
      });
    });
    
    // キャッシュに保存
    allRecordsCache = records;
    lastCacheUpdate = Date.now();
    
    return records;
  } catch (error) {
    console.error('記録の取得に失敗しました:', error);
    return [];
  }
};

// 習慣の達成状態を記録
const saveHabitCompletion = async (date, habit, completed) => {
  // ログインチェック
  if (!auth.currentUser) {
    // オフラインモードの場合はLocalStorageに保存
    const recordKey = `record_${date}`;
    let record = getDayRecordSync(date) || { completedHabits: {} };

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
  }

  try {
    // 現在の記録を取得
    let record = await getDayRecord(date) || { completedHabits: {} };
    
    // 記録が編集可能かチェック（当日以外はロック）
    if (record.locked && !isToday(date)) {
      console.error("過去の記録は編集できません");
      return false;
    }

    // 習慣の完了状態を更新
    record.completedHabits = record.completedHabits || {};
    record.completedHabits[habit] = completed;
    record.date = date;
    record.updatedAt = new Date().toISOString();

    // 今日でない場合はロック
    if (!isToday(date) && !record.locked) {
      record.locked = true;
    }

    // Firestoreに保存
    const recordRef = doc(db, 'users', auth.currentUser.uid, 'records', date);
    await setDoc(recordRef, record);
    
    // キャッシュを更新
    const cacheKey = `${auth.currentUser.uid}_${date}`;
    recordsCache.set(cacheKey, record);
    allRecordsCache = null; // 全体キャッシュはクリア
    lastCacheUpdate = Date.now();
    
    return true;
  } catch (error) {
    console.error('記録の保存に失敗しました:', error);
    return false;
  }
};

// 日付の記録をロック（編集不可に）
const lockDayRecord = async (date) => {
  // ログインチェック
  if (!auth.currentUser) {
    // オフラインモードの場合はLocalStorageに保存
    const recordKey = `record_${date}`;
    let record = getDayRecordSync(date);
    if (!record) return;

    record.locked = true;
    localStorage.setItem(recordKey, JSON.stringify(record));
    return;
  }

  try {
    // 現在の記録を取得
    let record = await getDayRecord(date);
    if (!record) return;

    record.locked = true;
    
    // Firestoreに保存
    const recordRef = doc(db, 'users', auth.currentUser.uid, 'records', date);
    await setDoc(recordRef, record);
    
    // キャッシュを更新
    const cacheKey = `${auth.currentUser.uid}_${date}`;
    recordsCache.set(cacheKey, record);
    lastCacheUpdate = Date.now();
  } catch (error) {
    console.error('記録のロックに失敗しました:', error);
  }
};

// LocalStorageからFirestoreへデータを移行
const migrateLocalStorageToFirestore = async () => {
  // ログインしていない場合は何もしない
  if (!auth.currentUser) return;

  try {
    // LocalStorageからすべての記録を取得
    const records = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("record_")) {
        const date = key.replace("record_", "");
        const record = JSON.parse(localStorage.getItem(key));
        records.push({ date, ...record });
      }
    }

    // Firestoreに保存
    for (const record of records) {
      const { date, ...data } = record;
      const recordRef = doc(db, 'users', auth.currentUser.uid, 'records', date);
      await setDoc(recordRef, data);
    }

    console.log(`${records.length}件のデータを移行しました`);
    return true;
  } catch (error) {
    console.error('データ移行に失敗しました:', error);
    return false;
  }
};

export {
  formatDate,
  getTodayDate,
  isToday,
  getDayRecord,
  getAllRecords,
  saveHabitCompletion,
  lockDayRecord,
  migrateLocalStorageToFirestore,
  getDayRecordSync, // 移行期間用
};
