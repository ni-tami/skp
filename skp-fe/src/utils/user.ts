import { USER_FONT_CAREGIVER, USER_FONT_CARERECIPIENT, USER_ROLE } from "@/constants/user";
import { useAuthStore } from "@/stores/auth-store";


export function getUserRole() {
  return useAuthStore((state) => state.user)?.role;
}

export function getIsCaregiver() {
    return getUserRole() === USER_ROLE.CAREGIVER;
}

export function getUserFont() {
    return getIsCaregiver() ? USER_FONT_CAREGIVER : USER_FONT_CARERECIPIENT;
}