import { getBaseURL } from "@/lib/helpers/env"
import { Metadata } from "next"


export const SUPPORTED_LANGUAGES = ["en", "hi"]
export const DEFAULT_LANGUAGE = "en"

export const DEFAULT_METADATA: Metadata = {
    title:"Donatron - Donation Receipt Manager",
    metadataBase: new URL(getBaseURL()),
    description:"A self-hosted tool for managing donation receipts.",
    keywords:"donation, self-hosted, open-source",
    icons:[
        {
            rel:"icon",
            url:"/logo.jpg"
        }
    ],
    openGraph:{
        images:[{
            url:"/cover/archiveCover.jpg"

        }
     ]    
    
    }
}


export const URL_DASHBOARD= "/dashboard"
export const URL_ADMIN_DASHBOARD= "/dashboard/admin"


export const QUIZ_IDENTIFIER_LENGTH=16