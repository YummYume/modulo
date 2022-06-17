import React from "react";
import Switch, { switchClasses } from "@mui/material/Switch";
import { styled } from "@mui/material/styles";

const DarkSwitch = styled(Switch)(({ theme }) => ({
    [`& .${switchClasses.track}`]: {
        backgroundColor: theme.palette.box.secondaryBox.color + " !important"
    }
}));

export default function StyledComponent(props) {
    return <DarkSwitch {...props} />;
}
