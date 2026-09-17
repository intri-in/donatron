import { DEFAULT_LANGUAGE, DEFAULT_METADATA } from "#/defines/constants"
import FullPageLoadingPlaceholder from "@/components/general/FullPageLoadingPlaceholder"
import { LoginForm } from "@/components/login/LoginForm"
import { serverTranslation } from "@/i18n"
import { Suspense } from "react"
import { unauthorized } from 'next/navigation'
import { getSuccessFromAPIReponse } from "@/lib/helpers/api/parsers"
import { getAPIURL } from "@/lib/helpers/env"
import { getIfAllowedtoAccessAdminCreation } from "@/lib/helpers/frontend/admin/access"
export async function generateMetadata({  searchParams }: {  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>  }){
  const lng = (await searchParams)?.lng?.toString() ?? DEFAULT_LANGUAGE
  const i18n= await serverTranslation(lng)

//   const slug = validator.escape(params.slug)
   let toReturn = DEFAULT_METADATA
//   const newMetaTags = []
  const pageTitle = `${i18n.t("DONATRON")} | ${i18n.t("ADMIN_SIGN_UP")}`

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


export default async function AdminSignUp({searchParams }:{ searchParams?: Promise<{ [key: string]: string | string[] | undefined }>}) {
  const lng = (await searchParams)?.lng?.toString() ?? DEFAULT_LANGUAGE
  const allowed = await getIfAllowedtoAccessAdminCreation()  
  if(!allowed){
    return unauthorized()
  }
  return (
      <Suspense fallback={<FullPageLoadingPlaceholder />}>
        <LoginForm callbackURL="/sign-up/admin/finalise" admin={allowed ? true: false} lng={lng} action="signup" />
      </Suspense>
        
  )
}