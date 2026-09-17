import { Organisation } from "#/generated/prisma/client"
import { APIResponseData } from "@/types/api/response"
import { getAPIURL } from "../../env"

export async function getAllUser(url:string): Promise<Organisation[] | null>{
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
            console.error("getAllUserQuizzes", e)
            return reject(e.message)
          })
      })


}