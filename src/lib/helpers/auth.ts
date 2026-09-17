import { redirect } from "next/navigation";

export function redirectToLoginPage(redirect_url?: string){
    let finalURL = `/login`
    if(redirect_url){
        finalURL += `?redirect_url=${redirect_url}`
    }
    redirect(finalURL)

}

