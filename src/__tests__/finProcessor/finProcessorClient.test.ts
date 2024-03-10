import * as finProcessorClient from "@/finProcessor/finProcessorClient"
import SearchMode from "@/finProcessor/model/SearchMode"
import * as factory from "./model/stockPricePredictionResponseFactory"
import StockPricePredictionResponse from "@/finProcessor/model/StockPricePredictionResponse"
import ErrorCode from "@/finProcessor/error/ErrorCode"
import FinProcessorError from "@/finProcessor/error/FinProcessorError"

describe("finProcessorClient", () => {
  const ORIGINAL_ENV = process.env

  const FIN_PROCESSOR_URL = "http://localhost:8080"
  const PREDICTIONS_URL = `${FIN_PROCESSOR_URL}/api/v1/predictions`
  const getMethodOptions = {
    method: "GET",
  }

  beforeEach(() => {
    jest.resetModules()
    process.env = {
      ...ORIGINAL_ENV,
      NEXT_PUBLIC_FIN_PROCESSOR_URL: FIN_PROCESSOR_URL,
    }
  })

  afterAll(() => {
    process.env = ORIGINAL_ENV
  })

  function setupFetchMock(responseBody: StockPricePredictionResponse[]) {
    const fetchMock = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(responseBody),
      }),
    )
    global.fetch = fetchMock as jest.Mock
    return fetchMock
  }

  it("test fetchPredictions with search mode = all", async () => {
    // given
    const voo = factory.createVOO20240221()
    const fetchMock = setupFetchMock([voo])

    // when
    const searchResult = await finProcessorClient.fetchPredictions({
      mode: SearchMode.ALL,
    })

    // then
    expect(searchResult).toHaveLength(1)
    const [vooActual] = searchResult
    expect(vooActual).toStrictEqual(voo)

    const expectedUrl = `${PREDICTIONS_URL}?mode=all`
    expect(fetchMock).toHaveBeenCalledWith(expectedUrl, getMethodOptions)
  })

  it("test fetchPredictions with search mode = range and without from and to", async () => {
    // given
    const voo = factory.createVOO20240221()
    const fetchMock = setupFetchMock([voo])

    // when
    const searchResult = await finProcessorClient.fetchPredictions({
      mode: SearchMode.RANGE,
    })

    // then
    expect(searchResult).toHaveLength(1)
    const [vooActual] = searchResult
    expect(vooActual).toStrictEqual(voo)

    const expectedUrl = `${PREDICTIONS_URL}?mode=range`
    expect(fetchMock).toHaveBeenCalledWith(expectedUrl, getMethodOptions)
  })

  it("test fetchPredictions with search mode = range", async () => {
    // given
    const voo = factory.createVOO20240221()
    const fetchMock = setupFetchMock([voo])

    // when
    const searchResult = await finProcessorClient.fetchPredictions({
      mode: SearchMode.RANGE,
      from: "A",
      to: "C",
    })

    // then
    expect(searchResult).toHaveLength(1)
    const [vooActual] = searchResult
    expect(vooActual).toStrictEqual(voo)

    const expectedUrl = `${PREDICTIONS_URL}?mode=range&from=A&to=C`
    expect(fetchMock).toHaveBeenCalledWith(expectedUrl, getMethodOptions)
  })

  it("test fetchPredictions with search mode = reverseRange and without from and to", async () => {
    // given
    const voo = factory.createVOO20240221()
    const fetchMock = setupFetchMock([voo])

    // when
    const searchResult = await finProcessorClient.fetchPredictions({
      mode: SearchMode.REVERSE_RANGE,
    })

    // then
    expect(searchResult).toHaveLength(1)
    const [vooActual] = searchResult
    expect(vooActual).toStrictEqual(voo)

    const expectedUrl = `${PREDICTIONS_URL}?mode=reverseRange`
    expect(fetchMock).toHaveBeenCalledWith(expectedUrl, getMethodOptions)
  })

  it("test fetchPredictions with search mode = reverseRange", async () => {
    // given
    const voo = factory.createVOO20240221()
    const fetchMock = setupFetchMock([voo])

    // when
    const searchResult = await finProcessorClient.fetchPredictions({
      mode: SearchMode.REVERSE_RANGE,
      from: "A",
      to: "C",
    })

    // then
    expect(searchResult).toHaveLength(1)
    const [vooActual] = searchResult
    expect(vooActual).toStrictEqual(voo)

    const expectedUrl = `${PREDICTIONS_URL}?mode=reverseRange&from=A&to=C`
    expect(fetchMock).toHaveBeenCalledWith(expectedUrl, getMethodOptions)
  })

  it("test fetchPredictions with search mode = prefixScan", async () => {
    // given
    const voo = factory.createVOO20240221()
    const fetchMock = setupFetchMock([voo])

    // when
    const searchResult = await finProcessorClient.fetchPredictions({
      mode: SearchMode.PREFIX_SCAN,
      prefix: "V",
    })

    // then
    expect(searchResult).toHaveLength(1)
    const [vooActual] = searchResult
    expect(vooActual).toStrictEqual(voo)

    const expectedUrl = `${PREDICTIONS_URL}?mode=prefixScan&prefix=V`
    expect(fetchMock).toHaveBeenCalledWith(expectedUrl, getMethodOptions)
  })

  it("test fetchTopPredictions", async () => {
    // given
    const voo = factory.createVOO20240221()
    const fetchMock = setupFetchMock([voo])

    // when
    const searchResult = await finProcessorClient.fetchTopPredictions()

    // then
    expect(searchResult).toHaveLength(1)
    const [vooActual] = searchResult
    expect(vooActual).toStrictEqual(voo)

    const expectedUrl = `${FIN_PROCESSOR_URL}/api/v1/top/predictions`
    expect(fetchMock).toHaveBeenCalledWith(expectedUrl, getMethodOptions)
  })

  it("test fetchLossPredictions", async () => {
    // given
    const voo = factory.createVOO20240221()
    const fetchMock = setupFetchMock([voo])

    // when
    const searchResult = await finProcessorClient.fetchLossPredictions()

    // then
    expect(searchResult).toHaveLength(1)
    const [vooActual] = searchResult
    expect(vooActual).toStrictEqual(voo)

    const expectedUrl = `${FIN_PROCESSOR_URL}/api/v1/loss/predictions`
    expect(fetchMock).toHaveBeenCalledWith(expectedUrl, getMethodOptions)
  })
})
