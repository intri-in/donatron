import { APIResponseData } from "@/types/api/response"
import { getAPIURL } from "./env"

export async function genericFetcher(url:string): Promise<any[] | null>{
    // console.log("url", url)
    return new Promise( (resolve, reject) => {
        const url_api=getAPIURL()+url
  
          const requestOptions = {
              method: 'GET',
              mode: 'cors',
          }
      
          fetch(url_api, requestOptions as RequestInit)
          .then(response =>{
              return response.json()
            })
          .then((body: APIResponseData) =>{
            if(body && body.success && body.data && body.data.data){

                // return resolve({data: body.data.data as Quiz[],
                    error:""
                // })
                return resolve(body.data.data)
            }else{
                const error_code = body.data.error_code ?? "ERROR_GENERIC"
                throw new Error(error_code)

            }
          }).catch(e =>{
            console.error("genericFetcher", e)
            return reject(e.message)
          })
      })


}
export function addTrailingSlashtoURL(url:string)
{
    if(!url)return ""
    let lastChar = url.substr(-1);     
    if (lastChar != '/') {       
    url = url + '/';          
    }

    return url

}

export function getMessageFromAPIResponse(body: any){
    if(!body) return
    if(!body.data) return
    if (!body.data.message) return
    return body.data.message

}

export function getDataFromAPIResponse(body: any){
    if(!body) return
    if(!body.data) return
    if (!body.data.data) return
    return body.data.data
}