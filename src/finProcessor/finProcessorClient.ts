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

function translateErrorCode(code: number) {
  switch (code) {
    case 1:
      return ErrorCode.NOT_FOUND
    default:
      return ErrorCode.UNKNOWN
  }
}

async function executeCatching(fn: () => Promise<Response>) {
  try {
    const response = await fn()
    if (!response.ok) {
      let errorCode = ErrorCode.UNKNOWN
      const responseBody = await response.json()
      const responseBodyErrorCode = responseBody["errorCode"]
      if (responseBodyErrorCode) {
        errorCode = translateErrorCode(responseBodyErrorCode)
      } else if (response.status === NOT_FOUND_HTTP_STATUS_CODE) {
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
  let paramsString: string | undefined

  let predictionsUrl = `${finProcessorUrl}/api/v1/predictions`

  if (mode) {
    paramsString = `mode=${mode.toString()}`
    switch (mode) {
      case SearchMode.RANGE:
      case SearchMode.REVERSE_RANGE:
        if (from) {
          paramsString += `&from=${from}`
        }

        if (to) {
          paramsString += `&to=${to}`
        }
        break
      case SearchMode.PREFIX_SCAN:
        if (prefix) {
          paramsString += `&prefix=${prefix}`
        }
    }

    const params = new URLSearchParams(paramsString)
    predictionsUrl = `${predictionsUrl}?${params}`
  }

  const apiCall = async () => fetch(predictionsUrl, options)
  return executeCatching(apiCall)
}

export async function fetchPredictionsByTicker({
  ticker,
  mode,
}: GetPredictionByTickerParams): Promise<StockPricePredictionResponse[]> {
  let url = `${finProcessorUrl}/api/v1/predictions/${ticker}`

  if (mode) {
    const params = new URLSearchParams(`mode=${mode}`)
    url = `${url}?${params}`
  }

  const options = {
    method: "GET",
  }
  const apiCall = async () => fetch(url, options)
  return executeCatching(apiCall)
}

export async function fetchTopPredictions(): Promise<
  StockPricePredictionResponse[]
> {
  const options = {
    method: "GET",
  }

  const predictionsUrl = `${finProcessorUrl}/api/v1/top/predictions`
  const apiCall = async () => fetch(predictionsUrl, options)
  return executeCatching(apiCall)
}

export async function fetchLossPredictions(): Promise<
  StockPricePredictionResponse[]
> {
  const options = {
    method: "GET",
  }

  const predictionsUrl = `${finProcessorUrl}/api/v1/loss/predictions`
  const apiCall = async () => fetch(predictionsUrl, options)
  return executeCatching(apiCall)
}
