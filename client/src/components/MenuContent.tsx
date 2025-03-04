import * as React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';

const mainListItems = [
    { text: 'Dashboard', icon: <HomeRoundedIcon />, to: '' },
    { text: 'User Management', icon: <PeopleRoundedIcon />, to: 'user-management' },
    { text: 'Asset Management', icon: <PeopleRoundedIcon />, to: 'asset-management' },
    { text: 'Tasks', icon: <AssignmentRoundedIcon />, to: 'settings' },
];

export default function MenuContent() {
    return (
        <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
            <List dense>
                {mainListItems.map((item, index) => (
                    <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            component={NavLink} end
                            to={item.to}
                            sx={(theme) => ({
                                '&.active': {
                                    backgroundColor: theme.palette.action.selected,
                                    fontWeight: 'bold',
                                },
                            })}
                            className={({ isActive }) => (isActive ? 'active' : '')}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
}
