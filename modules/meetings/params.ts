import { DEFAULT_PAGE } from "@/constant"
import { parseAsInteger, parseAsString, createLoader, parseAsStringEnum } from "nuqs/server"
import { MeetingStatus } from "./types"

// use this for server components to read the query params
export const filtersSearchParams = {
  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({ clearOnDefault: true }),
  agentId: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  status: parseAsStringEnum(Object.values(MeetingStatus))
}

export const loadSearchParams = createLoader(filtersSearchParams)
