export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export const USER_ROLE = {
  CAREGIVER: "caregiver",
  CARE_RECIPIENT: "carerecipient",
}

export const USER_FONT_CAREGIVER = {
  SMALL: "text-sm",
  LARGE: "text-base",
  SUPER_LARGE: "text-xl",
}

export const USER_FONT_CARERECIPIENT = {
  SMALL: "text-base",
  LARGE: "text-lg",
  SUPER_LARGE: "text-2xl",
}