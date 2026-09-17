'use client';
import * as React from 'react';
import { Theme, ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ReactElement } from 'react';
import { JSXElementConstructor } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';

export default function ThemeRegistry({ children, theme }: { children: any | ReactElement<any, string | JSXElementConstructor<any>>, theme:Theme | any}) {

  return(
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  )
  // return (
  //   <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
  //     <ThemeProvider theme={theme}>
  //       {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
  //       {
  //         children
  //       }
  //     </ThemeProvider>
  //   </NextAppDirEmotionCacheProvider>
  // );
}