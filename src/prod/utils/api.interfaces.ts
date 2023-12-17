export interface ILogiAPIResponse<T = any> {
  hasError: boolean
  data: T
  message: string
  moreResultsExists: boolean
  status: 200 | 401 | 409 | 403 | 500 | 415 | 201 | 203 | 400
}