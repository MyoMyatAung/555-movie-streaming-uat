/**
 * Date helper functions for categorizing watch history
 */

export type DateCategory =
  | "Today"
  | "Yesterday"
  | "This Week"
  | "Last Week"
  | "This Month"
  | "Last Month"
  | "Older";

/**
 * Get the start of today (midnight)
 */
export function getStartOfToday(): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Get the start of yesterday
 */
export function getStartOfYesterday(): Date {
  const date = getStartOfToday();
  date.setDate(date.getDate() - 1);
  return date;
}

/**
 * Get the start of this week (Monday)
 */
export function getStartOfThisWeek(): Date {
  const date = getStartOfToday();
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Adjust for Sunday (0) and Monday (1)
  date.setDate(date.getDate() + diff);
  return date;
}

/**
 * Get the start of last week
 */
export function getStartOfLastWeek(): Date {
  const date = getStartOfThisWeek();
  date.setDate(date.getDate() - 7);
  return date;
}

/**
 * Get the start of this month
 */
export function getStartOfThisMonth(): Date {
  const date = new Date();
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Get the start of last month
 */
export function getStartOfLastMonth(): Date {
  const date = getStartOfThisMonth();
  date.setMonth(date.getMonth() - 1);
  return date;
}

/**
 * Categorize a date into a time period
 */
export function categorizeDateByPeriod(date: Date): DateCategory {
  const startOfToday = getStartOfToday();
  const startOfYesterday = getStartOfYesterday();
  const startOfThisWeek = getStartOfThisWeek();
  const startOfLastWeek = getStartOfLastWeek();
  const startOfThisMonth = getStartOfThisMonth();
  const startOfLastMonth = getStartOfLastMonth();

  if (date >= startOfToday) {
    return "Today";
  } else if (date >= startOfYesterday && date < startOfToday) {
    return "Yesterday";
  } else if (date >= startOfThisWeek && date < startOfYesterday) {
    return "This Week";
  } else if (date >= startOfLastWeek && date < startOfThisWeek) {
    return "Last Week";
  } else if (date >= startOfThisMonth && date < startOfLastWeek) {
    return "This Month";
  } else if (date >= startOfLastMonth && date < startOfThisMonth) {
    return "Last Month";
  } else {
    return "Older";
  }
}

/**
 * Group items by date category
 */
export function groupByDateCategory<T extends { updated_at: Date }>(
  items: T[],
): Map<DateCategory, T[]> {
  const grouped = new Map<DateCategory, T[]>();

  // Initialize all categories
  const categories: DateCategory[] = [
    "Today",
    "Yesterday",
    "This Week",
    "Last Week",
    "This Month",
    "Last Month",
    "Older",
  ];

  categories.forEach((category) => {
    grouped.set(category, []);
  });

  // Group items
  items.forEach((item) => {
    const category = categorizeDateByPeriod(item.updated_at);
    grouped.get(category)?.push(item);
  });

  return grouped;
}

/**
 * Format relative time for display
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return "Just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  } else {
    return date.toLocaleDateString();
  }
}
