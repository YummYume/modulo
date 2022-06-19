import React from "react";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

export default function SecondaryModal({ open, handleClose, disabled, title, labelId, children }) {
    return (
        <Modal
            aria-labelledby={labelId}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 1000
            }}
            disableScrollLock={true}
        >
            <Fade timeout={500} in={open}>
                <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    width="35rem"
                    maxWidth="90%"
                    minHeight="40%"
                    bgcolor="box.secondaryBox.background"
                    color="box.secondaryBox.color"
                    className="p-4 border border-light rounded d-flex flex-column"
                    sx={{ transform: "translate(-50%, -50%)" }}
                >
                    <IconButton
                        className="position-absolute top-0 end-0 m-1"
                        aria-label="close"
                        size="large"
                        onClick={handleClose}
                        disabled={disabled ?? false}
                    >
                        <CloseIcon sx={{ color: "primary.text.main" }} fontSize="inherit" />
                    </IconButton>
                    <Typography id={labelId} variant="h4" component="h2" className="text-center">
                        {title}
                    </Typography>
                    {children}
                </Box>
            </Fade>
        </Modal>
    );
}
