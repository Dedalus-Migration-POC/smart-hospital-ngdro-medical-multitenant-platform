import { Ais11Item } from './model'

export const PRIVATE_BOOKING_AVAILABILITY_REQUEST = {
  structures: ['700602'],
  doctorFiscalCode: null,
  doctorTypeCode: null,
  regimeErogazione: 'L',
  maxResults: 202,
  ais11: [
    { key: 'MODIMP', value1: '-1' },
    { key: 'QUESITO', value1: null },
  ] as Ais11Item[],
}
