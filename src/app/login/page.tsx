import { DEFAULT_LANGUAGE, DEFAULT_METADATA, URL_ADMIN_DASHBOARD, URL_DASHBOARD } from "#/defines/constants"
import Header from "@/components/common/HeaderClient"
import FullPageLoadingPlaceholder from "@/components/general/FullPageLoadingPlaceholder"
import { LoginForm } from "@/components/login/LoginForm"
import { serverTranslation } from "@/i18n"
import { auth } from "@/lib/auth"
import { getRedirectURLFromSearchParams } from "@/lib/helpers/frontend/params"
import { checkIfDbHasMoreThanOneUser, checkIfSignUpDisabledAnywhere } from "@/lib/helpers/frontend/sign-up-helpers"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import validator from "validator"
import  Card  from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Link from "next/link"
import { Alert, Button } from "@mui/material"

export async function generateMetadata({  searchParams }: {  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>  }){
  const lng = (await searchParams)?.lng?.toString() ?? DEFAULT_LANGUAGE
  const i18n= await serverTranslation(lng)

//   const slug = validator.escape(params.slug)
   let toReturn = DEFAULT_METADATA
//   const newMetaTags = []
  const pageTitle = `${i18n.t("DONATRON")} | ${i18n.t("LOGIN")}`

toReturn.title = pageTitle
toReturn.description = pageTitle
toReturn.openGraph={
  images:[{
    url: 'cover/default_cover_image.jpg'
  }
  ]
} 

return toReturn
  
}


export default async function Login({searchParams }:{ searchParams?: Promise<{ [key: string]: string | string[] | undefined }>}) {
  const lng = (await searchParams)?.lng?.toString() ?? DEFAULT_LANGUAGE
  const {t}= await serverTranslation(lng)

  // console.log("lng", lng)
  const redirect_url_from_param =  await getRedirectURLFromSearchParams(searchParams)
  const session = await auth.api.getSession({
          headers: await headers()
      })


  if(session){
    const redirect_as_logged_in = ("role" in session.user && session.user.role=="admin") ? URL_ADMIN_DASHBOARD: URL_DASHBOARD
    redirect(redirect_as_logged_in)
  }

  const hasMoreThanOneUser = await checkIfDbHasMoreThanOneUser ()
  const signUpDisabledAnyWhere = await checkIfSignUpDisabledAnywhere()
  const output = (hasMoreThanOneUser) ? <LoginForm  callbackURL={redirect_url_from_param} action="login" lng={lng} /> 
  : 
  (
    <div style={{marginTop: 20}}>
      <Alert sx={{marginBottom:3}} severity="error">{t("ERROR_NO_USERS")}</Alert>
    </div>
  )


  return (
      <Suspense fallback={<FullPageLoadingPlaceholder />}>
        <main style={{display:"flex", justifyContent:"center", alignItems:"center", minHeight:"100vh"}}>
            <Card sx={{ minWidth: "60%" }}>
                <CardContent>
                    <div style={{display:"flex", justifyContent:"center", alignItems:"center", height:"100%"}}>
                        <img width={200} src="/logo.jpg" />
                    </div>
                    {output}
                    {!signUpDisabledAnyWhere ?<div style={{textAlign:"center"}} ><Link href="/sign-up"><Button variant="text">{t("SIGN_UP")}</Button></Link> </div>: null}
                    
                </CardContent>
            </Card>
        </main>

      </Suspense>
        
  )
}
