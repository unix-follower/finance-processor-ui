import StockPricePredictionResponse from "@/finProcessor/model/StockPricePredictionResponse"

export function createVOO20240221(): StockPricePredictionResponse {
  return {
    ticker: "VOO",
    openRangeAt: "2024-02-01T00:00:00Z",
    closedRangeAt: "2024-02-21T00:00:00Z",
    predictionAt: "2024-02-21T12:35:16Z",
    pricePrediction: 458.44007248160625,
  }
}
