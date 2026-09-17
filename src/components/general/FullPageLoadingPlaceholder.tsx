import { Stack, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { JSXElementConstructor, ReactElement } from "react";

export default function FullPageLoadingPlaceholder({message}:{message?: string | ReactElement<unknown, string | JSXElementConstructor<any>>}) {
    // return(
    //     <div style={{display:"flex", justifyContent:"center", alignItems:"center", height:"100vh"}} >
    //         <div className="spinner" />
    //     </div>
    // )

    return <div style={{display:"flex", justifyContent:"center", alignItems:"center", height:"100vh"}} >
        <Stack spacing={3}>
            <Typography sx={{textAlign:"center"}}>{message}</Typography>
            <CircularProgress />
        </Stack>
    </div>
}