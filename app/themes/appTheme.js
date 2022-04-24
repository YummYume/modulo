import { createTheme } from "@mui/material/styles";

import palette from "../styles/palette.module.scss";

export default createTheme({
    palette: {
        primary: {
            main: palette.primaryBlueMain,
            light: palette.primaryBlueLight,

            text: {
                main: "#fff",
                light: "#000"
            }
        }
    }
});
