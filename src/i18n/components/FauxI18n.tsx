import Skeleton from "@mui/material/Skeleton"
import { i18n } from "i18next"

export interface FauxI18n{
t: Function
}
export default function fauxI8n(){
    return {
      t:(variable: any) =>{
        return(<Skeleton width="30%" variant="text" animation="wave" />)
      }
    }
  }
  