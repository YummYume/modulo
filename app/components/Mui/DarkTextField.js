import React from "react";
import TextField, { textFieldClasses } from "@mui/material/TextField";
import { styled } from "@mui/material/styles";

const DarkTextField = styled(TextField)(({ theme }) => ({
    [`.${textFieldClasses.root}`]: {
        color: theme.palette.box.mainBox.color,
        borderColor: theme.palette.box.mainBox.color
    },
    "& .MuiOutlinedInput-root:not(.Mui-error)": {
        "&:hover": {
            "& .MuiOutlinedInput-notchedOutline": {
                color: theme.palette.box.mainBox.color,
                borderColor: theme.palette.box.mainBox.color
            }
        },
        "& .MuiOutlinedInput-notchedOutline": {
            color: theme.palette.box.mainBox.color,
            borderColor: theme.palette.box.mainBox.color
        }
    },
    "& .MuiOutlinedInput-input": {
        color: theme.palette.box.mainBox.color
    },
    "& .MuiInputLabel-root:not(.Mui-error)": {
        color: theme.palette.box.mainBox.color
    }
}));

export default function StyledComponent(props) {
    return <DarkTextField {...props} />;
}
