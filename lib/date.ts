/**
 * 日付操作ユーティリティ関数
 * 日本時間（JST）で統一して処理
 */

/**
 * 日付を表示用フォーマットに変換
 * YYYY-MM-DD → YYYY年MM月DD日
 */
export function formatDate(date: string): string {
  const [year, month, day] = date.split("-");
  return `${year}年${parseInt(month)}月${parseInt(day)}日`;
}

/**
 * 今日の日付をYYYY-MM-DD形式で取得（日本時間）
 */
export function getToday(): string {
  const now = new Date();
  const jstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000); // UTC+9
  const year = jstDate.getUTCFullYear();
  const month = String(jstDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(jstDate.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * DateオブジェクトをYYYY-MM-DD形式の文字列に変換（日本時間）
 */
export function getJapaneseDate(date: Date): string {
  const jstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000); // UTC+9
  const year = jstDate.getUTCFullYear();
  const month = String(jstDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(jstDate.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * YYYY-MM-DD形式の文字列をDateオブジェクトに変換（日本時間）
 */
export function parseDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  // 日本時間のDateオブジェクトを作成
  const date = new Date(Date.UTC(year, month - 1, day));
  // UTC+9のオフセットを考慮
  return new Date(date.getTime() - 9 * 60 * 60 * 1000);
}

/**
 * 指定された年月の開始日と終了日を取得
 */
export function getMonthRange(year: number, month: number): {
  startDate: string;
  endDate: string;
} {
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, "0")}-${String(
    lastDay
  ).padStart(2, "0")}`;
  return { startDate, endDate };
}

/**
 * 指定された日付の週の開始日（日曜日）と終了日（土曜日）を取得
 */
export function getWeekRange(date: string): {
  startDate: string;
  endDate: string;
} {
  const dateObj = parseDate(date);
  const dayOfWeek = dateObj.getDay(); // 0 (日曜日) ～ 6 (土曜日)

  // 週の開始日（日曜日）を計算
  const startDateObj = new Date(dateObj);
  startDateObj.setDate(dateObj.getDate() - dayOfWeek);
  const startDate = getJapaneseDate(startDateObj);

  // 週の終了日（土曜日）を計算
  const endDateObj = new Date(dateObj);
  endDateObj.setDate(dateObj.getDate() + (6 - dayOfWeek));
  const endDate = getJapaneseDate(endDateObj);

  return { startDate, endDate };
}

/**
 * 日付文字列が有効なYYYY-MM-DD形式かチェック
 */
export function isValidDate(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) {
    return false;
  }

  const date = parseDate(dateString);
  return !isNaN(date.getTime());
}

/**
 * 2つの日付の差分日数を計算
 */
export function getDaysDifference(date1: string, date2: string): number {
  const d1 = parseDate(date1);
  const d2 = parseDate(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

