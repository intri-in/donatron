"use client"
import FullPageLoadingPlaceholder from "@/components/general/FullPageLoadingPlaceholder"
import { useTranslationClient } from "@/i18n/client"
import { getSuccessFromAPIReponse } from "@/lib/helpers/api/parsers"
import { getAPIURL } from "@/lib/helpers/env"
import { redirect, unauthorized } from "next/navigation"
import { useEffect, useState } from "react"
const makeRequestToAssignAdmin = () : Promise<boolean> =>{
    return new Promise( (resolve, reject) => {
      const url_api=getAPIURL()+"sign-up/admin/finalise"

        const requestOptions = {
            method: 'POST',
            mode: 'cors',
        }
    
        fetch(url_api, requestOptions as RequestInit)
        .then(response =>{
            return response.json()
          })
        .then((body) =>{
            const response = getSuccessFromAPIReponse(body)
          return resolve(response)
        }
      ).catch( (e)=>{
        console.error("makeRequestToAssignAdmin", e)
        return resolve(false)
      })
    })

}

export const FinaliseAdminRegistration = ({lng}:{lng:string}) =>{
    const i18n =  useTranslationClient(lng)
    useEffect(()=>{

        makeRequestToAssignAdmin().then(resp =>{
            if(resp){
            }
            redirect("/admin/dashboard/")

        })

    },[])

    return(
        <FullPageLoadingPlaceholder />
    )
}