export type Activity = {
  id: string;
  title: string;
  startDate: string;   // YYYY-MM-DD
  endDate: string;     // YYYY-MM-DD
  reminderHour: number;
  reminderMinute: number;
  notificationId?: string;
  completion: Record<string, boolean>; // date -> completed
};
9