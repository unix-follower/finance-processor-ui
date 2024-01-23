import React from "react"
import { useTranslation } from "react-i18next"
import LoadingButton from "@mui/lab/LoadingButton"

interface Props {
  loading: boolean
  onClickEventHandler: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => Promise<void>
}

export default function Search({ loading, onClickEventHandler }: Props) {
  const { t } = useTranslation()

  return (
    <LoadingButton
      size="small"
      className="flex-item search-button"
      onClick={onClickEventHandler}
      loading={loading}
      variant="outlined"
    >
      {t("predictionsPage.advancedSearch.searchButtonText")}
    </LoadingButton>
  )
}
