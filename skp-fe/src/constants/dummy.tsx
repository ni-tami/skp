import { DAY_OF_WEEK, REPEAT_TYPE } from "./routine";

export const DUMMY_ROUTINE = [{"care_recipient_id": 8, "caregiver_id": 15, "category_id": 1, "created_at": "2026-07-17T07:46:53.390119", "deleted_at": null, "detail": "3x sehari", "id": 1, "is_active": true, "notifications_enabled": true, "title": "Minum Obat", "updated_at": "2026-07-17T07:46:53.390119"}, {"care_recipient_id": 8, "caregiver_id": 15, "category_id": 2, "created_at": "2026-07-17T07:47:35.808596", "deleted_at": null, "detail": "3x sehari", "id": 2, "is_active": true, "notifications_enabled": true, "title": "Exercise", "updated_at": "2026-07-17T07:47:35.808596"}];

export const DUMMY_USER =  [
          { id: 101, name: "Eleanor Vance"},
          { id: 102, name: "Arthur Pendelton" },
          { id: 103, name: "Clara Oswald" },
          { id: 104, name: "George Bailey" },
        ];

export const DUMMY_CATEGORIES = [
        { id: 1, name: 'Medication', icon: 'medkit', variant: 'success' },
        { id: 2, name: 'Hygiene', icon: 'water', variant: 'primary' },
        { id: 3, name: 'Meal & Nutrition', icon: 'restaurant', variant: 'warning' },
        { id: 4, name: 'Activity', icon: 'walk', variant: 'success' },
        { id: 5, name: 'Physical Therapy', icon: 'fitness', variant: 'success' },
        { id: 6, name: 'Vital Check', icon: 'pulse', variant: 'success' },
      ];


      export const DUMMY_SETTINGS = [
                {
                  id: 201,
                  routine: {
                    id: 10,
                    title: "Morning Medication",
                    detail: "Take 1 pill after breakfast",
                    carerecipient: { id: 101, name: "Eleanor Vance" },
                  } as any,
                  start_time: "08:00",
                  end_time: "09:00",
                  interval: 30,
                  repeat_type: REPEAT_TYPE.DAILY,
                  day_of_week: [],
                  created_at: "",
                  updated_at: "",
                },
                {
                  id: 202,
                  routine: {
                    id: 11,
                    title: "Afternoon Walk",
                    detail: "30 mins light walking in garden",
                    carerecipient: { id: 102, name: "Arthur Pendelton" },
                  } as any,
                  start_time: "16:00",
                  end_time: "17:00",
                  interval: 60,
                  repeat_type: REPEAT_TYPE.WEEKLY,
                  day_of_week: [DAY_OF_WEEK.MONDAY, DAY_OF_WEEK.WEDNESDAY, DAY_OF_WEEK.FRIDAY],
                  created_at: "",
                  updated_at: "",
                },
              ];


      export const DUMMY_SCHEDULES: RoutineSchedule[] = [
  {
    id: 1,
    status: "PENDING",
    completed_at: "",
    created_at: "2026-07-17T08:00:00Z",
    updated_at: "2026-07-17T08:00:00Z",
    setting: {
      id: 101,
      start_time: "08:00",
      end_time: "09:00",
      interval: 30,
      repeat_type: REPEAT_TYPE.DAILY,
      day_of_week: [],
      created_at: "2026-07-17T08:00:00Z",
      updated_at: "2026-07-17T08:00:00Z",
      routine: {
        id: 10,
        title: "Morning Medication",
        detail: "Take 1 pill after breakfast with a full glass of water.",
        is_active: true,
        notifications_enabled: true,
        carerecipient: {
          id: 1,
          name: "Eleanor Vance",
          email: "eleanor@example.com",
        },
        category: {
          id: 1,
          name: "Medication",
        },
      },
    },
  },
  {
    id: 2,
    status: "COMPLETED",
    completed_at: "2026-07-17T08:15:00Z",
    created_at: "2026-07-17T08:00:00Z",
    updated_at: "2026-07-17T08:15:00Z",
    setting: {
      id: 102,
      start_time: "08:00", // Same start_time as item 1 to test hidden time badge behavior
      end_time: "08:30",
      interval: 15,
      repeat_type: REPEAT_TYPE.DAILY,
      day_of_week: [],
      created_at: "2026-07-17T08:00:00Z",
      updated_at: "2026-07-17T08:00:00Z",
      routine: {
        id: 11,
        title: "Blood Pressure Check",
        detail: "Log blood pressure reading into the app.",
        is_active: true,
        notifications_enabled: true,
        carerecipient: {
          id: 1,
          name: "Eleanor Vance",
          email: "eleanor@example.com",
        },
        category: {
          id: 2,
          name: "Vital Check",
        },
      },
    },
  },
  {
    id: 3,
    status: "PENDING",
    completed_at: "",
    created_at: "2026-07-17T08:00:00Z",
    updated_at: "2026-07-17T08:00:00Z",
    setting: {
      id: 103,
      start_time: "16:00", // Different start_time to test showing the time badge
      end_time: "17:00",
      interval: 60,
      repeat_type: REPEAT_TYPE.WEEKLY,
      day_of_week: [DAY_OF_WEEK.MONDAY, DAY_OF_WEEK.WEDNESDAY, DAY_OF_WEEK.FRIDAY],
      created_at: "2026-07-17T08:00:00Z",
      updated_at: "2026-07-17T08:00:00Z",
      routine: {
        id: 12,
        title: "Afternoon Walk",
        detail: "30 minutes of light walking in the garden.",
        is_active: true,
        notifications_enabled: false,
        carerecipient: {
          id: 2,
          name: "Arthur Pendelton",
          email: "arthur@example.com",
        },
        category: {
          id: 3,
          name: "Activity",
        },
      },
    },
  },
];

              export const DUMMY_ROUTINES = [
  {
    id: 10,
    title: "Morning Medication",
    detail: "Take 1 pill after meal",
    category: { id: 1, name: "Medication", icon: "medkit", created_at: "", updated_at: "" }, // 👈 Tambahkan ini
    carerecipient: { id: 101, name: "Eleanor Vance", email: "eleanor@example.com" },
  },
  {
    id: 11,
    title: "Afternoon Walk",
    detail: "30 mins light exercise",
    category: { id: 4, name: "Activity", icon: "walk", created_at: "", updated_at: "" },
    carerecipient: { id: 102, name: "Arthur Pendelton", email: "arthur@example.com" },
  },
  {
    id: 12,
    title: "Blood Pressure Check",
    detail: "Log reading in app",
    category: { id: 6, name: "Vital Check", icon: "pulse", created_at: "", updated_at: "" },
    carerecipient: { id: 101, name: "Eleanor Vance", email: "eleanor@example.com" },
  }
];