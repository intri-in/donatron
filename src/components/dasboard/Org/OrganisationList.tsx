import { Organisation } from "#/generated/prisma/client";
import { BetterAuthSessionObject } from "@/types/BetterAuth";
import { Fetcher } from "swr";
import { genericFetcher } from "@/lib/helpers/general";
import { auth } from "@/lib/auth";
import { TFunction } from "i18next";
import { OrganisationTable } from "./OrganisationTable";
import { role } from "better-auth/plugins";
const PAGE_SIZE = 3
const fetcher: Fetcher<Organisation[] | null, string> = (url) =>  genericFetcher(url)

const getKey = (page: number, previousPageData: any) => {
  if (previousPageData && !previousPageData.length) return null // reached the end
  return `/quiz/list?skip=${page*3}`
}
export const OrganisationList =  async({lng, session, orgList}:{lng: string, session:BetterAuthSessionObject | null, orgList: Organisation[]| void} ) =>{
        if(!session) return
        
        const canAddOrgs = await auth.api.userHasPermission({
        body: {
            role: session.user.role,
            permissions: {
                organisation: ["create"],
                },
            },
        },
        )
        if(!canAddOrgs) return
        if(canAddOrgs.error)  return
        if(!canAddOrgs.success)  return
        return <OrganisationTable canAddOrgs={canAddOrgs.success} lng={lng} data={orgList} />
    
    
}

