import React from "react"
import { useTranslation } from "react-i18next"
import type { NextPage } from "next"
import TopPredictionTable from "@/components/topPredictions/TopPredictionTable"
import Alert from "@mui/material/Alert"
import { useAppDispatch, useAppSelector } from "@/hooks"
import {
  PredictionStateUpdateAction,
  fetchLossPredictionsAsyncThunk,
  setState,
  getPredictionState,
} from "@/components/predictions/predictionsSlice"
import "./loss-predictions.css"

const LossPredictionsPage: NextPage = () => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const [loading, setLoading] = React.useState(false)

  const predictionState = useAppSelector(getPredictionState)

  React.useEffect(() => {
    async function fetchPredictions() {
      const response = await dispatch(fetchLossPredictionsAsyncThunk())
      dispatch(setState(response.payload as PredictionStateUpdateAction))
    }

    function loadPredictions() {
      setLoading(true)
      return fetchPredictions().finally(() => setLoading(false))
    }

    loadPredictions()
  }, [dispatch])

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
      <div className="loss-predictions">
        <TopPredictionTable loading={loading} />
      </div>
    </div>
  )
}

export default LossPredictionsPage
