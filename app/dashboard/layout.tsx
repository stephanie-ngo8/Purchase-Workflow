"use client";
import {useEffect, useState} from "react";
import {styled, useTheme, Theme, CSSObject} from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import StoreIcon from '@mui/icons-material/Store';
import axios from "axios";
import {Avatar, Container, ListItemAvatar} from "@mui/material";
import React from "react";
import {People} from "@mui/icons-material";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({theme, open}) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(
    ({theme, open}) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

export default function DashboardLayout({
                                            children,
                                        }: Readonly<{
    children: React.ReactNode;
}>) {
    const [token, setToken] = useState<string | null>(null);
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState<any | null>(null);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        const localToken = localStorage.getItem('token');
        console.log(localToken);
        if (!localToken)
            window.location.href = '/login';
        if (localToken)
            setToken(localToken);

        (async () => {
            try {
                const response = await axios.get('/api/users/me', {
                    headers: {
                        Authorization: `Bearer ${localToken}`
                    }
                });

                setUser(response.data);
            } catch (err: any) {
                console.error(err);
                // window.location.href = '/login';
            }
        })();
    }, []);

    if (!token || !user)
        return <></>;

    return <Box sx={{display: 'flex'}}>
        <CssBaseline/>
        <AppBar position="fixed" open={open} elevation={0}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    sx={{
                        marginRight: 5,
                        ...(open && {display: 'none'}),
                    }}
                >
                    <MenuIcon/>
                </IconButton>
                <Typography variant="h6" noWrap component="div">
                    Purchases
                </Typography>

                <ListItem>
                    <ListItemAvatar>
                        <Avatar alt={`${user.lastName.toUpperCase()} ${user.firstName}`}
                                src="/static/images/avatar/1.jpg"/>
                    </ListItemAvatar>
                    <ListItemText
                        primary={`${user.lastName.toUpperCase()} ${user.firstName}`}
                        secondary={
                            <React.Fragment>
                                <Typography
                                    sx={{display: 'inline'}}
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                >
                                    Your role
                                </Typography>
                                {` — ${user.email}`}
                            </React.Fragment>
                        }
                    />
                </ListItem>
            </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
            <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                </IconButton>
            </DrawerHeader>
            <Divider/>
            <List>
                <ListItem disablePadding sx={{display: 'block'}}>
                    <ListItemButton
                        href={'/dashboard/purchases'}
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >
                            <StoreIcon/>
                        </ListItemIcon>
                        <ListItemText primary={'Purchases'} sx={{opacity: open ? 1 : 0}}/>
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider/>
            <List>
                <ListItem disablePadding sx={{display: 'block'}}>
                    <ListItemButton
                        href={'/dashboard/users'}
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >
                            <People/>
                        </ListItemIcon>
                        <ListItemText primary={'Users'} sx={{opacity: open ? 1 : 0}}/>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding sx={{display: 'block'}}>
                    <ListItemButton
                        href={'/dashboard/codeGL'}
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >
                            <InboxIcon/>
                        </ListItemIcon>
                        <ListItemText primary={'G/L Code'} sx={{opacity: open ? 1 : 0}}/>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding sx={{display: 'block'}}>
                    <ListItemButton
                        href={'/dashboard/department'}
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >
                            <InboxIcon/>
                        </ListItemIcon>
                        <ListItemText primary={'Department'} sx={{opacity: open ? 1 : 0}}/>
                    </ListItemButton>
                </ListItem>
            </List>
        </Drawer>
        <Box component="main" sx={{flexGrow: 1, p: 3}}>
            <DrawerHeader/>
            {children}
        </Box>
    </Box>
}