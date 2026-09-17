import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirectToLoginPage } from "../auth"

export const checkAccess_ServerSide = async  (redirect_url: string, type?:string[]) => {
    const session = await auth.api.getSession({
      headers: await headers()
  })
  if(!session) {
    redirectToLoginPage(redirect_url)
    return null
  }
  if(!type) return session

  if(!("role" in session.user)) {
  redirectToLoginPage(redirect_url)
    return null
  }

  if(!type.includes(session.user.role as string))
    return null




    return session

    
}