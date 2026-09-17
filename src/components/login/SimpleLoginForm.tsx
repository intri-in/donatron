"use client"
import { URL_DASHBOARD } from "#/defines/constants"
import { useTranslationClient } from "@/i18n/client"
import { authClient } from "@/lib/auth-client"
import { useEnv } from "@/lib/helpers/frontend/EnvProvider"
import { Button, ButtonGroup, CircularProgress, FormControl, Stack, TextField } from "@mui/material"
import { useRouter } from "next/navigation"
import { MouseEventHandler, use, useState } from "react"
import { toast } from "react-toastify"
import isEmail from "validator/lib/isEmail"

export const SimpleLoginForm = ({lng , onBackClicked, callbackURL = URL_DASHBOARD}:{lng: string, onBackClicked:MouseEventHandler<HTMLButtonElement>, callbackURL? :string}) =>{
    const {OTP_LENGTH, MIN_PASSWORD_LENGTH} = useEnv()
    const {t} = useTranslationClient(lng)
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [emailValid, setEmailValid] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [showOTPScreen, setShowOTPScreen] = useState(false)
    const [otp, setOTP] = useState("")
    const [otpValid, setOTPValid] = useState(true)
    const [password, setPassword] =  useState("")
    const [passwordValid, setPasswordValid] = useState(true)
    const [resendButtonClicked, setResendButtonClicked] = useState(false)
    const onLoginClicked = async() =>{
        const valid = checkEmailisValid()
        if(valid){
            setIsLoading(true)
            const { data, error } = await authClient.emailOtp.sendVerificationOtp({
                email: email,
                type: "sign-in"
            });         
            console.log("data, error", data)
            setIsLoading(false)
            if(error){
                const message = (error.status==429) ? "TOO_MANY_REQUESTS": "ERROR_GENERIC_MESSAGE"
                console.error("LoginForm /login/ emailOtp.sendVerificationOtp",error.code)
                toast.error(t(message))
                if(error.status==429){
                    setOTP("")
                    setEmail("")
                    setShowOTPScreen(false)
                    return
                }
            }

            setShowOTPScreen(true)
        }

    }
    const checkEmailisValid = () =>{
        if(!isEmail(email)){
            setEmailValid(false)
            toast.error(t("ERROR_INVALID_EMAIL"))
            return false

        }
        setEmailValid(true)


        return true

    }
    const onOTPSubmit = async()=>{
        if(!otp || otp && otp.length<OTP_LENGTH){
            toast.error(t("INVALID_OTP"))
            return
        }
        const { data, error } = await authClient.signIn.emailOtp({
        email: email, 
        otp: otp
        });
        setIsLoading(false)
        if(error){
            if(error.status==429){
                toast.error(t("TOO_MANY_REQUESTS", {ns :"errors"}))
                return
            }
            const code = error.code ? error.code : "ERROR_GENERIC_MESSAGE"
            toast.error(t(code))
            console.info("LoginForm /login/ emailOtp.sendVerificationOtp",error)
            return

        }
        if(data){
            router.push(callbackURL)
        }

    }

    const checkPasswordisValid =  () =>{
        if(!password){
            setPasswordValid(false)
            toast.error(t("ERROR_VALID_PASSWORD", {length: MIN_PASSWORD_LENGTH}))
            return false

        }
        // if(password.length < getMinimumPasswordLength()){
        //     setPasswordValid(false)
        //     toast.error(t("ERROR_VALID_PASSWORD", {length: getMinimumPasswordLength()}))
        //     return false
        // }

        return true

    }
    const loginWithPassWordClicked = async () =>{
        if(checkPasswordisValid() && checkEmailisValid()){
            setEmailValid(true)
            setPasswordValid(true)
            setIsLoading(true)

            const {data, error} = await authClient.signIn.email({
            email: email, // required
            password: password, // required
            rememberMe: true,
            callbackURL: callbackURL,
            });

            console.log("data, error", data, error,callbackURL)
            if(!error){
                router.push(callbackURL)
            }else{
                toast.error(t(error.code))
                setIsLoading(false)
            }

        }
    }
    const resendOTPButtonClicked = () =>{
        // setResendButtonClicked(true)
        onLoginClicked()
    }
    if(showOTPScreen){
        return(
        <FormControl fullWidth={true}>
            <Stack direction="column" spacing={3}>
                
                <TextField
                required
                id="otp"
                value={otp}
                error={!otpValid}
                slotProps={{ htmlInput: { maxLength: OTP_LENGTH } }}
                onChange={(e)=>{setOTP(e.target.value)}}
                label={t("OTP")}
                />
                {!isLoading ?
                (
                    <>
                        <ButtonGroup fullWidth={true} aria-label="Basic button group"> 
                            <Button onClick={onBackClicked}>{t("BACK")}</Button>
                            <Button onClick={onOTPSubmit} variant="contained">{t("SUBMIT")}</Button>  
                        </ButtonGroup>
                        {!resendButtonClicked ? <Button onClick={resendOTPButtonClicked} variant="text">{t("RESEND_OTP")}</Button>:<></>}
                    </>

                ): <div style={{textAlign:"center"}}><CircularProgress /></div>
                }           
            </Stack>
        </FormControl>
        )
    }
    return(
      <FormControl fullWidth={true}>
        <Stack direction="column" spacing={3}>
            
            <TextField
            required
            id="email"
            type="email"
            value={email}
            error={!emailValid}
            disabled={isLoading}
            slotProps={{ htmlInput: { maxLength: 60 } }}
            onChange={(e)=>{setEmail(e.target.value)}}
            label={t("EMAIL")}
            />
            <TextField
            required
            id="password"
            type="password"
            disabled={isLoading}
            value={password}
            error={!passwordValid}
            slotProps={{ htmlInput: { maxLength: 60 } }}
            onChange={(e)=>{setPassword(e.target.value)}}
            label={t("PASSWORD")}
            />
        {!isLoading ?
        (<>
            <Button onClick={loginWithPassWordClicked} variant="contained" >{t("LOGIN_WITH_PASSWORD")}</Button>
            <ButtonGroup fullWidth={true} aria-label="Basic button group">    
                <Button onClick={onBackClicked}>{t("BACK")}</Button>
                <Button onClick={onLoginClicked} >{t("LOGIN_WITH_EMAIL_OTP")}</Button>
            </ButtonGroup>
        </>)
        : <div style={{textAlign:"center"}}><CircularProgress /></div>
        }
        </Stack>  

        </FormControl>
    )
}
