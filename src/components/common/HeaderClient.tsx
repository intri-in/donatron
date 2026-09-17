"use client"
import {useEffect, useState} from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useAtomValue } from 'jotai';
import { atomPageTitle } from '@/store/jotai/common';
import { useTranslationClient } from '@/i18n/client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, URL_ADMIN_DASHBOARD, URL_DASHBOARD } from '#/defines/constants';
import { authClient } from '@/lib/auth-client';
import { Chip } from '@mui/material';
import Link from 'next/link';

export default function Header({lng, title="DASHBOARD", path}:{lng:string, title: string, path:string}) {
    const searchParams = useSearchParams()
    const {t} = useTranslationClient(lng)
    const [auth, setAuth] = useState(true);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const router = useRouter()
    const { 
        data: session, 
        isPending, //loading state
        error, //error object
        refetch //refetch the session
    } = authClient.useSession() 
    /**
     * Jotai
     * 
     * */
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAuth(event.target.checked);
    };
    console.log(title)
    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const logOut = async () =>{
        await authClient.signOut({
        fetchOptions: {
            onSuccess: () => {
            router.push("/login"); // redirect to login page
            },
        },
    });
    }
    let dashboardSwitchButton = <></> 
    if(path.startsWith(URL_ADMIN_DASHBOARD)){
        dashboardSwitchButton = <Link href={"/dashboard/"}><Chip label={t("DASHBOARD")} color="secondary" /></Link>
    }else if(path.startsWith(URL_DASHBOARD)){
        dashboardSwitchButton = <Link href={"/dashboard/admin"}><Chip label={t("ADMIN_DASHBOARD")} color="secondary" /></Link>

    }
            
    return (
        <Box sx={{ flexGrow: 1, marginBottom: 4 }}>
        <AppBar position="static">
            <Toolbar>

            <Typography component="div" sx={{ flexGrow: 1 }}>
                {`${t("DONATRON")} | ${t(title)}`}
            </Typography>
            {dashboardSwitchButton}
                <div>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={logOut}>{t('LOGOUT', {ns:"generic"})}</MenuItem>
                </Menu>
                </div>
            </Toolbar>
        </AppBar>
        </Box>
    );
}
