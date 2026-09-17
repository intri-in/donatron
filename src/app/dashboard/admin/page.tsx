import { DEFAULT_LANGUAGE, DEFAULT_METADATA, URL_ADMIN_DASHBOARD } from "#/defines/constants";
import { serverTranslation } from "@/i18n";
import { auth } from "@/lib/auth";
import { redirectToLoginPage } from "@/lib/helpers/auth";
import { getLanguageFromURLParameter } from "@/lib/helpers/frontend/params";
import { Box, Breadcrumbs, Container, Divider, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";
import { headers } from "next/headers";
import Header from "@/components/common/HeaderClient";
import { cookies } from 'next/headers';
import { redirect, unauthorized } from 'next/navigation';
import { OrganisationList } from "@/components/dasboard/Org/OrganisationList";
import { prisma } from "@/lib/prisma";
import { BetterAuthSessionObject } from "@/types/BetterAuth";
import PersonIcon from '@mui/icons-material/Person';
import InfoIcon from '@mui/icons-material/Info';
export async function generateMetadata({  searchParams }: {  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>  }){
  const lng = (await searchParams)?.lng?.toString() ?? DEFAULT_LANGUAGE
  const {t}= await serverTranslation(lng)

//   const slug = validator.escape(params.slug)
   let toReturn = DEFAULT_METADATA
//   const newMetaTags = []
  const pageTitle = `${t("DONATRON")} | ${t("ADMIN_DASHBOARD")}`

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


export default async function AdminDashboardPage({searchParams }:{ searchParams?: Promise<{ [key: string]: string | string[] | undefined }>}) {
    const lng= await getLanguageFromURLParameter(searchParams)
    const {t} = await serverTranslation(lng)
    const session  = await auth.api.getSession({
      headers: await headers()
    }) as BetterAuthSessionObject
    
    if(!session) {
      redirectToLoginPage("/dashboard/admin")
      return
    }
    if(("role" in session.user ) && session.user.role!="admin"){
      return unauthorized()

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
              <Header lng={lng} title="ADMIN_DASHBOARD" path={URL_ADMIN_DASHBOARD} />
                <Container maxWidth="xl">
                  <Grid container spacing={2}>
                    <Grid size={3}>
                          <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                <nav aria-label="main mailbox folders">
                                  <List>
                                    <ListItem disablePadding>
                                      <ListItemButton>
                                        <ListItemIcon>
                                          <InfoIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={t("INFORMATION")} />
                                      </ListItemButton>
                                    </ListItem>
                                    <ListItem  disablePadding>
                                      <ListItemButton selected={true}>
                                        <ListItemIcon>
                                          <PersonIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={t("USERS")} />
                                      </ListItemButton>
                                    </ListItem>
                                  </List>
                                </nav>
                                <Divider />
                            </Box>
                    </Grid>
                    <Grid size={9}>
                      left
                    </Grid>
                  </Grid>
                </Container>
        </main>
    )
}