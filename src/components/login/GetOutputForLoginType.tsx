import { serverTranslation } from "@/i18n"
import { getEnabledLoginProviders } from "@/lib/helpers/env"
import { Paper, Stack, Typography } from "@mui/material"
import React, { JSXElementConstructor, MouseEventHandler, ReactElement, Suspense } from "react"
import MailOutlineIcon from '@mui/icons-material/MailOutlined';
import LoginIcon from '@mui/icons-material/Login';
export const GetOutputForLoginTypeSingle = async ({name, icon, onClickFunction}: {name: string, icon: React.JSX.Element, onClickFunction: MouseEventHandler<HTMLDivElement>} ) =>{
    if(!name) return
    return(                            
        <Stack sx={{marginBottom:2}} key={name.toString()} onClick={onClickFunction}  spacing={2}>
        <Paper sx={{padding: 2}} elevation={3}>
            <Stack  spacing={5} direction="row">
                   {icon}
                <Typography>{name}</Typography>
            </Stack>
        </Paper>
        </Stack>

    )
    
}

export const GetOutputForLoginType = async ({lng, onClickEmail, onClickOAuth}:{lng:string, onClickEmail: any, onClickOAuth: any}) =>{
    const loginTypes = getEnabledLoginProviders()
    const i18n = await serverTranslation(lng)
    const finalOutput : React.JSX.Element[] = []

    if(loginTypes && Array.isArray(loginTypes) && loginTypes.length>0){

        for (const i in loginTypes){

            switch(loginTypes[i]){
                case "EMAIL":
                    finalOutput.push(<GetOutputForLoginTypeSingle key={loginTypes[i]} name={i18n.t(loginTypes[i])} icon={<MailOutlineIcon />} onClickFunction ={()=>onClickEmail()} />)
                    break;
        
                default:
                    finalOutput.push(<GetOutputForLoginTypeSingle key={loginTypes[i]} name={i18n.t(loginTypes[i])} icon={<LoginIcon />} onClickFunction ={()=>onClickOAuth(loginTypes[i])} />)
                    break;
            }
            
        }
    }

    return (
    <Suspense>
        Hi
    </Suspense>
    )

    
}
