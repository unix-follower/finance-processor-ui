import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

import type { AppState } from "@/store"
import type StockPricePredictionResponse from "@/finProcessor/model/StockPricePredictionResponse"
import FinProcessorError from "@/finProcessor/error/FinProcessorError"
import {
  FetchPredictionsParams,
  fetchPredictions,
} from "@/finProcessor/finProcessorClient"

export const fetchPredictionsThunk = createAsyncThunk(
  "predictions/fetchPredictionsAsyncThunk",
  async (params: FetchPredictionsParams, { rejectWithValue }) => {
    try {
      return await fetchPredictions(params)
    } catch (error) {
      if (error instanceof FinProcessorError) {
        return rejectWithValue(error.errorCode)
      }
      return rejectWithValue(error)
    }
  },
)

interface PredictionsState {
  predictions: Array<StockPricePredictionResponse>
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
      action: PayloadAction<Array<StockPricePredictionResponse>>,
    ) => {
      const payload = action.payload
      state.predictions = payload
    },
  },
})

export const getPredictions = (state: AppState) => state.predictionState.predictions

export const { setPredictions } = predictionsSlice.actions

export default predictionsSlice.reducer
