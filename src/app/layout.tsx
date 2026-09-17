import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ProgressBar from "@/components/general/ProgressBar";
import ThemeRegistry from "@/lib/helpers/theme/ThemeRegistery";
import { DEFAULT_METADATA, SUPPORTED_LANGUAGES } from "#/defines/constants";
import { Suspense } from "react";
import { theme } from '#/defines/theme';
import { Toastify } from "@/components/general/Toastify";
import Header from "@/components/common/HeaderClient";
import { Provider } from "jotai";
import { EnvProvider } from "@/lib/helpers/frontend/EnvProvider";
import { getAPIURL, getBaseURL, getEnabledLoginProvidersServerSide, getLogLevel, getMinimumPasswordLengthServerSide, getOTPLength } from "@/lib/helpers/env";

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lng) => ({ lng }))
}


export const metadata: Metadata = DEFAULT_METADATA

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode,
  params: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const env = {
    API_URL: getAPIURL() ?? "/api/",
    AUTH_ENABLED_PROVIDERS: getEnabledLoginProvidersServerSide() ?? [],
    BASE_URL: getBaseURL() ?? "",
    LOG_LEVEL: getLogLevel() ?? "debug",
    MIN_PASSWORD_LENGTH: getMinimumPasswordLengthServerSide(),
    OTP_LENGTH: getOTPLength() ?? 6
  }
  return (
    <html lang="en">
      <head>
          <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
      <ProgressBar />
      <ThemeRegistry  theme={theme}>
        <Provider>
          <EnvProvider env={env}>
            {children}
          </EnvProvider>
          <Toastify />
        </Provider>
      </ThemeRegistry>
      </body>
    </html>
  )
}

