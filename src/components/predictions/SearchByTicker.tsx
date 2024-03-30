import React from "react"
import { useTranslation } from "react-i18next"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import {
  PredictionStateUpdateAction,
  setState,
  fetchPredictionByTickerAsyncThunk,
} from "@/components/predictions/predictionsSlice"
import { useAppDispatch } from "@/hooks"
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

    setLoadingFn(true)
    return fetchPredictionByTicker(ticker).finally(() => setLoadingFn(false))
  }

  function handleKeyDownOfSearchByTicker(event: React.KeyboardEvent) {
    if (event.key === "Enter" && !loading) {
      executeSearch()
    }
  }

  async function fetchPredictionByTicker(ticker: string) {
    const response = await dispatch(fetchPredictionByTickerAsyncThunk(ticker))
    dispatch(setState(response.payload as PredictionStateUpdateAction))
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
