import SearchMode from "./SearchMode"

export default interface GetPredictionsParams {
  from?: string | undefined | null
  mode?: SearchMode | undefined | null
  to?: string | undefined | null
  prefix?: string | undefined | null
}
