import { mutationOptions, queryOptions } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { ConnectApi, ConnectResponse, GenerateCodeResponse } from "../connect-api"

export function connectionQueryOpt() {
  return queryOptions<ConnectResponse[]>({
    queryKey: ["connectApi", "connection"],
    queryFn: () => ConnectApi.getConnection(),
  })
}

export function generateCodeMutationOpt() {
  return mutationOptions<
    GenerateCodeResponse,
    AxiosError<{ code: string; message: string }>,
    void
  >({
    mutationFn: () => ConnectApi.generateCode(),
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        return failureCount < 1
      }
      return false
    },
  })
}

export function acceptCodeMutationOpt() {
  return mutationOptions<
    ConnectResponse,
    AxiosError<{ code: string; message: string }>,
    string
  >({
    mutationFn: (code) => ConnectApi.acceptCode(code),
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        return failureCount < 1
      }
      return false
    },
  })
}

export function deleteConnectionMutationOpt() {
  return mutationOptions<
    unknown,
    AxiosError<{ code: string; message: string }>,
    number
  >({
    mutationFn: (connectionId) => ConnectApi.deleteConnection(connectionId),
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        return failureCount < 1
      }
      return false
    },
  })
}
