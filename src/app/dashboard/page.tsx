import { DEFAULT_LANGUAGE, DEFAULT_METADATA, URL_DASHBOARD } from "#/defines/constants";
import { serverTranslation } from "@/i18n";
import { auth } from "@/lib/auth";
import { redirectToLoginPage } from "@/lib/helpers/auth";
import { getLanguageFromURLParameter } from "@/lib/helpers/frontend/params";
import { Container, Paper, Typography } from "@mui/material";
import { headers } from "next/headers";
import Header from "@/components/common/HeaderClient";
import { cookies } from 'next/headers';
import { redirect, unauthorized } from 'next/navigation';
import { OrganisationList } from "@/components/dasboard/Org/OrganisationList";
import { prisma } from "@/lib/prisma";
import { BetterAuthSessionObject } from "@/types/BetterAuth";
export async function generateMetadata({  searchParams }: {  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>  }){
  const lng = (await searchParams)?.lng?.toString() ?? DEFAULT_LANGUAGE
  const {t}= await serverTranslation(lng)

//   const slug = validator.escape(params.slug)
   let toReturn = DEFAULT_METADATA
//   const newMetaTags = []
  const pageTitle = `${t("DONATRON")} | ${t("DASHBOARD")}`

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


export default async function DashboardPage({searchParams }:{ searchParams?: Promise<{ [key: string]: string | string[] | undefined }>}) {
    const lng= await getLanguageFromURLParameter(searchParams)
    const {t} = await serverTranslation(lng)
    const session = await auth.api.getSession({
      headers: await headers()
    })
    
    if(!session) {
      redirectToLoginPage("/dashboard")
      return
    }
    const orgId = (await cookies()).get('orgId')
    if(orgId) redirect(`/org/${orgId}`)
      const canViewOrgs = await auth.api.userHasPermission({
    body: {
      role:(session as BetterAuthSessionObject).user.role,
      permissions: {
        organisation: ["list-owned", "create"],
      },
    },
  })

    if (canViewOrgs.error) return <></>
    if(!canViewOrgs.success) return unauthorized()
    
    const orgList = await prisma.organisation.findMany({
        where:{
            userId: session.user.id
        },
        orderBy:{
            updatedAt:"desc"
        }
    }).catch(e=>{
    })
    return (
        <main>
              <Header lng={lng} title="DASHBOARD" path={URL_DASHBOARD} />
              <Typography align="center" sx={{paddingBottom:5}} variant="subtitle1">{`${t("WELCOME")}, ${session!.user.name}`}</Typography>
              <Container maxWidth="xl">
                <OrganisationList lng={lng} session={session as BetterAuthSessionObject} orgList={orgList} />
              </Container>
        </main>
    )
}