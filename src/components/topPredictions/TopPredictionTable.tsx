import { useTranslation } from "react-i18next"
import React from "react"
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid"
import { getPredictionState } from "@/components/predictions/predictionsSlice"
import { useAppSelector } from "@/hooks"
import "./TopPredictionTable.css"

interface Props {
  loading: boolean
}

export default function PredictionTable({ loading }: Props) {
  const { t } = useTranslation()

  const { topPredictions, error } = useAppSelector(getPredictionState)

  const columns: GridColDef[] = [
    {
      field: "ticker",
      headerName: t("predictionTable.header.ticker"),
      width: 100,
    },
    {
      field: "pricePrediction",
      headerName: t("predictionTable.header.pricePrediction"),
      width: 200,
    },
  ]

  let rows: GridRowsProp = []
  if (!error) {
    rows = topPredictions.map((prediction, index) => {
      return {
        id: index,
        ticker: prediction.ticker,
        pricePrediction: prediction.pricePrediction,
      }
    })
  }

  return (
    <DataGrid
      className="prediction-table"
      loading={loading}
      localeText={{
        noRowsLabel: t("predictionTable.noRowsLabel"),
      }}
      rows={rows}
      columns={columns}
    />
  )
}
