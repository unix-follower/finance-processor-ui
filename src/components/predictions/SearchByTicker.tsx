import React from "react"
import { useTranslation } from "react-i18next"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import {
  setPredictions,
  fetchPredictionsByTickerAsyncThunk,
} from "@/components/predictions/predictionsSlice"
import { useAppDispatch } from "@/hooks"
import type GetPredictionsByTickerParams from "@/finProcessor/model/GetPredictionsByTickerParams"
import type StockPricePredictionResponse from "@/finProcessor/model/StockPricePredictionResponse"
import SearchButton from "./SearchButton"
import "./SearchByTicker.css"

interface Props {
  loading: boolean
  setLoadingFn: (value: boolean) => void
}

export default function SearchByTicker({ loading, setLoadingFn }: Props) {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const [ticker, setTicker] = React.useState("")
  const [tickerTextFieldCssClass, setTickerTextFieldCSSClass] =
    React.useState("flex-item")

  function resetInvalidTickerCss() {
    const newCssValue = tickerTextFieldCssClass.replace(
      "search-ticker-invalid",
      "",
    )
    setTickerTextFieldCSSClass(newCssValue)
  }

  function executeSearch() {
    if (!ticker) {
      const newCssClassValue = `${tickerTextFieldCssClass} search-ticker-invalid`
      setTickerTextFieldCSSClass(newCssClassValue)
      return Promise.reject()
    }

    const params = {
      ticker,
    }
    setLoadingFn(true)
    return fetchPredictionsByTicker(params).finally(() => setLoadingFn(false))
  }

  function handleKeyDownOfSearchByTicker(event: React.KeyboardEvent) {
    if (event.key === "Enter" && !loading) {
      executeSearch()
    }
  }

  async function fetchPredictionsByTicker(
    params: GetPredictionsByTickerParams,
  ) {
    const resp = await dispatch(fetchPredictionsByTickerAsyncThunk(params))
    dispatch(setPredictions(resp.payload))
  }

  function handleOnChangeEvent(event: React.ChangeEvent<HTMLInputElement>) {
    resetInvalidTickerCss()
    setTicker(event.target.value)
  }

  return (
    <Box className="search-by-ticker-box">
      <TextField
        id="search-by-ticker"
        label={t("predictionsPage.accordion.searchByTickerTextInputLabel")}
        className={tickerTextFieldCssClass}
        required={true}
        value={ticker}
        onChange={handleOnChangeEvent}
        onKeyDown={handleKeyDownOfSearchByTicker}
      />
      <SearchButton loading={loading} onClickEventHandler={executeSearch} />
    </Box>
  )
}
