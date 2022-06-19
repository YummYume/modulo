import React from "react";
import Select, { selectClasses } from "@mui/material/Select";
import { styled } from "@mui/material/styles";

const DarkSelect = styled(Select)(({ theme }) => ({
    [`& .${selectClasses.select}`]: {
        color: theme.palette.menu.color
    },
    [`& .${selectClasses.iconOutlined}`]: {
        color: theme.palette.menu.color
    },
    "& .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.menu.color + " !important"
    }
}));

const menuProps = {
    "& .MuiPaper-root": {
        color: "menu.color",
        backgroundColor: "menu.background"
    },
    "& .MuiMenuItem-root": {
        "& :hover": {
            backgroundColor: "primary.main"
        }
    }
};

export default function StyledComponent(props) {
    return (
        <DarkSelect
            {...props}
            MenuProps={{
                sx: menuProps
            }}
        />
    );
}
