import StockPricePredictionResponse from "./model/StockPricePredictionResponse"
import ErrorCode from "./error/ErrorCode"
import FinProcessorError from "./error/FinProcessorError"

const finProcessorUrl = process.env.NEXT_PUBLIC_FIN_PROCESSOR_URL
if (!finProcessorUrl) {
  throw new Error("env variable NEXT_PUBLIC_FIN_PROCESSOR_URL is not set")
}

function executeCatching<T>(fn: () => Promise<T>) {
  try {
    return fn()
  } catch (error) {
    let errorCode = ErrorCode.UNKNOWN
    if (error instanceof TypeError) {
      errorCode = ErrorCode.CONNECTION_REFUSED
    }
    throw new FinProcessorError(errorCode, error)
  }
}

export interface FetchPredictionsParams {
  from?: string | undefined | null
  mode?: string | undefined | null
  to?: string | undefined | null
}

export async function fetchPredictions({
  from,
  mode,
  to,
}: FetchPredictionsParams): Promise<StockPricePredictionResponse[]> {
  const options = {
    method: "GET",
  }
  const paramsObject: any = {}
  if (from) {
    paramsObject.from = from
  }
  if (mode) {
    paramsObject.mode = mode
  }
  if (to) {
    paramsObject.to = to
  }

  let predictionsUrl = `${finProcessorUrl}/api/v1/predictions`
  if (from || mode || to) {
    const params = new URLSearchParams(paramsObject)
    predictionsUrl = `${predictionsUrl}?${params}`
  }
  const apiCall = async () => {
    const response = await fetch(predictionsUrl, options)
    return response.json()
  }
  return executeCatching(apiCall)
}
