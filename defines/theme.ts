'use client'
import { ThemeProvider, createTheme } from "@mui/material/styles";
const baseTheme = createTheme();
export const theme = createTheme({
  typography: {
        body1: {
          fontSize: '12pt',
          '@media (min-width:600px)': {
            fontSize: '16pt',
          },
          [baseTheme.breakpoints.up('md')]: {
            fontSize: '16pt',
          },

        },
        subtitle1: {
          fontSize: '26pt',
          '@media (min-width:600px)': {
            fontSize: '26pt',
          },
          [baseTheme.breakpoints.up('md')]: {
            fontSize: '26pt',
          },
        },
        h1: {
          fontSize: '24pt',
          fontWeight:"bold",
          '@media (min-width:600px)': {
            fontSize: '24pt',
          },
          [baseTheme.breakpoints.up('md')]: {
            fontSize: '24pt',
          },
        },
        h2: {
          fontSize: '20pt',
          fontWeight:"bold",
          '@media (min-width:600px)': {
            fontSize: '20pt',
          },
          [baseTheme.breakpoints.up('md')]: {
            fontSize: '20pt',
          },
        },
        h3: {
          fontSize: '18pt',
          fontWeight:"bold",
          '@media (min-width:600px)': {
            fontSize: '18pt',
          },
          [baseTheme.breakpoints.up('md')]: {
            fontSize: '18pt',
          },
        },
        h4: {
          fontSize: '17pt',
          '@media (min-width:600px)': {
            fontSize: '17pt',
          },
          [baseTheme.breakpoints.up('md')]: {
            fontSize: '17pt',
          },
        },
        h5: {
                   fontSize: '17pt',
          '@media (min-width:600px)': {
            fontSize: '17pt',
          },
          [baseTheme.breakpoints.up('md')]: {
            fontSize: '17pt',
          },
        },
        h6: {
                   fontSize: '16pt',
          '@media (min-width:600px)': {
            fontSize: '16pt',
          },
          [baseTheme.breakpoints.up('md')]: {
            fontSize: '16pt',
          },
        }

        
  },  
  palette: {
    primary: {
      main: "#23055C",
      light:"#35088c"
      
    },
    secondary:{
        main:"#3e5c05",
        light:"#5f8c08"
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained:{
          background: '#23055C',

        }
      },
    },
  }

});