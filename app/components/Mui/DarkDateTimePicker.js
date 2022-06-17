import React from "react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const popperProps = {
    "& .MuiPaper-root": {
        color: "box.mainBox.color",
        backgroundColor: "box.mainBox.background"
    },
    "& .MuiTypography-root": {
        color: "box.mainBox.color"
    },
    "& .MuiIconButton-root": {
        color: "box.mainBox.color"
    },
    "& .MuiPickersDay-root:not(.MuiPickersDay-today, .Mui-selected)": {
        color: "box.mainBox.color",
        backgroundColor: "primary.light"
    },
    "& .MuiPickersDay-today": {
        color: "box.secondaryBox.color",
        backgroundColor: "primary.main",
        borderColor: "primary.main"
    },
    "& .MuiPickersDay-selected": {
        color: "box.secondaryBox.color",
        backgroundColor: "box.mainBox.background"
    },
    "& .MuiTab-root": {
        color: "box.mainBox.color",
        "+.Mui-selected": {
            color: "box.mainBox.color"
        }
    },
    "& .MuiTabs-indicator": {
        backgroundColor: "box.mainBox.color"
    },
    "& .MuiClockPicker-root": {
        "div > div > div[role='listbox']": {
            "span[role='option']:not(.Mui-selected)": {
                color: "box.mainBox.color"
            }
        }
    }
};

export default function StyledComponent(props) {
    return <DateTimePicker {...props} PopperProps={{ sx: popperProps }} />;
}
