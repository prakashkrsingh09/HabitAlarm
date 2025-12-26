import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Activity = {
  id: string;
  title: string;
  startDate: string;
  endDate?: string;
  reminderHour: number;
  reminderMinute: number;
  notificationId?: string;
  completion: Record<string, boolean>;
};

type CreateActivityInput = {
  id?: string;
  title: string;
  startDate: string;
  endDate?: string;
  reminderHour: number;
  reminderMinute: number;
  notificationId?: string;
  frequency: string;
};

type ActivityStore = {
  activities: Activity[];
  hasHydrated: boolean;

  addActivity: (input: CreateActivityInput) => void;
  markCompleted: (activityId: string, date: string) => void;
  setHydrated: () => void;
  deteleActivity: (activityId: string) => void;
  updateActivity: (
    activityId: string,
    input: Partial<CreateActivityInput>,
  ) => void;
};

export const useActivityStore = create<ActivityStore>()(
  persist(
    set => ({
      activities: [],
      deteleActivity: activityId => {
        set(state => ({
          activities: state.activities.filter(a => a.id !== activityId),
        }));
      },
      hasHydrated: false,

      setHydrated: () => set({ hasHydrated: true }),
      updateActivity(activityId, input) {
        set(state => ({
          activities: state.activities.map(a => {
            if (a.id !== activityId) return a;
            return {
              ...a,
              ...input,
            };
          }),
        }));
      },
      addActivity: input =>
        set(state => ({
          activities: [
            ...state.activities,
            {
              id: Date.now().toString(),
              completion: {},
              ...input,
            },
          ].reverse(),
        })),

      markCompleted: (activityId, date) =>
        set(state => ({
          activities: state.activities.map(a => {
            if (a.id !== activityId) return a;
            if (date < a.startDate) return a;
            if (a.endDate && date > a.endDate) return a;
            if (a.completion[date]) return a;

            return {
              ...a,
              completion: {
                ...a.completion,
                [date]: true,
              },
            };
          }),
        })),
    }),
    {
      name: 'activity-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => state => {
        state?.setHydrated();
      },
    },
  ),
);
