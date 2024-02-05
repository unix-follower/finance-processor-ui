import React from "react"
import { useTranslation } from "react-i18next"
import type { NextPage } from "next"
import TopPredictionTable from "@/components/topPredictions/TopPredictionTable"
import Alert from "@mui/material/Alert"
import { useAppDispatch, useAppSelector } from "@/hooks"
import {
  PredictionStateUpdateAction,
  fetchTopPredictionsAsyncThunk,
  setState,
  getPredictionState,
} from "@/components/predictions/predictionsSlice"
import "./top-predictions.css"

const TopPredictionsPage: NextPage = () => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const [loading, setLoading] = React.useState(false)

  const predictionState = useAppSelector(getPredictionState)

  async function fetchPredictions() {
    const resp = await dispatch(fetchTopPredictionsAsyncThunk())
    dispatch(setState(resp.payload as PredictionStateUpdateAction))
  }

  function loadPredictions() {
    setLoading(true)
    return fetchPredictions().finally(() => setLoading(false))
  }

  React.useEffect(() => {
    loadPredictions()
  }, [])

  function isShowAlertOnServerError() {
    return predictionState.error
  }

  return (
    <div>
      {isShowAlertOnServerError() && (
        <Alert variant="filled" severity="error">
          {t("fetchDataErrorAlertMessage")}
        </Alert>
      )}
      <div className="top-predictions">
        <TopPredictionTable loading={loading} />
      </div>
    </div>
  )
}

export default TopPredictionsPage
