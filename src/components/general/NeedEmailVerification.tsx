"use client"
import { Suspense, useState } from "react"
import FullPageLoadingPlaceholder from "./FullPageLoadingPlaceholder"
import { Alert, Box, Button, Paper } from "@mui/material"
import { authClient } from "@/lib/auth-client"
import { useTranslationClient } from "@/i18n/client"

export const NeedEmailVerification  = ({lng, callBackURL, email}:{lng:string, callBackURL:any, email:any}) =>{
    const [emailSent, setEmailSent] = useState(false)
    const {t} = useTranslationClient(lng)
    const verifyEmailClicked = () =>{
        authClient.sendVerificationEmail({email: email, callbackURL: callBackURL})
        setEmailSent(true)
    }
    return(
            <Suspense fallback={<FullPageLoadingPlaceholder />}>
                <Paper sx={{padding: 2, mb: 2}} elevation={3}>
                    <Alert severity="error">{t("EMAIL_UNVERIFIED_ERROR",{ns: "errors"})}</Alert>
                    <Box sx={{textAlign:"end", marginTop:5}}>
                    {!emailSent? <Button onClick={verifyEmailClicked} variant="contained">{t("VERIFY_EMAIL", {ns: "generic"})}</Button> :<></>}
                    </Box>
                </Paper>
            </Suspense>

    )

}