'use client'

import { createContext, useContext, ReactNode } from 'react'

type EnvVars = {
    API_URL: string,
    AUTH_ENABLED_PROVIDERS: string[],
    BASE_URL: string,
    LOG_LEVEL: string,
    MIN_PASSWORD_LENGTH: number,
    OTP_LENGTH: number
}

const EnvContext = createContext<EnvVars | null>(null)

export function EnvProvider({
  env,
  children,
}: {
  env: EnvVars
  children: ReactNode
}) {
  return <EnvContext.Provider value={env}>{children}</EnvContext.Provider>
}

export function useEnv() {
  const ctx = useContext(EnvContext)
  if (!ctx) {
    throw new Error('useEnv must be used within an EnvProvider')
  }
  return ctx
}