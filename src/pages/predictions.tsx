import React from "react"
import { useTranslation } from "react-i18next"
import type { NextPage } from "next"
import PredictionTable from "@/components/predictions/PredictionTable"
import AdvancedSearch from "@/components/predictions/AdvancedSearch"
import type GetPredictionsParams from "@/finProcessor/model/GetPredictionsParams"
import SearchMode from "@/finProcessor/model/SearchMode"
import Accordion from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"
import Typography from "@mui/material/Typography"
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"
import Alert from "@mui/material/Alert"
import { useAppDispatch, useAppSelector } from "@/hooks"
import {
  PredictionStateUpdateAction,
  fetchPredictionsAsyncThunk,
  setState,
  getPredictionState,
} from "@/components/predictions/predictionsSlice"
import SearchByTicker from "@/components/predictions/SearchByTicker"
import "./predictions.css"
import ErrorCode from "@/finProcessor/error/ErrorCode"

const errorSkipList = [ErrorCode.TICKER_NOT_FOUND]

const PredictionsPage: NextPage = () => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const [loading, setLoading] = React.useState(false)

  const [expanded, setExpanded] = React.useState<string | false>("panel1")

  const predictionState = useAppSelector(getPredictionState)

  const fetchPredictions = React.useCallback(
    async (params: GetPredictionsParams) => {
      setLoading(true)
      try {
        const response = await dispatch(fetchPredictionsAsyncThunk(params))
        dispatch(setState(response.payload as PredictionStateUpdateAction))
      } finally {
        setLoading(false)
      }
    },
    [dispatch],
  )

  const loadAllPredictions = React.useCallback(() => {
    const params = {
      mode: SearchMode.ALL,
    }

    fetchPredictions(params)
  }, [fetchPredictions])

  React.useEffect(() => {
    loadAllPredictions()
  }, [loadAllPredictions])

  const handleAccordionChange =
    (panel: string) => (_: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false)
    }

  function isShowAlertOnServerError() {
    let isError = false
    if (predictionState.error) {
      const errorDetails = predictionState.error
      isError = !errorSkipList.includes(errorDetails.errorCode)
    }
    return isError
  }

  return (
    <div>
      {isShowAlertOnServerError() && (
        <Alert variant="filled" severity="error">
          {t("fetchDataErrorAlertMessage")}
        </Alert>
      )}
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleAccordionChange("panel1")}
      >
        <AccordionSummary
          id="panel1-header"
          aria-controls="panel1-content"
          expandIcon={<ArrowDownwardIcon />}
        >
          <Typography>
            {t("predictionsPage.accordion.advancedSearch")}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <AdvancedSearch
            loading={loading}
            executeSearchFn={fetchPredictions}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel2"}
        onChange={handleAccordionChange("panel2")}
        className="accordion-last-child"
      >
        <AccordionSummary
          id="panel2d-header"
          aria-controls="panel2d-content"
          expandIcon={<ArrowDownwardIcon />}
        >
          <Typography>
            {t("predictionsPage.accordion.searchByTicker")}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <SearchByTicker loading={loading} setLoadingFn={setLoading} />
        </AccordionDetails>
      </Accordion>
      <PredictionTable loading={loading} />
    </div>
  )
}

export default PredictionsPage
