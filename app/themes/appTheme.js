import { createTheme } from "@mui/material/styles";

import paletteTheme from "../styles/Palette.module.scss";

export const lightTheme = createTheme({
    palette: {
        primary: {
            main: paletteTheme.lightprimarymain,
            light: paletteTheme.lightprimary,
            text: {
                main: paletteTheme.white,
                light: paletteTheme.black
            }
        },
        secondary: {
            main: paletteTheme.lightsecondarymain,
            light: paletteTheme.lightsecondary,
            text: {
                main: paletteTheme.white,
                light: paletteTheme.black
            }
        },
        box: {
            mainBox: {
                color: paletteTheme.lightprimarymain,
                background: "rgba(255, 255, 255, 0.90)",
                outline: "rgba(0, 0, 0, 0.23)",
                outliveHover: paletteTheme.lightprimarymain
            },
            secondaryBox: {
                color: paletteTheme.white,
                background: paletteTheme.lightprimarymain
            },
            image: {
                filter: "rgba(4, 38, 62, 0.25)"
            }
        },
        menu: {
            background: paletteTheme.white,
            color: paletteTheme.lightprimarymain
        },
        button: {
            hoverButton: {
                color: paletteTheme.lightprimarymain
            }
        },
        loading: {
            color: paletteTheme.lightprimary
        }
    }
});

export const darkTheme = createTheme({
    palette: {
        primary: {
            main: paletteTheme.darkprimarymain,
            light: paletteTheme.darkprimary,
            text: {
                main: paletteTheme.white,
                light: paletteTheme.white
            }
        },
        secondary: {
            main: paletteTheme.darksecondarymain,
            light: paletteTheme.darksecondary,
            text: {
                main: paletteTheme.white,
                light: paletteTheme.white
            }
        },
        box: {
            mainBox: {
                color: paletteTheme.white,
                background: "rgba(2, 20, 34, 0.95)",
                outline: "rgba(255, 255, 255, 0.1)",
                outliveHover: "rgba(255, 255, 255, 0.6)"
            },
            secondaryBox: {
                color: paletteTheme.white,
                background: paletteTheme.darkprimarymain
            },
            image: {
                filter: "rgba(4, 38, 62, 0.35)"
            }
        },
        menu: {
            background: paletteTheme.darkprimary,
            color: paletteTheme.white
        },
        button: {
            hoverButton: {
                color: paletteTheme.white
            }
        },
        loading: {
            color: paletteTheme.white
        }
    }
});
