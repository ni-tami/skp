import { mutationOptions } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { AuthApi, LoginPayload, LoginResponse, SignUpPayload } from "../auth-api"
import { useAuthStore } from "@/stores/auth-store"
import { setStoredSession } from "@/lib/token-storage"

export function loginMutationOpt() {
  return mutationOptions<
    LoginResponse,
    AxiosError<{ code: string; message: string }>,
    LoginPayload
  >({
    mutationFn: (params) => AuthApi.login(params),
    onSuccess: async (data) => {
      useAuthStore.getState().setAuth(data.access_token, data.user)
      await setStoredSession({ token: data.access_token, user: data.user })
    },
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        return failureCount < 1
      }
      return false
    },
  })
}

export function signUpMutationOpt() {
  return mutationOptions<
    unknown,
    AxiosError<{ code: string; message: string }>,
    SignUpPayload
  >({
    mutationFn: (params) => AuthApi.signUp(params),
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        return failureCount < 1
      }
      return false
    },
  })
}
