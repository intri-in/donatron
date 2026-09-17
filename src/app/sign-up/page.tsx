import { DEFAULT_LANGUAGE, DEFAULT_METADATA } from "#/defines/constants"
import FullPageLoadingPlaceholder from "@/components/general/FullPageLoadingPlaceholder"
import { LoginForm } from "@/components/login/LoginForm"
import { serverTranslation } from "@/i18n"
import { Suspense } from "react"
import { unauthorized } from 'next/navigation'
import { getSuccessFromAPIReponse } from "@/lib/helpers/api/parsers"
import { getAPIURL } from "@/lib/helpers/env"
import { isSignUpAllowed } from "@/lib/helpers/frontend/sign-up-helpers"
import { Card, CardContent } from "@mui/material"
export async function generateMetadata({  searchParams }: {  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>  }){
  const lng = (await searchParams)?.lng?.toString() ?? DEFAULT_LANGUAGE
  const i18n= await serverTranslation(lng)

//   const slug = validator.escape(params.slug)
   let toReturn = DEFAULT_METADATA
//   const newMetaTags = []
  const pageTitle = `${i18n.t("DONATRON")} | ${i18n.t("SIGN_UP")}`

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


export default async function SimpleSignUp({searchParams }:{ searchParams?: Promise<{ [key: string]: string | string[] | undefined }>}) {
  const lng = (await searchParams)?.lng?.toString() ?? DEFAULT_LANGUAGE
  const allowed = await isSignUpAllowed()  
  if(!allowed.allowed){
    return unauthorized()
  }
  return (
      <Suspense fallback={<FullPageLoadingPlaceholder />}>
        <main style={{display:"flex", justifyContent:"center", alignItems:"center", minHeight:"100vh"}}>
            <Card sx={{ minWidth: "60%" }}>
                <CardContent>
                    <div style={{display:"flex", justifyContent:"center", alignItems:"center", height:"100%"}}>
                        <img width={200} src="/logo.jpg" />
                    </div>      
                    <LoginForm callbackURL={(allowed.signUpAs && allowed.signUpAs=="admin") ? "/sign-up/admin/finalise" :"/dashboard/"} admin={(allowed.signUpAs && allowed.signUpAs=="admin") ? true: false} lng={lng} action="signup" />
                </CardContent>
              </Card>
          </main>
      </Suspense>
        
  )
}