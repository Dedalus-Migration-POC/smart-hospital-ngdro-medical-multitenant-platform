export interface Payment {
  iuv: string
  cf: string
  codiceDistinta: string
  dataDistinta: string // not show FE
  idScheda: string
  prestazioni: string
  importo: number
  statoDistinta: 'PAGATA' | 'DA PAGARE'
}

export interface LinkPagoPaRequest {
  iuv: string
  amount: string | number
  reason: string
  notificationEmail: string
}
