import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '#/defines/constants'
import { createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next/initReactI18next'
export const fallbackLng = 'en'

export const defaultNS = 'generic'
export const cookieName = 'i18next'
export interface additionalResources{
  ns: string,
  data: any
}
export async function initI18next(lng_input: string, ns: string, additionalResources? : additionalResources[],options?: any){
  const lng =  (SUPPORTED_LANGUAGES.includes(lng_input)) ? lng_input : DEFAULT_LANGUAGE
  const i18nInstance = createInstance()
  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend((language: string, namespace: string) => {
      return import(`./locales/${language}/${namespace}.json`)
    }))
    .init(getOptions(lng,["generic", "errors","dashboard", "organisation"] ))
    const error_strings= await import(`./locales/${lng}/errors.json`)
    const dashboard_strings = await import(`./locales/${lng}/dashboard.json`)
    await i18nInstance.addResourceBundle(lng, "generic", error_strings, true, true)
    await i18nInstance.addResourceBundle(lng, "dashboard", dashboard_strings, true, true)
    await i18nInstance.addResourceBundle(lng, "organisation", dashboard_strings, true, true)

    // await i18nInstance.addResourceBundle(lng, "generic", error_hi, true, true)

    if(additionalResources && Array.isArray(additionalResources)){
      for(const i in additionalResources){
        
        await i18nInstance.addResourceBundle(lng, additionalResources[i].ns, additionalResources[i].data, true, true)

      }
    }
    
  return i18nInstance
}

export async function serverTranslation(lng:string, ns ="generic", additionalResources?: additionalResources[], options?: any) {
  const i18nextInstance = await initI18next(lng, ns, additionalResources)
  return {
    t: i18nextInstance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns, undefined  ),
    i18n: i18nextInstance
  }
}

function getOptions (lng = fallbackLng, ns = [defaultNS], suppLanguages?: string[]) {


  return {
    // debug: true,
    supportedLngs: suppLanguages?? SUPPORTED_LANGUAGES,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns
  }
}