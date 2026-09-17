import { addTrailingSlashtoURL } from "./general"
export const ENV_VAR__AUTH_ENABLED_PROVIDERS ="AUTH_ENABLED_PROVIDERS"
export const ENV_VAR__MIN_PASSWORD_LENGTH = "MIN_PASSWORD_LENGTH"
export function getBaseURL(){
    if(typeof(window)!=="undefined"){
        return addTrailingSlashtoURL(window.location.origin)
    }
    if(!process.env.BASE_URL) throw new Error("BASE_URL param not defined.")
    return process.env.BASE_URL
}
export function getAPIURL(){
    return addTrailingSlashtoURL(getBaseURL())+'api/'
}

export function getLogLevel(){
    return process.env.LOG_LEVEL?? "debug"
}


export function getMinimumPasswordLengthServerSide(){
    if(!process.env[ENV_VAR__MIN_PASSWORD_LENGTH]) return 8
    const length = parseInt(process.env[ENV_VAR__MIN_PASSWORD_LENGTH])
    if(isNaN(length)) return 8
    return length
}

export function getIfEmailSignupEnabledServerSide(){
    const enabledProviders =  getEnabledLoginProvidersServerSide()
    return enabledProviders.includes("EMAIL")
}

export function getOTPLength(){
    if(!process.env.OTP_LENGTH) return 6
    const length = parseInt(process.env.OTP_LENGTH)
    if(isNaN(length)) return 8
    return length

}

export function getEnabledLoginProvidersServerSide(): string []{

    if(!process.env[ENV_VAR__AUTH_ENABLED_PROVIDERS]) return []
    const toReturnArray = JSON.parse(process.env[ENV_VAR__AUTH_ENABLED_PROVIDERS])
    if(toReturnArray && Array.isArray(toReturnArray)) return toReturnArray
    return []
       

}
export async function getEnabledLoginProviders(): Promise<string[]>{
    if(typeof(window)==="undefined"){
        return getEnabledLoginProvidersServerSide()
    }
    return []
}

export function getIfSignUpAllowedInEnvironment(){
    if(process.env.SIGN_UP_ALLOWED && process.env.SIGN_UP_ALLOWED=="true") return true
    return false
} 

export function getMaxNumberofManagersFromEnv(): number{
    const noOfManagers = (process.env.MAX_NO_OF_MANAGERS) ? Number(process.env.MAX_NO_OF_MANAGERS) : 5
    return noOfManagers
}