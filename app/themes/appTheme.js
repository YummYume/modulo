import { createTheme } from "@mui/material/styles";

import paletteTheme from "../styles/Palette.module.scss";
console.log(paletteTheme);

export const lightTheme = createTheme({
    palette: {
        primary: {
            main: paletteTheme.lightprimarymain,
            light: paletteTheme.lightprimary,
            text: {
                main: "#fff",
                light: "#000"
            }
        },
        secondary: {
            main: paletteTheme.lightsecondarymain,
            light: paletteTheme.lightsecondary,
            text: {
                main: "#fff",
                light: "#000"
            }
        },
        box: {
            index: {
                backgroundLogin: "rgba(255, 255, 255, 0.9)"
            },
            image: {
                filter: "rgba(4, 38, 62, 0.25)"
            }
        }
    }
});

export const darkTheme = createTheme({
    palette: {
        primary: {
            main: paletteTheme.darkprimarymain,
            light: paletteTheme.darkprimary,
            text: {
                main: "#000",
                light: "#fff"
            }
        },
        secondary: {
            main: paletteTheme.darksecondarymain,
            light: paletteTheme.darksecondary,
            text: {
                main: "#000",
                light: "#fff"
            }
        },
        box: {
            index: {
                backgroundLogin: "rgba(255, 255, 255, 0.9)"
            },
            image: {
                filter: "rgba(4, 38, 62, 0.25)"
            }
        }
    }
});
