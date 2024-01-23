import React from "react"
import { useTranslation } from "react-i18next"
import type { NextPage } from "next"
import type StockPricePredictionResponse from "@/finProcessor/model/StockPricePredictionResponse"
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
  fetchPredictionsAsyncThunk,
  setPredictions as setPredictionsAction,
  getPredictionState,
} from "@/components/predictions/predictionsSlice"
import SearchByTicker from "@/components/predictions/SearchByTicker"
import "./predictions.css"

const PredictionsPage: NextPage = () => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const [loading, setLoading] = React.useState(false)

  const [expanded, setExpanded] = React.useState<string | false>("panel1")

  const predictionState = useAppSelector(getPredictionState)

  async function fetchPredictions(params: GetPredictionsParams) {
    const resp = await dispatch(fetchPredictionsAsyncThunk(params))

    const predictionListResponse =
      resp.payload as StockPricePredictionResponse[]
    dispatch(setPredictionsAction(predictionListResponse))
  }

  function loadPredictions(params: GetPredictionsParams) {
    setLoading(true)
    return fetchPredictions(params).finally(() => setLoading(false))
  }

  const handleAccordionChange =
    (panel: string) => (_: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false)
    }

  React.useEffect(() => {
    const params = {
      mode: SearchMode.ALL,
    }
    loadPredictions(params)
  }, [])

  return (
    <div>
      {predictionState.error && (
        <Alert variant="filled" severity="error">
          {t("predictionsPage.fetchPredictionsErrorAlertMessage")}
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
          <AdvancedSearch loading={loading} executeSearchFn={loadPredictions} />
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
