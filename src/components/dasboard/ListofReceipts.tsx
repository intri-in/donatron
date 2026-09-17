"use client"
import { useTranslationClient } from "@/i18n/client";
import { authClient } from "@/lib/auth-client";
import { BetterAuthSessionObject } from "@/types/BetterAuth";
import { Box, Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, useTheme } from "@mui/material";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense, useState } from "react";
import  { Fetcher } from 'swr'
import useSWRInfinite from 'swr/infinite'
import FullPageLoadingPlaceholder from "../general/FullPageLoadingPlaceholder";
import { toast } from "react-toastify";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useRouter } from "next/navigation";
import { Receipt } from "#/generated/prisma/client";
import { getAllUserReceipts } from "@/lib/helpers/frontend/dashboard/receipts";
const PAGE_SIZE = 3
const fetcher: Fetcher<Receipt[] | null, string> = (url) =>  getAllUserReceipts(url)

const getKey = (page: number, previousPageData: any) => {
  if (previousPageData && !previousPageData.length) return null // reached the end
  return `/quiz/list?skip=${page*3}`
}

export const UserReceipts = ({lng, session}:{lng: string, session:BetterAuthSessionObject | null} ) =>{
  const router = useRouter()
  if(!session) return
  const canCreateReceipts = authClient.admin.checkRolePermission({
    permissions: {
      receipt: ["create"],
    },
    role: session?.user.role  
  })
  const i18n = useTranslationClient(lng)
  const theme = useTheme()

  const onAddButtonClicked = () =>{
    router.push("/dashboard/quiz/create")
  }
  if(canCreateReceipts)
      return(
            <Suspense fallback={<FullPageLoadingPlaceholder />}>
                    <Paper sx={{padding: theme.spacing(2), mb: theme.spacing(2)}} elevation={3}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h1" >{i18n.t("MY_RECEIPTS", {ns:"dashboard"})}</Typography>
                      <Button onClick={onAddButtonClicked}variant="contained">{i18n.t("ADD")}</Button>
                  </Box>
                    <QuizTable lng={lng} />
                </Paper>
            </Suspense>
      )
}
const QuizTable = ({lng}:{lng:string}) =>{
  const i18n = useTranslationClient(lng)
  const router = useRouter()
  // const { data, error, isLoading } = useSWR<Quiz[] | null, Error>([`/api/quiz/get?skip=${skip}`, skip], fetcher) 
  const { data, error, size, setSize } = useSWRInfinite<Receipt[] | null, Error >(getKey, fetcher)
 
  if(!data) return(<></>)
  if(error) return(<></>)
  
  const onClickEdit = (id:string)=>{
    router.push(`/dashboard/receipt/${id}`)
  }
  const onClickView = (id:string)=>{
    router.push(`/dashboard/receipt/preview/${id}`)
  }

  let finalOutput = []
  const isReachingEnd = (() => {
    if (!data || data.length === 0) return false;

    const lastPage = data[data.length - 1];
    return lastPage ? lastPage.length < PAGE_SIZE : false;
  })();
  for (const page of data){

    if(!page) continue
    for (const receipt of page){
      if(receipt.name){
            finalOutput.push(
              <TableRow key={receipt.id}>
                <TableCell onClick={()=>onClickEdit(receipt.id)}>{receipt.name ? i18n.t(receipt.name.toUpperCase()): receipt.name}</TableCell>
                <TableCell>
                  <Box  sx={{
                  display: {
                    xs: 'none', // Hide on screens extra-small (mobile) and up to sm
                    sm: 'block', // Show on screens small and up
                  },
                }}>

                  {receipt.status ? i18n.t(receipt.status.toUpperCase()): receipt.status}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box  sx={{
                  display: {
                    xs: 'none', // Hide on screens extra-small (mobile) and up to sm
                    sm: 'block', // Show on screens small and up
                  },
                }}>
                  {receipt.status ? i18n.t(receipt.status?.toUpperCase()) : receipt.status}
                </Box>
                </TableCell>
                <TableCell>
                  <Stack spacing={2} direction="row">
                    <Box onClick={()=>onClickEdit(receipt.id)}>
                      <EditIcon color="secondary" />
                    </Box>
                    <div onClick={()=>onClickView(receipt.id)}>
                      <VisibilityIcon   color="secondary" />
                    </div>
                  </Stack>
                </TableCell>
              </TableRow>
            )
          }
    }
   
  }
  return (
  <>
     <TableContainer component={Paper}>
      <Table sx={{width: "100%"}}>
      <TableHead>
        <TableRow>
            <TableCell sx={{width:"70%"}}>{i18n.t("NAME", {ns: "generic"})}</TableCell>
            <TableCell>
              <Box  sx={{
            display: {
              xs: 'none', // Hide on screens extra-small (mobile) and up to sm
              sm: 'block', // Show on screens small and up
            },
          }}>
                {i18n.t("STATUS", {ns: "generic"})}
              </Box>
              </TableCell>
            <TableCell>
              <Box  sx={{
            display: {
              xs: 'none', // Hide on screens extra-small (mobile) and up to sm
              sm: 'block', // Show on screens small and up
            }}}>
              {i18n.t("ACCESS", {ns: "generic"})}
            </Box>
          
            </TableCell>
          <TableCell >{i18n.t("OPTIONS", {ns: "generic"})}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>

      {finalOutput}
      </TableBody>
      </Table>
        <Box sx={{marginTop:3, textAlign:"right"}}>
          {(!isReachingEnd) ? <Button onClick={()=>setSize(size+1)}>{i18n.t("SHOW_MORE", {ns: "generic"})}</Button>:<></>}
        </Box>

     </TableContainer>
     
  </>

  )

}