import { getSuccessFromAPIReponse } from "../../api/parsers"
import { getAPIURL } from "../../env"

export const getIfAllowedtoAccessAdminCreation_ClientSide = async () =>{
    return new Promise( (resolve, reject) => {
      const url_api=getAPIURL()+"sign-up/admin/check"

        const requestOptions = {
            method: 'GET',
            mode: 'cors',    
        }
    
        fetch(url_api, requestOptions as RequestInit)
        .then(response =>{
            return response.json()
          })
        .then((body) =>{
          return resolve(getSuccessFromAPIReponse(body))
        }
      ).catch( (e)=>{
        console.error("getIfAllowedtoAccess", e)
        return resolve(false)
      })

    })
        
}
