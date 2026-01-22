/**
 * 日期工具函数库
 */

/**
 * 获取指定月份的所有天数
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * 获取指定月份第一天是星期几 (0 = 周日, 6 = 周六)
 */
export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/**
 * 格式化日期为 YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * 获取当前日期的 YYYY-MM-DD 格式
 */
export function getTodayString(): string {
  return formatDate(new Date());
}

/**
 * 比较两个日期是否相同 (仅比较年月日)
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * 获取指定月份的日历数据
 * 返回一个二维数组，每个子数组代表一周
 * 其他月份的日期用 0 表示
 */
export function getCalendarDays(year: number, month: number): number[][] {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const calendar: number[][] = [];
  let week: number[] = new Array(firstDay).fill(0);

  for (let day = 1; day <= daysInMonth; day++) {
    week.push(day);
    if (week.length === 7) {
      calendar.push(week);
      week = [];
    }
  }

  // 填充最后一周
  if (week.length > 0) {
    while (week.length < 7) {
      week.push(0);
    }
    calendar.push(week);
  }

  return calendar;
}

/**
 * 获取月份的显示名称
 */
export function getMonthName(month: number): string {
  const months = [
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月",
  ];
  return months[month];
}

/**
 * 获取星期名称
 */
export function getWeekdayName(weekday: number): string {
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  return weekdays[weekday];
}
