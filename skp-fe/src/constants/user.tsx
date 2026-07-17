export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export const USER_ROLE = {
  CAREGIVER: "CareGiver",
  CARE_RECIPIENT: "CareRecipient",
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