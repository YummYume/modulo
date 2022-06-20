import React from "react";
import Menu, { menuClasses } from "@mui/material/Menu";
import { styled } from "@mui/material/styles";

const DarkMenu = styled(Menu)(({ theme }) => ({
    [`& .${menuClasses.paper}`]: {
        color: theme.palette.menu.color,
        backgroundColor: theme.palette.menu.background
    },
    [`& .${menuClasses.list} > .MuiMenuItem-root > .MuiListItemIcon-root`]: {
        color: theme.palette.menu.color
    }
}));

export default function StyledComponent(props) {
    return <DarkMenu disableScrollLock={true} {...props} />;
}
