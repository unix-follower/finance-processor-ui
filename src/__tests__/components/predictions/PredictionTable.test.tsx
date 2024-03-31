import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import configureStore from "redux-mock-store"
import React from "react"
import * as factory from "../../test-util/stockPricePredictionResponseFactory"

const useSelectorMock = jest.fn()

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: () => useSelectorMock(),
}))

import { Provider } from "react-redux"

jest.mock("react-i18next", () => ({
  useTranslation: jest.fn().mockImplementation(() => {
    return {
      t: jest.fn().mockImplementation((value) => `${value} translated`),
    }
  }),
}))
import PredictionTable from "@/components/predictions/PredictionTable"
import StockPricePredictionResponse from "@/finProcessor/model/StockPricePredictionResponse"

function setupStoreState() {
  useSelectorMock.mockReturnValue({
    predictions: [] as StockPricePredictionResponse[],
  })
}

describe("PredictionTable", () => {
  afterEach(() => useSelectorMock.mockClear())

  test("render while loading and virtualization is enabled", async () => {
    // given
    setupStoreState()

    const mockStore = configureStore()
    const initialState = {}
    const store = mockStore(initialState)

    render(
      <Provider store={store}>
        <PredictionTable loading={true} />
      </Provider>,
    )

    // when
    const columnHeaders = await screen.findAllByRole("columnheader")

    // then
    expect(columnHeaders.length).toBe(3)
    const [column1, column2, column3] = columnHeaders
    expect(column1.getAttribute("aria-label")).toBe(
      "predictionTable.header.ticker translated",
    )
    expect(column2.getAttribute("aria-label")).toBe(
      "predictionsPage.predictionTable.header.openRangeAt translated",
    )
    expect(column3.getAttribute("aria-label")).toBe(
      "predictionsPage.predictionTable.header.closedRangeAt translated",
    )
  })

  async function checkRender(loading: boolean) {
    // given
    setupStoreState()

    const mockStore = configureStore()
    const initialState = {}
    const store = mockStore(initialState)

    render(
      <Provider store={store}>
        <PredictionTable loading={loading} virtualizationEnabled={false} />
      </Provider>,
    )

    // when
    const columnHeaders = await screen.findAllByRole("columnheader")

    // then
    expect(columnHeaders.length).toBe(5)
    const [column1, column2, column3, column4, column5] = columnHeaders
    expect(column1.getAttribute("aria-label")).toBe(
      "predictionTable.header.ticker translated",
    )
    expect(column2.getAttribute("aria-label")).toBe(
      "predictionsPage.predictionTable.header.openRangeAt translated",
    )
    expect(column3.getAttribute("aria-label")).toBe(
      "predictionsPage.predictionTable.header.closedRangeAt translated",
    )
    expect(column4.getAttribute("aria-label")).toBe(
      "predictionsPage.predictionTable.header.predictionAt translated",
    )
    expect(column5.getAttribute("aria-label")).toBe(
      "predictionTable.header.pricePrediction translated",
    )
  }

  test("render while loading", async () => {
    checkRender(true)
  })

  test("render with no records", async () => {
    checkRender(false)
  })

  test("render with records", async () => {
    // given
    const voo = factory.createVOO20240221()
    useSelectorMock.mockReturnValue({
      predictions: [voo] as StockPricePredictionResponse[],
    })

    const mockStore = configureStore()
    const initialState = {}
    const store = mockStore(initialState)

    render(
      <Provider store={store}>
        <PredictionTable loading={false} virtualizationEnabled={false} />
      </Provider>,
    )

    // when
    const columnHeaders = await screen.findAllByRole("columnheader")
    const cells = await screen.findAllByRole("cell")

    // then
    const columnCount = 5
    expect(columnHeaders.length).toBe(columnCount)
    const [column1, column2, column3, column4, column5] = columnHeaders
    expect(column1.getAttribute("aria-label")).toBe(
      "predictionTable.header.ticker translated",
    )
    expect(column2.getAttribute("aria-label")).toBe(
      "predictionsPage.predictionTable.header.openRangeAt translated",
    )
    expect(column3.getAttribute("aria-label")).toBe(
      "predictionsPage.predictionTable.header.closedRangeAt translated",
    )
    expect(column4.getAttribute("aria-label")).toBe(
      "predictionsPage.predictionTable.header.predictionAt translated",
    )
    expect(column5.getAttribute("aria-label")).toBe(
      "predictionTable.header.pricePrediction translated",
    )

    expect(cells.length).toBe(columnCount)
    const [cell1, cell2, cell3, cell4, cell5] = cells
    expect(cell1.getAttribute("data-field")).toBe("ticker")
    expect(cell1).toHaveTextContent(voo.ticker)

    expect(cell2.getAttribute("data-field")).toBe("openRangeAt")
    expect(cell2).toHaveTextContent(
      new Date(voo.openRangeAt).toLocaleDateString(),
    )

    expect(cell3.getAttribute("data-field")).toBe("closedRangeAt")
    expect(cell3).toHaveTextContent(
      new Date(voo.closedRangeAt).toLocaleDateString(),
    )

    expect(cell4.getAttribute("data-field")).toBe("predictionAt")
    expect(cell4).toHaveTextContent(new Date(voo.predictionAt).toUTCString())

    expect(cell5.getAttribute("data-field")).toBe("pricePrediction")
    expect(cell5).toHaveTextContent(voo.pricePrediction.toString())
  })
})
