import { render, screen, within } from "@testing-library/react"
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
import LossPredictionTable from "@/components/lossPredictions/LossPredictionTable"
import StockPricePredictionResponse from "@/finProcessor/model/StockPricePredictionResponse"

function setupEmptyLossPredictions() {
  useSelectorMock.mockReturnValue({
    lossPredictions: [] as StockPricePredictionResponse[],
  })
}

describe("LossPredictionTable", () => {
  afterEach(() => useSelectorMock.mockClear())

  test("render while loading", async () => {
    // given
    setupEmptyLossPredictions()
    const mockStore = configureStore()
    const initialState = {}
    const store = mockStore(initialState)
    render(
      <Provider store={store}>
        <LossPredictionTable loading={true} />
      </Provider>,
    )

    // when
    const columnHeaders = await screen.findAllByRole("columnheader")

    // then
    expect(columnHeaders.length).toBe(2)
    const [column1, column2] = columnHeaders
    expect(column1.getAttribute("aria-label")).toBe(
      "predictionTable.header.ticker translated",
    )
    expect(column2.getAttribute("aria-label")).toBe(
      "predictionTable.header.pricePrediction translated",
    )
  })

  test("render with no records", async () => {
    // given
    setupEmptyLossPredictions()
    const mockStore = configureStore()
    const initialState = {}
    const store = mockStore(initialState)
    render(
      <Provider store={store}>
        <LossPredictionTable loading={false} />
      </Provider>,
    )

    // when
    const columnHeaders = await screen.findAllByRole("columnheader")
    const presentations = await screen.findAllByRole("presentation")
    const divOverlayVirtualScroller = presentations.find((presentation) =>
      presentation
        .getAttribute("class")
        ?.includes("MuiDataGrid-virtualScroller"),
    )

    // then
    expect(columnHeaders.length).toBe(2)
    const [column1, column2] = columnHeaders
    expect(column1.getAttribute("aria-label")).toBe(
      "predictionTable.header.ticker translated",
    )
    expect(column2.getAttribute("aria-label")).toBe(
      "predictionTable.header.pricePrediction translated",
    )

    expect(divOverlayVirtualScroller).toBeDefined()
    const htmlElement = await within(divOverlayVirtualScroller!).findByText(
      "predictionTable.noRowsLabel translated",
    )
    expect(htmlElement).toBeDefined()
  })

  test("render with records", async () => {
    // given
    const voo = factory.createVOO20240221()
    useSelectorMock.mockReturnValue({
      lossPredictions: [voo],
    })
    const mockStore = configureStore()
    const initialState = {}
    const store = mockStore(initialState)
    render(
      <Provider store={store}>
        <LossPredictionTable loading={false} />
      </Provider>,
    )

    // when
    const columnHeaders = await screen.findAllByRole("columnheader")
    const cells = await screen.findAllByRole("cell")

    // then
    expect(columnHeaders.length).toBe(2)
    const [column1, column2] = columnHeaders
    expect(column1.getAttribute("aria-label")).toBe(
      "predictionTable.header.ticker translated",
    )
    expect(column2.getAttribute("aria-label")).toBe(
      "predictionTable.header.pricePrediction translated",
    )

    expect(cells.length).toBe(2)
    const [cell1, cell2] = cells
    expect(cell1.getAttribute("data-field")).toBe("ticker")
    expect(cell1).toHaveTextContent(voo.ticker)

    expect(cell2.getAttribute("data-field")).toBe("pricePrediction")
    expect(cell2).toHaveTextContent(voo.pricePrediction.toString())
  })
})
