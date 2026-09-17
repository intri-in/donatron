import { DEFAULT_LANGUAGE, URL_DASHBOARD } from "#/defines/constants"
import validator from "validator"


export async function getLanguageFromURLParameter(searchParams: Promise<{ [key: string]: string | string[] | undefined }> | undefined){
    if(searchParams){
        const lng = (await searchParams)?.lng?.toString()
        const lng_toReturn = (lng && validator.isURL(lng)) ? lng : DEFAULT_LANGUAGE
        return lng_toReturn

    }

    return DEFAULT_LANGUAGE


}

export async function getEscapedParamFromSearchParam(searchParams: Promise<{ [key: string]: string | string[] | undefined }> | undefined, paramToGet:string){

    const searchP = await searchParams
    if(!searchP) return ""
    const unescapedVar = searchP[paramToGet]?.toString()
    // console.log("searchParams", unescapedVar)
    const toReturn = unescapedVar ? validator.escape(unescapedVar) : ""

    return toReturn
    

}

export async function getRedirectURLFromSearchParams(searchParams: Promise<{ [key: string]: string | string[] | undefined }> | undefined){
    
    if(searchParams){
        const redirect_url_from_params = (await searchParams)?.redirect_url?.toString()
        const redirect_url = (redirect_url_from_params && validator.isURL(redirect_url_from_params)) ? redirect_url_from_params : URL_DASHBOARD
        return redirect_url

    }

    return URL_DASHBOARD

}