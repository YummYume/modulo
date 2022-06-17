import React from "react";
import Typography from "@mui/material/Typography";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";

import SecondaryModal from "./SecondaryModal";
import DarkSwitch from "./Mui/DarkSwitch";

export default function UserPreferencesModal({ open, handleClose, colorMode }) {
    const handleModeChange = () => {
        colorMode.toggleColorMode();
    };

    const handleOnClose = () => {
        handleClose();
    };

    return (
        <SecondaryModal open={open} handleClose={handleOnClose} title="Mes préférences" labelId="user-preferences-title">
            <FormGroup className="my-2">
                <FormLabel component="legend" className="m-0">
                    <Typography sx={{ color: "box.secondaryBox.color" }} variant="h6">
                        Mode de couleur
                    </Typography>
                </FormLabel>
                <FormControlLabel
                    control={
                        <DarkSwitch
                            defaultChecked={"dark" === colorMode.mode}
                            checked={"dark" === colorMode.mode}
                            icon={<LightModeIcon sx={{ color: "#f9d71c" }} />}
                            checkedIcon={<DarkModeIcon sx={{ color: "box.secondaryBox.color" }} />}
                            onChange={handleModeChange}
                        />
                    }
                    label={"light" === colorMode.mode ? "Clair" : "Sombre"}
                />
            </FormGroup>
        </SecondaryModal>
    );
}
