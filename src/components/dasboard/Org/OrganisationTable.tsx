"use client"
import { Box, Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import useSWRInfinite from "swr/infinite";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { genericFetcher } from "@/lib/helpers/general";
import { TFunction } from "i18next";
import { useTranslationClient } from "@/i18n/client";
import { Organisation } from "#/generated/prisma/client";
import React from "react";

export const OrganisationTable = ({lng, canAddOrgs, data}:{lng:string, data: Organisation[] | void, canAddOrgs: boolean}) =>{
  const router = useRouter()
  // const { data, error, isLoading } = useSWR<Quiz[] | null, Error>([`/api/quiz/get?skip=${skip}`, skip], fetcher) 
  const {t} = useTranslationClient(lng)
  
  const onClickEdit = (id:string)=>{
    router.push(`/dashboard/org/${id}/details`)
  }
  const onClickView = (id:string)=>{
    router.push(`/dashboard/org/${id}`)
  }

  const addButtonClicked = () =>{
    router.push('/dashboard/org/add')
  }
  let finalOutput: React.JSX.Element[] = []
  if(data){
    
      for (const organisation of data){
        if(!organisation) continue
          if(organisation.name){
                finalOutput.push(
                  <TableRow key={organisation.id}>
                    <TableCell onClick={()=>onClickEdit(organisation.id)}>{organisation.name ? t(organisation.name.toUpperCase()): organisation.name}</TableCell>
                    <TableCell>
                      <Box  sx={{
                      display: {
                        xs: 'none', // Hide on screens extra-small (mobile) and up to sm
                        sm: 'block', // Show on screens small and up
                        },
                        }}>
    
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box  sx={{
                      display: {
                        xs: 'none', // Hide on screens extra-small (mobile) and up to sm
                        sm: 'block', // Show on screens small and up
                      },
                    }}>
                    </Box>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={2} direction="row">
                        <Box onClick={()=>onClickEdit(organisation.id)}>
                          <EditIcon color="secondary" />
                        </Box>
                        <div onClick={()=>onClickView(organisation.id)}>
                          <VisibilityIcon   color="secondary" />
                        </div>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )
              }
       
      }
  }
const addButton =  canAddOrgs ? (
        <Box sx={{textAlign:"end", marginBottom:3 }}>
            <Button onClick={addButtonClicked} variant="contained">{t("ADD_ORGANISATION", {ns: "organisation"})}</Button>
        </Box> 
    ): <></>

  const finalTable =  (
  <>
     <TableContainer  >

        { finalOutput.length>0 ? (
            <Table sx={{ }}>
            <TableHead>
                <TableRow>
                    <TableCell sx={{width:"70%"}}>{t("NAME", {ns: "generic"})}</TableCell>
                <TableCell >{t("OPTIONS")}</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {finalOutput}
            </TableBody>
            </Table>):
                <Typography variant="body1">{t("NOTHING_TO_SHOW")}</Typography>
        }
 
     </TableContainer>
     
  </>

  )
  return ( <>
  <Typography variant="h2" gutterBottom>{t("YOUR_ORGANISATIONS", {ns: "organisation"})}</Typography>
  {addButton}
  <Paper elevation={2} sx={{width:"100%", padding:2}}>
    {finalTable}
    </Paper>
  </>

  )
}