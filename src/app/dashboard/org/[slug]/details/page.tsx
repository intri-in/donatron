import { DEFAULT_LANGUAGE, DEFAULT_METADATA } from "#/defines/constants"
import { serverTranslation } from "@/i18n"

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


export default async function AddOrgPage({searchParams }:{ searchParams?: Promise<{ [key: string]: string | string[] | undefined }>}) {
    return(
        <>
        hi
        </>
    )
}