import React from "react"

import type { NextPage } from "next"

import { useState, useEffect } from "react"

import { useAppDispatch } from "@/hooks"

import type StockPricePredictionResponse from "@/finProcessor/model/StockPricePredictionResponse"

import PredictionTable from "@/components/predictions/PredictionTable"
import {
  fetchPredictionsThunk,
  setPredictions as setPredictionsAction,
} from "@/components/predictions/predictionsSlice"

const PredictionsPage: NextPage = () => {
  const dispatch = useAppDispatch()
  const [predictions, setPredictions] = useState<StockPricePredictionResponse[]>([])

  useEffect(() => {
    const params = {
      from: "",
      mode: "",
      to: "",
    }
    dispatch(fetchPredictionsThunk(params)).then((resp) => {
      const predictionListResponse = resp.payload as StockPricePredictionResponse[]

      dispatch(setPredictionsAction(predictionListResponse))
      setPredictions(predictionListResponse)
    })
  }, [])

  return <PredictionTable predictions={predictions} />
}

export default PredictionsPage
