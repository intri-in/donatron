import { DEFAULT_LANGUAGE, DEFAULT_METADATA } from "#/defines/constants"
import { AddOrgSimple } from "@/components/dasboard/Org/AddOrgSimple"
import { serverTranslation } from "@/i18n"
import { auth } from "@/lib/auth"
import { redirectToLoginPage } from "@/lib/helpers/auth"
import { getLanguageFromURLParameter } from "@/lib/helpers/frontend/params"
import { BetterAuthSessionObject } from "@/types/BetterAuth"
import { Typography } from "@mui/material"
import { headers } from "next/headers"
import { unauthorized } from "next/navigation"

export async function generateMetadata({  searchParams }: {  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>  }){
  const lng = (await searchParams)?.lng?.toString() ?? DEFAULT_LANGUAGE
  const {t}= await serverTranslation(lng)

//   const slug = validator.escape(params.slug)
   let toReturn = DEFAULT_METADATA
//   const newMetaTags = []
  const pageTitle = `${t("DONATRON")} | ${t("ADD_ORGANISATION", {ns : "organisation"})}`

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


export default async function AddOrganisationPage({searchParams }:{ searchParams?: Promise<{ [key: string]: string | string[] | undefined }>}){
    const lng= await getLanguageFromURLParameter(searchParams)
    const {t} = await serverTranslation(lng)
    const session = await auth.api.getSession({
      headers: await headers()
    })
    searchParams
    if(!session) {
      redirectToLoginPage("/dashboard/org/add")
      return
    }
    const canAddOrg = await auth.api.userHasPermission({
      body: {
        role:(session as BetterAuthSessionObject).user.role,
        permissions: {
          organisation: ["create"],
        },
      },
    })

    if (!canAddOrg) return unauthorized()
    
    

    return (
        <main>
            <Typography variant="h2" gutterBottom>{t("ADD_ORGANISATION", {ns: "organisation"})}</Typography>
            <AddOrgSimple lng={lng} session={session as BetterAuthSessionObject} />
        </main>

    )
}