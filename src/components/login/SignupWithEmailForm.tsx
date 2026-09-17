import { useTranslationClient } from "@/i18n/client"
import { Button, ButtonGroup, FormControl, Stack, TextField } from "@mui/material"
import { MouseEventHandler, useState } from "react"
import SimpleSnackbar from "../general/Snackbar"
import { toast } from "react-toastify"
import isEmail from 'validator/lib/isEmail';
import { authClient } from "@/lib/auth-client"
import { redirect, RedirectType } from 'next/navigation'
import { role } from "better-auth/plugins"
import { useEnv } from "@/lib/helpers/frontend/EnvProvider"

export const SignupWithEmailForm =  ({lng , onBackClicked, callbackURL = '/dashboard', admin}:{lng: string, onBackClicked:MouseEventHandler<HTMLButtonElement>, callbackURL? :string, action?: string, admin?: boolean}) => {
    const { MIN_PASSWORD_LENGTH } = useEnv()
    const i18n = useTranslationClient(lng)
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [email, setEmail] = useState("")
    const [nameValid, setNameValid] = useState(true)
    const [emailValid, setEmailValid] = useState(true)
    const [passwordValid, setPasswordValid] = useState(true)
    const [confirmPasswordValid, setConfirmPasswordValid] = useState(true)
    const onSignUpClicked = async () =>{
        const isValid =  await formIsValid()
        if(isValid){
            //Make the request.
            const { data, error } = await authClient.signUp.email({
                name: name, 
                email: email, // required
                password: password, // required
            });    
            if(error){
                if(error.code){
                    toast.error(i18n.t(error.code))
                }else{
                    toast.error(i18n.t("ERROR_GENERIC_MESSAGE"))
                }

                return
            }

            redirect(callbackURL)
        }
    }


    const formIsValid =  () =>{
        if(!name){
            toast.error(i18n.t("ERROR_INVALID_NAME"))
            setNameValid(false)
            return false
        }
        setNameValid(true)

        if(!isEmail(email)){
            setEmailValid(false)
            toast.error(i18n.t("ERROR_INVALID_EMAIL"))
            return false

        }
        setEmailValid(true)

        const minPassLength = MIN_PASSWORD_LENGTH
        if(!password || password && password.length<minPassLength){
            setPasswordValid(false)
            toast.error(i18n.t("ERROR_VALID_PASSWORD",{length: minPassLength}))
            return false
        }
        setPasswordValid(true)
        
        if(!confirmPassword || (password && password!==confirmPassword)){
            setConfirmPasswordValid(false)
            toast.error(i18n.t("ERROR_VALID_CONFIRM_PASSWORD"))
            return false
        }
        setConfirmPasswordValid(true)

        return true

    }
    return(<FormControl fullWidth={true}>
        <Stack direction="column" spacing={3}>
            <TextField
            required
            id="name"
            label={i18n.t("NAME")}
            value={name}
            error={!nameValid}
            slotProps={{ htmlInput: { maxLength: 60 } }}
            onChange={(e)=>{setName(e.target.value)}}
            />
            <TextField
            required
            id="email"
            type="email"
            value={email}
            error={!emailValid}
            slotProps={{ htmlInput: { maxLength: 60 } }}
            onChange={(e)=>{setEmail(e.target.value)}}
            label={i18n.t("EMAIL")}
            />
            <TextField
            required
            id="password"
            label={i18n.t("PASSWORD")}
            value={password}
            type="password"
            error={!passwordValid}
            slotProps={{ htmlInput: { maxLength: 60 } }}
            onChange={(e)=>{setPassword(e.target.value)}}
            />
            <TextField
            required
            id="confirm-password"
            label={i18n.t("CONFIRM_PASSWORD")}
            value={confirmPassword}
            type="password"
            error={!confirmPasswordValid}
            slotProps={{ htmlInput: { maxLength: 60 } }}
            onChange={(e)=>{setConfirmPassword(e.target.value)}}
            />
{/* 
            {
                !admin ?
                <Button variant="outlined">{i18n.t("SIGN_UP_WITH_EMAIL_OTP")}</Button>
                :
                <></>
            } */}
            <ButtonGroup fullWidth={true} aria-label="Basic button group">    
                <Button onClick={onBackClicked}>{i18n.t("BACK")}</Button>
                <Button onClick={onSignUpClicked} variant="contained">{i18n.t("SIGN_UP")}</Button>
            </ButtonGroup>
        </Stack>
        
        </FormControl>
    )

}