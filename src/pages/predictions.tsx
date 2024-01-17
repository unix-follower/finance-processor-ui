import React from "react"
import { useTranslation } from "react-i18next"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import Select from "@mui/material/Select"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import type { NextPage } from "next"
import { useAppDispatch } from "@/hooks"
import type StockPricePredictionResponse from "@/finProcessor/model/StockPricePredictionResponse"
import PredictionTable from "@/components/predictions/PredictionTable"
import {
  fetchPredictionsThunk,
  setPredictions as setPredictionsAction,
} from "@/components/predictions/predictionsSlice"
import { FetchPredictionsParams } from "@/finProcessor/finProcessorClient"
import SearchMode from "@/finProcessor/model/SearchMode"
import LoadingButton from "@mui/lab/LoadingButton"

const PredictionsPage: NextPage = () => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const [predictions, setPredictions] = React.useState<
    StockPricePredictionResponse[]
  >([])
  const [searchMode, setSearchMode] = React.useState(SearchMode.ALL)
  const [from, setFrom] = React.useState("")
  const [to, setTo] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  async function fetchPredictions(params: FetchPredictionsParams) {
    const resp = await dispatch(fetchPredictionsThunk(params))
    const predictionListResponse =
      resp.payload as StockPricePredictionResponse[]
    dispatch(setPredictionsAction(predictionListResponse))
    setPredictions(predictionListResponse)
  }

  function loadPredictions(params: FetchPredictionsParams) {
    setLoading(true)
    return fetchPredictions(params).finally(() => setLoading(false))
  }

  React.useEffect(() => {
    const params = {
      mode: SearchMode.ALL,
    }
    loadPredictions(params)
  }, [])

  function searchForPredictions() {
    const params = {
      from,
      mode: searchMode,
      to,
    }
    return loadPredictions(params)
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Enter") {
      searchForPredictions()
    }
  }

  const isFullSearch = () =>
    searchMode === SearchMode.ALL || searchMode === SearchMode.REVERSE_ALL

  return (
    <div>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "15%" },
        }}
        noValidate
        autoComplete="off"
      >
        <FormControl fullWidth>
          <InputLabel id="search-mode-select-label">
            {t("predictionsPage.searchModeSelect.label")}
          </InputLabel>
          <Select
            id="searchMode"
            labelId="search-mode-select-label"
            size="small"
            value={searchMode}
            onChange={(event) =>
              setSearchMode(event.target.value as SearchMode)
            }
          >
            <MenuItem value={SearchMode.ALL}>
              {t("predictionsPage.searchModeSelect.values.all")}
            </MenuItem>
            <MenuItem value={SearchMode.RANGE}>
              {t("predictionsPage.searchModeSelect.values.range")}
            </MenuItem>
            <MenuItem value={SearchMode.REVERSE_RANGE}>
              {t("predictionsPage.searchModeSelect.values.reverseRange")}
            </MenuItem>
            <MenuItem value={SearchMode.REVERSE_ALL}>
              {t("predictionsPage.searchModeSelect.values.reverseAll")}
            </MenuItem>
          </Select>
        </FormControl>
        <TextField
          id="searchFrom"
          label="From"
          size="small"
          variant="outlined"
          value={from}
          disabled={isFullSearch()}
          onChange={(event) => setFrom(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <TextField
          id="searchTo"
          label="To"
          size="small"
          variant="outlined"
          value={to}
          disabled={isFullSearch()}
          onChange={(event) => setTo(event.target.value)}
          onKeyDown={(event) => handleKeyDown(event)}
        />
        <LoadingButton
          size="small"
          onClick={(_) => searchForPredictions()}
          loading={loading}
          variant="outlined"
        >
          {t("predictionsPage.searchButtonText")}
        </LoadingButton>
      </Box>
      <PredictionTable loading={loading} predictions={predictions} />
    </div>
  )
}

export default PredictionsPage
