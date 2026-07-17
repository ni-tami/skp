import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";

export const DASHBOARD_SECTIONS = [
  {
    id: "routines",
    title: "Routines",
    subtitle: "Manage reusable routines",
    icon: "list-circle-outline" as const,
    color: "#2563EB",
    bgColor: "#EFF6FF",
    route: "/routine/caregiver/routine/list",
  },
  {
    id: "schedules",
    title: "Routine Settings",
    subtitle: "Set up schedules of the routines",
    icon: "calendar-outline" as const,
    color: "#059669",
    bgColor: "#ECFDF5",
    route: "/routine/caregiver/setting/list",
  },
  {
    id: "entries",
    title: "Routine Schedule",
    subtitle: "Track completion status and timestamps",
    icon: "checkmark-done-circle-outline" as const,
    color: "#7C3AED",
    bgColor: "#F5F3FF",
    route: "/routine/schedule",
  },
];

export const CATEGORY_ICON_MAPPING = {
  "2": {
    icon: "medkit-outline",
    color: "#6B7280"
  }
}

export interface RoutineStatusItem {
  name: string;
  color: string;
  bgColor: string;
  icon: IconName;
  hex: string;
}

export const ROUTINE_STATUS: Record<string, RoutineStatusItem> = {
    SKIPPED: {
        name: "Skipped",
        color: "text-red-600",
        bgColor: "bg-red-50",
        icon: "close-circle",
        hex: "#dc2626"
    },
    COMPLETED: {
        name: "Completed",
        color: "text-green-600",
        bgColor: "bg-green-50",
        icon: "checkmark-circle",
        hex: "#16a34a"
    },
    PENDING: {
        name: "Pending",
        color: "text-gray-500",
        bgColor: "bg-gray-50",
        icon: "pause-circle",
        hex: "#9ca3af"
    },
}

export type RepeatType = (typeof REPEAT_TYPE)[keyof typeof REPEAT_TYPE];

export const REPEAT_TYPE = {
  ONCE: "Once",
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  CUSTOM: "Custom",
}

export type DayOfWeek = (typeof DAY_OF_WEEK)[keyof typeof DAY_OF_WEEK];

export const DAY_OF_WEEK = {
  SUNDAY: "Sunday",
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
}

export type IconName = ComponentProps<typeof Ionicons>["name"];