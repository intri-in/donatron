"use client"
import {  URL_DASHBOARD } from "#/defines/constants"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Container from "@mui/material/Container"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import Paper from '@mui/material/Paper';
import MailOutlineIcon from '@mui/icons-material/MailOutlined';
import React, { JSXElementConstructor, MouseEventHandler, ReactElement, Suspense, useEffect, useState } from "react"
import { authClient } from "@/lib/auth-client"
import { useTranslationClient } from "@/i18n/client"
import LoginIcon from '@mui/icons-material/Login';
import { Alert, Button } from "@mui/material"
import { SignupWithEmailForm } from "./SignupWithEmailForm"
import { SimpleLoginForm } from "./SimpleLoginForm"
import { getEnabledLoginProviders } from "@/lib/helpers/env"
import { useEnv } from "@/lib/helpers/frontend/EnvProvider"
import Link from "next/link"
const GetOutputForLoginType = ({name, icon, onClickFunction}: {name: string | ReactElement<unknown, string | JSXElementConstructor<any>>, icon: React.JSX.Element, onClickFunction: MouseEventHandler<HTMLDivElement>} ) =>{
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
export const LoginForm =  ({lng , callbackURL = URL_DASHBOARD, action='login', admin=false, showSignUpLink=false}:{lng: string, callbackURL? :string, action?: string, admin?: boolean, showSignUpLink? :boolean}) => {
    const {AUTH_ENABLED_PROVIDERS} = useEnv()
    const [showScreenTwo, setShowScreenTwo] = useState(false)
    const [loginTypes, setLoginTypes ] = useState<string []>([])
    const {t} = useTranslationClient(lng)
    useEffect(()=>{
            setLoginTypes(AUTH_ENABLED_PROVIDERS)
    },[AUTH_ENABLED_PROVIDERS])

    const onClickOAuth = async (name: string) =>{
        const response = await authClient.signIn.oauth2({
        providerId: name,
        callbackURL: callbackURL, // the path to redirect to after the user is authenticated
        });
    }
    const onClickEmail = async () =>{
        setShowScreenTwo(true)
    }
    const backClickedSignup = () =>{
        setShowScreenTwo(false)
    }
    const i18n = useTranslationClient(lng)
    const title = (action!="signup") ? i18n.t("LOGIN", {ns:"generic"}) : i18n.t("SIGN_UP")
    let finalOutput: React.JSX.Element[] = []
    if(showScreenTwo){
        if(action=="signup"){

            finalOutput.push(<SignupWithEmailForm callbackURL={callbackURL} onBackClicked={backClickedSignup} key="signup-form-email" admin={admin} lng={lng} />)
        }else{
            finalOutput.push(<SimpleLoginForm callbackURL={callbackURL} onBackClicked={backClickedSignup} key="loginForm-email" lng={lng} />)

        }
    }else{
        if(loginTypes && Array.isArray(loginTypes)){

            for (const i in loginTypes){
    
                switch(loginTypes[i]){
                    case "EMAIL":
                        finalOutput.push(<GetOutputForLoginType key={loginTypes[i]} name={i18n.t(loginTypes[i])} icon={<MailOutlineIcon />} onClickFunction ={()=>onClickEmail()} />)
                        break;
            
                    default:
                        finalOutput.push(<GetOutputForLoginType key={loginTypes[i]} name={i18n.t(loginTypes[i])} icon={<LoginIcon />} onClickFunction ={()=>onClickOAuth(loginTypes[i])} />)
                        break;
                }
                
            }
        }
    }
    
    return(
        <Suspense>

            <>
                <Typography gutterBottom variant="h4">{title}</Typography>
                {admin? <Alert sx={{marginBottom:3}} severity="info">{i18n.t("ADMIN_INFO_ALERT")}</Alert> : <></>}
                {finalOutput}
            </>
        </Suspense>
    )
}