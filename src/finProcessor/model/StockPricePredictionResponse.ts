export default interface StockPricePredictionResponse {
  ticker: string
  openRangeAt: string
  closedRangeAt: string
  predictionAt: string
  pricePrediction: number
}
