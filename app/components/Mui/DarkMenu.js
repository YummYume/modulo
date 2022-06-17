import React from "react";
import Menu, { menuClasses } from "@mui/material/Menu";
import { styled } from "@mui/material/styles";

const DarkMenu = styled(Menu)(({ theme }) => ({
    [`& .${menuClasses.paper}`]: {
        color: theme.palette.box.mainBox.color,
        backgroundColor: theme.palette.box.mainBox.background
    },
    [`& .${menuClasses.list} > .MuiMenuItem-root > .MuiListItemIcon-root`]: {
        color: theme.palette.box.mainBox.color
    }
}));

export default function StyledComponent(props) {
    return <DarkMenu {...props} />;
}
