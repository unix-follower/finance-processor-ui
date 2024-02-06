import SearchMode, { parseSearchMode } from "@/finProcessor/model/SearchMode"

describe("parseSearchMode", () => {
  it("should return all when value is all", () => {
    expect(parseSearchMode("all")).toBe(SearchMode.ALL)
  })

  it("should return range when value is range", () => {
    expect(parseSearchMode("range")).toBe(SearchMode.RANGE)
  })

  it("should return reverseRange when value is reverseRange", () => {
    expect(parseSearchMode("reverseRange")).toBe(SearchMode.REVERSE_RANGE)
  })

  it("should return reverseAll when value is reverseAll", () => {
    expect(parseSearchMode("reverseAll")).toBe(SearchMode.REVERSE_ALL)
  })

  it("should return prefixScan when value is prefixScan", () => {
    expect(parseSearchMode("prefixScan")).toBe(SearchMode.PREFIX_SCAN)
  })

  it("should return undefined when value is not a valid SearchMode", () => {
    expect(parseSearchMode("invalidValue")).toBeUndefined()
  })
})
