import { DAY_OF_WEEK, REPEAT_TYPE } from "./routine";

export const DUMMY_ROUTINE = [ {
    "id": 1001,
    "status": "COMPLETED",
    "completed_at": "2026-07-16T08:05:00Z",
    "created_at": "2026-07-16T08:00:00Z",
    "updated_at": "2026-07-16T08:05:00Z",
    "schedule": {
      "id": 501,
      "start_time": "08:00",
      "end_time": "08:30",
      "interval": 1,
      "repeat_type": "DAILY",
      "day_of_week": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "created_at": "2026-01-15T00:00:00Z",
      "updated_at": "2026-01-15T00:00:00Z",
      "routine": {
        "id": 101,
        "title": "Take Morning Medication",
        "detail": "Take 1 pill of Blood Pressure medicine with water after breakfast",
        "notifications_enabled": true,
        "is_active": true,
        "created_at": "2026-01-15T00:00:00Z",
        "updated_at": "2026-01-15T00:00:00Z",
        "category": {
          "id": 1,
          "name": "Medication",
          "icon": "medical",
          "created_at": "2026-01-01T00:00:00Z",
          "updated_at": "2026-01-01T00:00:00Z"
        },
        "caregiver": {
          "id": 10,
          "name": "Sarah Jenkins",
          "role": "CareGiver",
          "created_at": "2026-01-01T00:00:00Z",
          "updated_at": "2026-01-01T00:00:00Z"
        },
        "carerecipient": {
          "id": 20,
          "name": "Robert Jenkins",
          "role": "CareRecipient",
          "created_at": "2026-01-01T00:00:00Z",
          "updated_at": "2026-01-01T00:00:00Z",
          "home_location_id": 301,
          "home_location": {
            "user_id": 20,
            "id": 301,
            "lat": -6.175392,
            "long": 106.827153,
            "display_name": "Central Jakarta, Indonesia",
            "created_at": "2026-01-01T00:00:00Z"
          },
          "last_location_id": 302,
          "last_location": {
            "user_id": 20,
            "id": 302,
            "lat": -6.175100,
            "long": 106.827000,
            "display_name": "Living Room",
            "created_at": "2026-07-16T08:00:00Z"
          },
          "radius": 500
        }
      }
    }
  },{
    "id": 1002,
    "status": "PENDING",
    "completed_at": "2026-07-16T08:05:00Z",
    "created_at": "2026-07-16T08:00:00Z",
    "updated_at": "2026-07-16T08:05:00Z",
    "schedule": {
      "id": 501,
      "start_time": "08:00",
      "end_time": "08:30",
      "interval": 1,
      "repeat_type": "DAILY",
      "day_of_week": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "created_at": "2026-01-15T00:00:00Z",
      "updated_at": "2026-01-15T00:00:00Z",
      "routine": {
        "id": 101,
        "title": "Take Morning Medication",
        "detail": "Take 1 pill of Blood Pressure medicine with water after breakfast",
        "notifications_enabled": true,
        "is_active": true,
        "created_at": "2026-01-15T00:00:00Z",
        "updated_at": "2026-01-15T00:00:00Z",
        "category": {
          "id": 1,
          "name": "Medication",
          "icon": "medical",
          "created_at": "2026-01-01T00:00:00Z",
          "updated_at": "2026-01-01T00:00:00Z"
        },
        "caregiver": {
          "id": 10,
          "name": "Sarah Jenkins",
          "role": "CareGiver",
          "created_at": "2026-01-01T00:00:00Z",
          "updated_at": "2026-01-01T00:00:00Z"
        },
        "carerecipient": {
          "id": 20,
          "name": "Robert Jenkins",
          "role": "CareRecipient",
          "created_at": "2026-01-01T00:00:00Z",
          "updated_at": "2026-01-01T00:00:00Z",
          "home_location_id": 301,
          "home_location": {
            "user_id": 20,
            "id": 301,
            "lat": -6.175392,
            "long": 106.827153,
            "display_name": "Central Jakarta, Indonesia",
            "created_at": "2026-01-01T00:00:00Z"
          },
          "last_location_id": 302,
          "last_location": {
            "user_id": 20,
            "id": 302,
            "lat": -6.175100,
            "long": 106.827000,
            "display_name": "Living Room",
            "created_at": "2026-07-16T08:00:00Z"
          },
          "radius": 500
        }
      }
    }
  },{
    "id": 1003,
    "status": "SKIPPED",
    "completed_at": "2026-07-16T08:05:00Z",
    "created_at": "2026-07-16T08:00:00Z",
    "updated_at": "2026-07-16T08:05:00Z",
    "schedule": {
      "id": 501,
      "start_time": "09:00",
      "end_time": "08:30",
      "interval": 1,
      "repeat_type": "DAILY",
      "day_of_week": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "created_at": "2026-01-15T00:00:00Z",
      "updated_at": "2026-01-15T00:00:00Z",
      "routine": {
        "id": 101,
        "title": "Take Morning Medication",
        "detail": "Take 1 pill of Blood Pressure medicine with water after breakfast",
        "notifications_enabled": true,
        "is_active": true,
        "created_at": "2026-01-15T00:00:00Z",
        "updated_at": "2026-01-15T00:00:00Z",
        "category": {
          "id": 1,
          "name": "Medication",
          "icon": "medical",
          "created_at": "2026-01-01T00:00:00Z",
          "updated_at": "2026-01-01T00:00:00Z"
        },
        "caregiver": {
          "id": 10,
          "name": "Sarah Jenkins",
          "role": "CareGiver",
          "created_at": "2026-01-01T00:00:00Z",
          "updated_at": "2026-01-01T00:00:00Z"
        },
        "carerecipient": {
          "id": 20,
          "name": "Robert Jenkins",
          "role": "CareRecipient",
          "created_at": "2026-01-01T00:00:00Z",
          "updated_at": "2026-01-01T00:00:00Z",
          "home_location_id": 301,
          "home_location": {
            "user_id": 20,
            "id": 301,
            "lat": -6.175392,
            "long": 106.827153,
            "display_name": "Central Jakarta, Indonesia",
            "created_at": "2026-01-01T00:00:00Z"
          },
          "last_location_id": 302,
          "last_location": {
            "user_id": 20,
            "id": 302,
            "lat": -6.175100,
            "long": 106.827000,
            "display_name": "Living Room",
            "created_at": "2026-07-16T08:00:00Z"
          },
          "radius": 500
        }
      }
    }
  },
];

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

      export const DUMMY_SCHEDULES = [
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