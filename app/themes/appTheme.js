import { createTheme } from "@mui/material/styles";

import palette from "../styles/Palette.module.scss";

export default createTheme({
    palette: {
        primary: {
            main: palette.primaryBlueMain,
            light: palette.primaryBlueLight,
            text: {
                main: "#fff",
                light: "#000"
            }
        },
        secondary: {
            main: palette.secondaryGreenMain,
            light: palette.secondaryGreenLight,
            text: {
                main: "#fff",
                light: "#000"
            }
        },
        box: {
            index: {
                backgroundLogin: "gba(255, 255, 255, 0.9)"
            }
        }
    }
});
