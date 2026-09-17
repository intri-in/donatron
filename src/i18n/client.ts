'use client'
import { i18n } from 'i18next'
import { useState } from 'react';
import { useEffect } from 'react';
import fauxI8n from './components/FauxI18n';
import { additionalResources, initI18next } from '.';

export function useTranslationClient(lng: string = "en", ns: string = "translations", additionalResources?: additionalResources[], options?: {}){


  const [i18Obj, setI18] = useState<i18n |  {
    t: (variable: any) => React.ReactElement;
} >(fauxI8n)
  
  useEffect(()=>{
    let isMounted = true
    
    async function initI18nObj(){
      // console.log('here')
      initI18next(lng, ns,additionalResources, options).then((i18New: i18n) =>{
        setI18(i18New)
      })
  
    }
    if(isMounted){

      initI18nObj()
    }
    return ()=>{
      isMounted= false
    }
  }, [lng, ns, additionalResources, options])


  return i18Obj
}
