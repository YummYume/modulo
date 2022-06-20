import React from "react";
import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
import { checkboxClasses } from "@mui/material/Checkbox";
import Popper from "@mui/material/Popper";
import { styled } from "@mui/material/styles";

const DarkAutocomplete = styled(Autocomplete)(({ theme }) => ({
    [`.${autocompleteClasses.inputRoot}:not(.Mui-disabled)`]: {
        [`.${autocompleteClasses.endAdornment}`]: {
            button: {
                color: theme.palette.box.mainBox.color
            }
        },
        [`.${autocompleteClasses.tag}`]: {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.box.mainBox.color
        }
    }
}));

const DarkPopper = styled(Popper)(({ theme }) => ({
    [`& .${autocompleteClasses.paper}`]: {
        color: theme.palette.box.mainBox.color,
        backgroundColor: theme.palette.box.mainBox.background,
        [`& .${autocompleteClasses.listbox}`]: {
            [`& .${checkboxClasses.root}`]: {
                color: theme.palette.box.mainBox.color
            }
        }
    }
}));

function DarkPopperComponent(props) {
    return <DarkPopper {...props} />;
}

export default function StyledComponent(props) {
    return <DarkAutocomplete {...props} PopperComponent={DarkPopperComponent} />;
}
