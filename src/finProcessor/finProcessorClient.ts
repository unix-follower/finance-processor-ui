import StockPricePredictionResponse from "./model/StockPricePredictionResponse"
import GetPredictionsParams from "./model/GetPredictionsParams"
import GetPredictionByTickerParams from "./model/GetPredictionsByTickerParams"
import ErrorCode from "./error/ErrorCode"
import FinProcessorError from "./error/FinProcessorError"
import SearchMode from "./model/SearchMode"

const finProcessorUrl = process.env.NEXT_PUBLIC_FIN_PROCESSOR_URL
if (!finProcessorUrl) {
  throw new Error("env variable NEXT_PUBLIC_FIN_PROCESSOR_URL is not set")
}

const NOT_FOUND_HTTP_STATUS_CODE = 404

async function executeCatching(fn: () => Promise<Response>) {
  try {
    const response = await fn()
    if (!response.ok) {
      let errorCode = ErrorCode.UNKNOWN
      if (response.status === NOT_FOUND_HTTP_STATUS_CODE) {
        errorCode = ErrorCode.NOT_FOUND
      }
      throw new FinProcessorError(errorCode, response)
    }
    return response.json()
  } catch (error) {
    if (error instanceof FinProcessorError) {
      throw error
    } else {
      let errorCode = ErrorCode.UNKNOWN
      if (error instanceof TypeError) {
        errorCode = ErrorCode.CONNECTION_REFUSED
      }
      throw new FinProcessorError(errorCode, undefined, error)
    }
  }
}

export async function fetchPredictions({
  from,
  mode,
  to,
  prefix,
}: GetPredictionsParams): Promise<StockPricePredictionResponse[]> {
  const options = {
    method: "GET",
  }
  const paramsObject: any = {}

  if (mode) {
    paramsObject.mode = mode

    switch (mode) {
      case (SearchMode.RANGE, SearchMode.REVERSE_RANGE):
        if (from) {
          paramsObject.from = from
        }

        if (to) {
          paramsObject.to = to
        }
        break
      case SearchMode.PREFIX_SCAN:
        if (prefix) {
          paramsObject.prefix = prefix
        }
    }
  }

  let predictionsUrl = `${finProcessorUrl}/api/v1/predictions`
  if (mode) {
    const params = new URLSearchParams(paramsObject)
    predictionsUrl = `${predictionsUrl}?${params}`
  }
  const apiCall = async () => fetch(predictionsUrl, options)
  return executeCatching(apiCall)
}

export async function fetchPredictionsByTicker({
  ticker,
  mode,
}: GetPredictionByTickerParams): Promise<StockPricePredictionResponse[]> {
  const options = {
    method: "GET",
  }
  const paramsObject: any = {}

  if (mode) {
    paramsObject.mode = mode
  }

  let url = `${finProcessorUrl}/api/v1/predictions/${ticker}`
  if (mode) {
    const params = new URLSearchParams(paramsObject)
    url = `${url}?${params}`
  }
  const apiCall = async () => fetch(url, options)
  return executeCatching(apiCall)
}
