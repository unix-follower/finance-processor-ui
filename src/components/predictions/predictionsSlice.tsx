import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

import type { AppState } from "@/store"
import type GetPredictionsParams from "@/finProcessor/model/GetPredictionsParams"
import type GetPredictionByTickerParams from "@/finProcessor/model/GetPredictionsByTickerParams"
import type StockPricePredictionResponse from "@/finProcessor/model/StockPricePredictionResponse"
import FinProcessorError from "@/finProcessor/error/FinProcessorError"
import {
  fetchPredictions,
  fetchPredictionsByTicker,
} from "@/finProcessor/finProcessorClient"
import ErrorCode from "@/finProcessor/error/ErrorCode"

async function executeCatching<T>(
  params: any,
  rejectWithValue: any,
  fn: (params: any) => Promise<T>,
) {
  try {
    return await fn(params)
  } catch (error) {
    let errorCode = ErrorCode.UNKNOWN
    if (error instanceof FinProcessorError) {
      errorCode = error.errorCode
    }
    const errorResponse = {
      errorCode,
    }
    return rejectWithValue(JSON.stringify(errorResponse))
  }
}

export const fetchPredictionsAsyncThunk = createAsyncThunk(
  "predictions/fetchPredictionsAsyncThunk",
  async (params: GetPredictionsParams, { rejectWithValue }) =>
    executeCatching(params, rejectWithValue, fetchPredictions),
)

export const fetchPredictionsByTickerAsyncThunk = createAsyncThunk(
  "predictions/fetchPredictionByTickerAsyncThunk",
  async (params: GetPredictionByTickerParams, { rejectWithValue }) =>
    executeCatching(params, rejectWithValue, fetchPredictionsByTicker),
)

interface PredictionsState {
  predictions: Array<StockPricePredictionResponse>
  error?: string | undefined | null
}

const initialState: PredictionsState = {
  predictions: [],
}

export const predictionsSlice = createSlice({
  name: "predictionsSlice",
  initialState,
  reducers: {
    setPredictions: (
      state,
      action: PayloadAction<
        | Array<StockPricePredictionResponse>
        | StockPricePredictionResponse
        | string
      >,
    ) => {
      const payload = action.payload
      if (typeof payload === "string") {
        state.error = payload as string
      } else if (Array.isArray(payload)) {
        state.error = undefined
        state.predictions = payload
      } else {
        state.error = undefined
        state.predictions = [payload]
      }
    },
  },
})

export const getPredictionState = (state: AppState) => state.predictionState

export const { setPredictions } = predictionsSlice.actions

export default predictionsSlice.reducer
