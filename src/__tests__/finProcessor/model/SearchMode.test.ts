import SearchMode, { parseSearchMode } from "@/finProcessor/model/SearchMode"

describe("parseSearchMode", () => {
  it("should return all when value is all", () => {
    // given
    const mode = "all"

    // when
    const result = parseSearchMode(mode)

    // then
    expect(result).toBe(SearchMode.ALL)
  })

  it("should return range when value is range", () => {
    // given
    const mode = "range"

    // when
    const result = parseSearchMode(mode)

    // then
    expect(result).toBe(SearchMode.RANGE)
  })

  it("should return reverseRange when value is reverseRange", () => {
    // given
    const mode = "reverseRange"

    // when
    const result = parseSearchMode(mode)

    // then
    expect(result).toBe(SearchMode.REVERSE_RANGE)
  })

  it("should return reverseAll when value is reverseAll", () => {
    // given
    const mode = "reverseAll"

    // when
    const result = parseSearchMode(mode)

    // then
    expect(result).toBe(SearchMode.REVERSE_ALL)
  })

  it("should return prefixScan when value is prefixScan", () => {
    // given
    const mode = "prefixScan"

    // when
    const result = parseSearchMode(mode)

    // then
    expect(result).toBe(SearchMode.PREFIX_SCAN)
  })

  it("should return undefined when value is not a valid SearchMode", () => {
    // given
    const mode = "invalidValue"

    // when
    const result = parseSearchMode(mode)

    // then
    expect(result).toBeUndefined()
  })
})
