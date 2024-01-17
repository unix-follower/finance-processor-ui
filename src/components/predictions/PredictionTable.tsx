import { useTranslation } from "react-i18next"
import React from "react"
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid"
import StockPricePredictionResponse from "@/finProcessor/model/StockPricePredictionResponse"

interface Props {
  loading: boolean
  predictions: StockPricePredictionResponse[]
}

export default function PredictionTable({ loading, predictions }: Props) {
  const { t } = useTranslation()

  const columns: GridColDef[] = [
    {
      field: "ticker",
      headerName: t("predictionTable.header.ticker"),
      width: 100,
    },
    {
      field: "openRangeAt",
      headerName: t("predictionTable.header.openRangeAt"),
      width: 150,
    },
    {
      field: "closedRangeAt",
      headerName: t("predictionTable.header.closedRangeAt"),
      width: 150,
    },
    {
      field: "predictionAt",
      headerName: t("predictionTable.header.predictionAt"),
      width: 225,
    },
    {
      field: "pricePrediction",
      headerName: t("predictionTable.header.pricePrediction"),
      width: 200,
    },
  ]

  const rows: GridRowsProp = predictions.map((prediction, index) => {
    return {
      id: index,
      ticker: prediction.ticker,
      openRangeAt: new Date(prediction.openRangeAt).toLocaleDateString(),
      closedRangeAt: new Date(prediction.closedRangeAt).toLocaleDateString(),
      predictionAt: new Date(prediction.predictionAt).toUTCString(),
      pricePrediction: prediction.pricePrediction,
    }
  })

  return (
    <div style={{ height: 300, width: "100%" }}>
      <DataGrid loading={loading} rows={rows} columns={columns} />
    </div>
  )
}
