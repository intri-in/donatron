"use client"
import FullPageLoadingPlaceholder from "@/components/general/FullPageLoadingPlaceholder";
import { useTranslationClient } from "@/i18n/client";
import { getAPIURL } from "@/lib/helpers/env";
import { getMessageFromAPIResponse } from "@/lib/helpers/general";
import { BetterAuthSessionObject } from "@/types/BetterAuth";
import {  Box, Button, CircularProgress, Paper, Stack, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export const AddOrgSimple = ({lng, session}: {lng: string, session: BetterAuthSessionObject}) =>{
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState("")
    const {t} = useTranslationClient(lng)
    const router = useRouter()
    const backClicked = () =>{
        router.back()
    }
    const onAddClicked = () =>{
        setIsLoading(true)
        makeSaveRequest()
    }
    const nameChanged = (e: any) =>{
        setName(e.target.value)
    }
      const makeSaveRequest = () =>{
      fetch(`${getAPIURL()}org/add`, {
      method: 'POST',
      body: JSON.stringify({name: name}),
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json()).then(body=>{
      if(!body || !body.success){
        console.log("CreateOrg makeSaveRequest response->", body)
        toast.error(t("ERROR_GENERIC_MESSAGE", {ns:"errors"}))
      }else{
        const id = getMessageFromAPIResponse(body)
        if(!id){
          router.push("/dashboard")
        }else{
          router.push(`/dashboard/quiz/${id}`)
        }
      }

    }).catch(e=>{
        console.log("CreateQuiz makeSaveRequest response->", e)
        toast.error(t("ERROR_GENERIC_MESSAGE", {ns:"errors"}))

    })

  }
    return(
        <Paper sx={{padding: 5}} elevation={2}>
            <TextField value={name} onChange={nameChanged} sx={{width: "100%"}} id="outlined-basic" label={t("NAME")} variant="outlined" />
            <Box sx={{display:"flex", justifyContent:"flex-end", marginTop: 5}}>
                {
                    !isLoading ? 
                    (<Stack direction={"row"} sx={{}}>
                    <Button onClick={backClicked} color="secondary">{t("BACK")}</Button>
                    <Button onClick={onAddClicked}  variant="contained">{t("ADD")}</Button>
                    </Stack>)
                    :
                    <CircularProgress />
                    
                }
            </Box>
        </Paper>
    ) 

}