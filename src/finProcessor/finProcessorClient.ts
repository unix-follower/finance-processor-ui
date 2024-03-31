import StockPricePredictionResponse from "./model/StockPricePredictionResponse"
import GetPredictionsParams from "./model/GetPredictionsParams"
import ErrorCode from "./error/ErrorCode"
import FinProcessorError from "./error/FinProcessorError"
import SearchMode from "./model/SearchMode"

function getBackendURL() {
  const finProcessorUrl = process.env.NEXT_PUBLIC_FIN_PROCESSOR_URL
  if (!finProcessorUrl) {
    throw new Error("env variable NEXT_PUBLIC_FIN_PROCESSOR_URL is not set")
  }
  return finProcessorUrl
}

function translateErrorCode(code: number) {
  const index = Object.values(ErrorCode).indexOf(code)
  let errorCode = ErrorCode.UNKNOWN
  if (index >= 0) {
    errorCode = Object.values(ErrorCode)[index] as ErrorCode
  }
  return errorCode
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
      }
      return Promise.reject(new FinProcessorError(errorCode, response))
    }
    return response.json()
  } catch (error) {
    let errorCode = ErrorCode.UNKNOWN
    if (error instanceof TypeError) {
      errorCode = ErrorCode.CONNECTION_REFUSED
    }
    throw new FinProcessorError(errorCode, undefined, error)
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

  let predictionsUrl = `${getBackendURL()}/api/v1/predictions`

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

export async function fetchPredictionByTicker(
  ticker: string,
): Promise<StockPricePredictionResponse[]> {
  const url = `${getBackendURL()}/api/v1/predictions/${ticker}`

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

  const predictionsUrl = `${getBackendURL()}/api/v1/top/predictions`
  const apiCall = async () => fetch(predictionsUrl, options)
  return executeCatching(apiCall)
}

export async function fetchLossPredictions(): Promise<
  StockPricePredictionResponse[]
> {
  const options = {
    method: "GET",
  }

  const predictionsUrl = `${getBackendURL()}/api/v1/loss/predictions`
  const apiCall = async () => fetch(predictionsUrl, options)
  return executeCatching(apiCall)
}
