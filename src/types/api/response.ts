export interface APIResponseData {
  success: boolean
  data: APIData
}
interface APIData{
    message?: string,
    error_code?: string,
    data? : any
}
