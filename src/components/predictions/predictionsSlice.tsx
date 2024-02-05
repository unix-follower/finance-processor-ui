import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

import type { AppState } from "@/store"
import type GetPredictionsParams from "@/finProcessor/model/GetPredictionsParams"
import type GetPredictionByTickerParams from "@/finProcessor/model/GetPredictionsByTickerParams"
import type StockPricePredictionResponse from "@/finProcessor/model/StockPricePredictionResponse"
import FinProcessorError from "@/finProcessor/error/FinProcessorError"
import {
  fetchPredictions,
  fetchTopPredictions,
  fetchLossPredictions,
  fetchPredictionsByTicker,
} from "@/finProcessor/finProcessorClient"
import ErrorCode from "@/finProcessor/error/ErrorCode"

export interface PredictionStateUpdateAction {
  eventType: PredictionStateUpdateActionType
  data: any
}

async function executeCatching<T>(
  params: any,
  rejectWithValue: any,
  fn: (params: any) => Promise<T>,
  eventType: PredictionStateUpdateActionType,
): Promise<PredictionStateUpdateAction> {
  try {
    const data = await fn(params)
    return {
      eventType,
      data,
    }
  } catch (error) {
    let errorCode = ErrorCode.UNKNOWN
    if (error instanceof FinProcessorError) {
      errorCode = error.errorCode
    }
    const errorResponse = {
      eventType: PredictionStateUpdateActionType.SET_ERROR,
      data: {
        errorCode,
      },
    }
    return rejectWithValue(errorResponse)
  }
}

export const fetchPredictionsAsyncThunk = createAsyncThunk(
  "predictions/fetchPredictionsAsyncThunk",
  async (params: GetPredictionsParams, { rejectWithValue }) =>
    executeCatching(
      params,
      rejectWithValue,
      fetchPredictions,
      PredictionStateUpdateActionType.SET_PREDICTIONS,
    ),
)

export const fetchPredictionsByTickerAsyncThunk = createAsyncThunk(
  "predictions/fetchPredictionByTickerAsyncThunk",
  async (params: GetPredictionByTickerParams, { rejectWithValue }) =>
    executeCatching(
      params,
      rejectWithValue,
      fetchPredictionsByTicker,
      PredictionStateUpdateActionType.SET_PREDICTION,
    ),
)

export const fetchTopPredictionsAsyncThunk = createAsyncThunk(
  "predictions/fetchTopPredictionsAsyncThunk",
  async (_, { rejectWithValue }) => {
    return executeCatching(
      null,
      rejectWithValue,
      fetchTopPredictions,
      PredictionStateUpdateActionType.SET_TOP_PREDICTIONS,
    )
  },
)

export const fetchLossPredictionsAsyncThunk = createAsyncThunk(
  "predictions/fetchLossPredictionsAsyncThunk",
  async (_, { rejectWithValue }) => {
    return executeCatching(
      null,
      rejectWithValue,
      fetchLossPredictions,
      PredictionStateUpdateActionType.SET_LOSS_PREDICTIONS,
    )
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
  (state: any, data: StockPricePredictionResponse) => {
    state.error = undefined
    state.predictions = [data]
  },
)
stateHnadlerMap.set(
  PredictionStateUpdateActionType.SET_PREDICTIONS,
  (state: any, data: StockPricePredictionResponse[]) => {
    state.error = undefined
    state.predictions = data
  },
)
stateHnadlerMap.set(
  PredictionStateUpdateActionType.SET_TOP_PREDICTIONS,
  (state: any, data: StockPricePredictionResponse[]) => {
    state.error = undefined
    state.topPredictions = data
  },
)
stateHnadlerMap.set(
  PredictionStateUpdateActionType.SET_LOSS_PREDICTIONS,
  (state: any, data: StockPricePredictionResponse[]) => {
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
