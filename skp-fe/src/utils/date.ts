export interface DateItem {
  dateString: string;
  dayName: string;
  dayNumber: string;
  fullFormattedDate: string;
  isToday: boolean;
}

export function formatToLocalDateString(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayString(): string {
  return formatToLocalDateString(new Date());
}

export function createDateItem(date: Date): DateItem {
  const dateString = formatToLocalDateString(date);
  return {
    dateString,
    dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
    dayNumber: date.getDate().toString(),
    fullFormattedDate: date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    isToday: dateString === getTodayString(),
  };
}

export function generateInitialDates(pastDays = 7, futureDays = 14): DateItem[] {
  const dates: DateItem[] = [];
  const today = new Date();

  for (let i = -pastDays; i <= futureDays; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);
    dates.push(createDateItem(d));
  }

  return dates;
}

export function getDateWithTime(date: string): Date {
  return new Date(date + 'T00:00:00');
}