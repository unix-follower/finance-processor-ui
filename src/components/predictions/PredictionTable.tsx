import { useTranslation } from "react-i18next"
import React from "react"
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid"
import { getPredictionState } from "@/components/predictions/predictionsSlice"
import { useAppSelector } from "@/hooks"
import "./PredictionTable.css"

interface Props {
  loading: boolean
}

export default function PredictionTable({ loading }: Props) {
  const { t } = useTranslation()

  const { predictions, error } = useAppSelector(getPredictionState)

  const columns: GridColDef[] = [
    {
      field: "ticker",
      headerName: t("predictionsPage.predictionTable.header.ticker"),
      width: 100,
    },
    {
      field: "openRangeAt",
      headerName: t("predictionsPage.predictionTable.header.openRangeAt"),
      width: 150,
    },
    {
      field: "closedRangeAt",
      headerName: t("predictionsPage.predictionTable.header.closedRangeAt"),
      width: 150,
    },
    {
      field: "predictionAt",
      headerName: t("predictionsPage.predictionTable.header.predictionAt"),
      width: 225,
    },
    {
      field: "pricePrediction",
      headerName: t("predictionsPage.predictionTable.header.pricePrediction"),
      width: 200,
    },
  ]

  let rows: GridRowsProp = []
  if (!error) {
    rows = predictions.map((prediction, index) => {
      return {
        id: index,
        ticker: prediction.ticker,
        openRangeAt: new Date(prediction.openRangeAt).toLocaleDateString(),
        closedRangeAt: new Date(prediction.closedRangeAt).toLocaleDateString(),
        predictionAt: new Date(prediction.predictionAt).toUTCString(),
        pricePrediction: prediction.pricePrediction,
      }
    })
  }

  return (
    <DataGrid
      className="prediction-table"
      loading={loading}
      localeText={{
        noRowsLabel: t("predictionsPage.predictionTable.noRowsLabel"),
      }}
      rows={rows}
      columns={columns}
    />
  )
}
