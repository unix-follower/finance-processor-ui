import React from "react"
import { useTranslation } from "react-i18next"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import SearchMode, { parseSearchMode } from "@/finProcessor/model/SearchMode"
import GetPredictionsParams from "@/finProcessor/model/GetPredictionsParams"
import "./AdvancedSearch.css"
import SearchButton from "./SearchButton"

interface Props {
  loading: boolean
  executeSearchFn: (params: GetPredictionsParams) => Promise<void>
}

export default function AdvancedSearch({ loading, executeSearchFn }: Props) {
  const { t } = useTranslation()

  const [searchMode, setSearchMode] = React.useState(SearchMode.ALL)
  const [from, setFrom] = React.useState("")
  const [to, setTo] = React.useState("")
  const [prefix, setPrefix] = React.useState("")
  const [prefixTextFieldCssClass, setPrefixTextFieldCssClass] =
    React.useState("flex-item")

  function resetInvalidPerfixScanCss() {
    const newCssValue = prefixTextFieldCssClass.replace(
      "search-prefix-invalid",
      "",
    )
    setPrefixTextFieldCssClass(newCssValue)
  }

  function searchForPredictions() {
    if (searchMode === SearchMode.PREFIX_SCAN) {
      if (!prefix) {
        const newCssClassValue = `${prefixTextFieldCssClass} search-prefix-invalid`
        setPrefixTextFieldCssClass(newCssClassValue)
        return Promise.reject()
      } else {
        resetInvalidPerfixScanCss()
      }
    }
    const params = {
      from,
      mode: searchMode,
      to,
      prefix,
    }

    return executeSearchFn(params)
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Enter" && !loading) {
      searchForPredictions()
    }
  }

  const isFullSearch = () =>
    searchMode === SearchMode.ALL || searchMode === SearchMode.REVERSE_ALL

  const isRangeSearch = () =>
    searchMode == SearchMode.RANGE || searchMode == SearchMode.REVERSE_RANGE
  const isPrefixScanSearch = () => searchMode == SearchMode.PREFIX_SCAN

  function createRangeTextInputs() {
    return (
      <>
        <TextField
          id="search-from"
          label={t("predictionsPage.advancedSearch.searchFromLabel")}
          size="small"
          className="flex-item"
          variant="outlined"
          value={from}
          disabled={isFullSearch()}
          onChange={(event) => setFrom(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <TextField
          id="search-to"
          label={t("predictionsPage.advancedSearch.searchToLabel")}
          size="small"
          className="flex-item"
          variant="outlined"
          value={to}
          disabled={isFullSearch()}
          onChange={(event) => setTo(event.target.value)}
          onKeyDown={(event) => handleKeyDown(event)}
        />
      </>
    )
  }

  function createPrefixScanTextInput() {
    function handleSearchPrefixOnChange(
      event: React.ChangeEvent<HTMLInputElement>,
    ) {
      setPrefix(event.target.value)
      resetInvalidPerfixScanCss()
    }

    return (
      <TextField
        id="search-prefix"
        label={t("predictionsPage.advancedSearch.searchPrefixLabel")}
        size="small"
        variant="outlined"
        className={prefixTextFieldCssClass || "flex-item"}
        value={prefix}
        required={searchMode === SearchMode.PREFIX_SCAN}
        disabled={isFullSearch()}
        onChange={handleSearchPrefixOnChange}
        onKeyDown={(event) => handleKeyDown(event)}
      />
    )
  }

  function handleSelectOnChange(event: SelectChangeEvent) {
    resetInvalidPerfixScanCss()
    const mode = parseSearchMode(event.target.value)
    setSearchMode(mode)
  }

  return (
    <Box
      component="form"
      className="advanced-search-form"
      noValidate
      autoComplete="off"
    >
      <FormControl fullWidth>
        <InputLabel id="search-mode-select-label">
          {t("predictionsPage.advancedSearch.searchModeSelect.label")}
        </InputLabel>
        <Select
          id="search-mode"
          labelId="search-mode-select-label"
          size="small"
          className="flex-item"
          value={searchMode}
          onChange={handleSelectOnChange}
        >
          <MenuItem value={SearchMode.ALL}>
            {t("predictionsPage.advancedSearch.searchModeSelect.values.all")}
          </MenuItem>
          <MenuItem value={SearchMode.REVERSE_ALL}>
            {t(
              "predictionsPage.advancedSearch.searchModeSelect.values.reverseAll",
            )}
          </MenuItem>
          <MenuItem value={SearchMode.RANGE}>
            {t("predictionsPage.advancedSearch.searchModeSelect.values.range")}
          </MenuItem>
          <MenuItem value={SearchMode.REVERSE_RANGE}>
            {t(
              "predictionsPage.advancedSearch.searchModeSelect.values.reverseRange",
            )}
          </MenuItem>
          <MenuItem value={SearchMode.PREFIX_SCAN}>
            {t("predictionsPage.advancedSearch.searchPrefixLabel")}
          </MenuItem>
        </Select>
      </FormControl>
      {isRangeSearch() && createRangeTextInputs()}
      {isPrefixScanSearch() && createPrefixScanTextInput()}
      <SearchButton
        loading={loading}
        onClickEventHandler={searchForPredictions}
      />
    </Box>
  )
}
