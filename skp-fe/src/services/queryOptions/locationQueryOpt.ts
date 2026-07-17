import { mutationOptions, queryOptions } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { GeofenceDetailResponse, GeofencePayload, LocationApi } from "../location-api"

export function geofenceQueryOpt() {
  return queryOptions<GeofenceDetailResponse>({
    queryKey: ["locationApi", "geofence"],
    queryFn: () => LocationApi.getGeofence(),
  })
}

export function setGeofenceMutationOpt() {
  return mutationOptions<
    unknown,
    AxiosError<{ code: string; message: string }>,
    GeofencePayload
  >({
    mutationFn: (params) => LocationApi.setGeofence(params),
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        return failureCount < 1
      }
      return false
    },
  })
}

export function clearGeofenceMutationOpt() {
  return mutationOptions<
    unknown,
    AxiosError<{ code: string; message: string }>,
    void
  >({
    mutationFn: () => LocationApi.clearGeofence(),
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        return failureCount < 1
      }
      return false
    },
  })
}
