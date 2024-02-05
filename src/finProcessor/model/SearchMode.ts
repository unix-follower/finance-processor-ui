enum SearchMode {
  ALL = "all",
  RANGE = "range",
  REVERSE_RANGE = "reverseRange",
  REVERSE_ALL = "reverseAll",
  PREFIX_SCAN = "prefixScan",
}

const ARRAY_1ST_INDEX = 0

export function parseSearchMode(value: string) {
  const result = Object.values(SearchMode).filter(
    (enumValue) => enumValue === value,
  )
  return result[ARRAY_1ST_INDEX] as SearchMode
}

export default SearchMode
