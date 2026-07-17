import { mutationOptions, queryOptions } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { RoutineApi, RoutinePayload, RoutineScheduleParams, RoutineScheduleResponse } from "../routine-api"

export function getRoutineCategoriesQueryOpt() {
  return queryOptions<RoutineScheduleResponse>({
    queryKey: ["routineApi", "getRoutineCategories"],
    queryFn: () => RoutineApi.getRoutineCategories(),
  })
}

export function createRoutineMutationOpt() {
  return mutationOptions<
    RoutineScheduleResponse,
    AxiosError<{ code: string; message: string }>,
    RoutinePayload
  >({
    mutationFn: (params) => RoutineApi.createRoutine(params),
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        return failureCount < 1
      }
      return false
    },
  })
}

export function updateRoutineMutationOpt() {
  return mutationOptions<
    RoutineScheduleResponse,
    AxiosError<{ code: string; message: string }>,
    RoutinePayload
  >({
    mutationFn: (params) => RoutineApi.updateRoutine(params),
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        return failureCount < 1
      }
      return false
    },
  })
}

export function getRoutinesQueryOpt() {
  return queryOptions<RoutineScheduleResponse>({
    queryKey: ["routineApi", "getRoutines"],
    queryFn: () => RoutineApi.getRoutines(),
  })
}

export function getRoutineSettingsQueryOpt() {
  return queryOptions<RoutineScheduleResponse>({
    queryKey: ["routineApi", "getRoutineSettings"],
    queryFn: () => RoutineApi.getRoutineSettings(),
  })
}

export function getRoutineScheduleListQueryOpt(param: RoutineScheduleParams) {
  return queryOptions<RoutineScheduleResponse>({
    queryKey: ["routineApi", "getRoutineScheduleList", param],
    queryFn: () => RoutineApi.getRoutineScheduleList(param),
  })
}
