import { queryOptions } from "@tanstack/react-query";
import { MapboxApi, MapboxParams } from "../mapbox-api";

export function detailMapQueryOpt(params: MapboxParams) {
  return queryOptions<{ data: any }>({
    queryKey: ['mapBoxApi', params],
    queryFn: () => MapboxApi.getMapData(params),
    enabled: !!(params.latitude && params.longitude),
  })
}

