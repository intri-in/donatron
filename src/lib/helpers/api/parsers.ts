import { APIResponseData } from "@/types/api/response"

export function getSuccessFromAPIReponse(body: APIResponseData | null | undefined){

    if(!body) return false
    if("success" in body){
        return body.success
    }
    return false

}