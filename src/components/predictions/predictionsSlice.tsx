import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

import type { AppState } from "@/store"
import type GetPredictionsParams from "@/finProcessor/model/GetPredictionsParams"
import type StockPricePredictionResponse from "@/finProcessor/model/StockPricePredictionResponse"
import FinProcessorError from "@/finProcessor/error/FinProcessorError"
import {
  fetchPredictions,
  fetchTopPredictions,
  fetchLossPredictions,
  fetchPredictionByTicker,
} from "@/finProcessor/finProcessorClient"
import ErrorCode from "@/finProcessor/error/ErrorCode"

export interface PredictionStateUpdateAction {
  eventType: PredictionStateUpdateActionType
  data: StockPricePredictionResponse[]
}

function createErrorResponse(error: Error) {
  let errorCode = ErrorCode.UNKNOWN
  if (error instanceof FinProcessorError) {
    errorCode = error.errorCode
  }

  return {
    eventType: PredictionStateUpdateActionType.SET_ERROR,
    data: {
      errorCode,
    },
  }
}

export const fetchPredictionsAsyncThunk = createAsyncThunk(
  "predictions/fetchPredictionsAsyncThunk",
  async (params: GetPredictionsParams, { rejectWithValue }) => {
    try {
      const data = await fetchPredictions(params)
      return {
        eventType: PredictionStateUpdateActionType.SET_PREDICTIONS,
        data,
      }
    } catch (error) {
      const errorResponse = createErrorResponse(error as Error)
      return rejectWithValue(errorResponse)
    }
  },
)

export const fetchPredictionByTickerAsyncThunk = createAsyncThunk(
  "predictions/fetchPredictionByTickerAsyncThunk",
  async (ticker: string, { rejectWithValue }) => {
    try {
      const data = await fetchPredictionByTicker(ticker)
      return {
        eventType: PredictionStateUpdateActionType.SET_PREDICTION,
        data,
      }
    } catch (error) {
      const errorResponse = createErrorResponse(error as Error)
      return rejectWithValue(errorResponse)
    }
  },
)

export const fetchTopPredictionsAsyncThunk = createAsyncThunk(
  "predictions/fetchTopPredictionsAsyncThunk",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchTopPredictions()
      return {
        eventType: PredictionStateUpdateActionType.SET_TOP_PREDICTIONS,
        data,
      }
    } catch (error) {
      const errorResponse = createErrorResponse(error as Error)
      return rejectWithValue(errorResponse)
    }
  },
)

export const fetchLossPredictionsAsyncThunk = createAsyncThunk(
  "predictions/fetchLossPredictionsAsyncThunk",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchLossPredictions()
      return {
        eventType: PredictionStateUpdateActionType.SET_LOSS_PREDICTIONS,
        data,
      }
    } catch (error) {
      const errorResponse = createErrorResponse(error as Error)
      return rejectWithValue(errorResponse)
    }
  },
)

enum PredictionStateUpdateActionType {
  SET_ERROR,
  SET_PREDICTION,
  SET_PREDICTIONS,
  SET_TOP_PREDICTIONS,
  SET_LOSS_PREDICTIONS,
}

interface PredictionsStateErrorEvent {
  errorCode: ErrorCode
}

interface PredictionsState {
  error?: PredictionsStateErrorEvent
  predictions: Array<StockPricePredictionResponse>
  topPredictions: Array<StockPricePredictionResponse>
  lossPredictions: Array<StockPricePredictionResponse>
}

const initialState: PredictionsState = {
  predictions: [],
  topPredictions: [],
  lossPredictions: [],
}

const stateHnadlerMap = new Map()
stateHnadlerMap.set(
  PredictionStateUpdateActionType.SET_ERROR,
  (state: PredictionsState, data: PredictionsStateErrorEvent) => {
    state.error = data
  },
)
stateHnadlerMap.set(
  PredictionStateUpdateActionType.SET_PREDICTION,
  (state: PredictionsState, data: StockPricePredictionResponse) => {
    state.error = undefined
    state.predictions = [data]
  },
)
stateHnadlerMap.set(
  PredictionStateUpdateActionType.SET_PREDICTIONS,
  (state: PredictionsState, data: StockPricePredictionResponse[]) => {
    state.error = undefined
    state.predictions = data
  },
)
stateHnadlerMap.set(
  PredictionStateUpdateActionType.SET_TOP_PREDICTIONS,
  (state: PredictionsState, data: StockPricePredictionResponse[]) => {
    state.error = undefined
    state.topPredictions = data
  },
)
stateHnadlerMap.set(
  PredictionStateUpdateActionType.SET_LOSS_PREDICTIONS,
  (state: PredictionsState, data: StockPricePredictionResponse[]) => {
    state.error = undefined
    state.lossPredictions = data
  },
)

export const predictionsSlice = createSlice({
  name: "predictionsSlice",
  initialState,
  reducers: {
    setState: (state, action: PayloadAction<PredictionStateUpdateAction>) => {
      const payload = action.payload
      stateHnadlerMap.get(payload.eventType)?.(state, payload.data)
    },
  },
})

export const getPredictionState = (state: AppState) => state.predictionState

export const { setState } = predictionsSlice.actions

export default predictionsSlice.reducer
