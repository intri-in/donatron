import { prisma } from "@/lib/prisma"
import { getIfSignUpAllowedInEnvironment, getMaxNumberofManagersFromEnv } from "../env"

export async function checkIfSignUpDisabledAnywhere(): Promise<boolean>{
    //Since the db has more than one user, we check if the sign up is disabled in .env or settings.
    const signUpAllowedInEnv =  getIfSignUpAllowedInEnvironment()
    //TODO check the value in db
    if(!signUpAllowedInEnv) return true
    return false
}
export async function checkIfDbHasMoreThanOneUser(){
    const allUsers =   await prisma.user.findMany()
    const hasMoreThanOneUser = (allUsers && Array.isArray(allUsers) && allUsers.length>0)
    return hasMoreThanOneUser

} 
export async function isSignUpAllowed():Promise<{allowed: boolean, signUpAs?: "admin" | "manager"}>{
    const hasMoreThanOneUser = await checkIfDbHasMoreThanOneUser ()
    if(!hasMoreThanOneUser) return {allowed: true, signUpAs: "admin"} 
    const signUpDisabled = await checkIfSignUpDisabledAnywhere()
    if(signUpDisabled) return {allowed: false}
    
    const allManagers =   await prisma.user.findMany({where: {role:"manager"}})
    if(allManagers && Array.isArray(allManagers) && allManagers.length>=getMaxNumberofManagersFromEnv()){

        return {allowed: false}
        
    }else{
        return {allowed: true, signUpAs:"manager"}
    }

}

