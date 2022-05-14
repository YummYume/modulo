import React from "react";
import { motion, useAnimation } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import LoadingButton from "@mui/lab/LoadingButton";

export default function HoverButton({ buttonProps, children }) {
    const theme = useTheme();
    const buttonControls = useAnimation();
    const buttonLineDraw = {
        hidden: {
            pathLength: 0,
            opacity: 1,
            transition: {
                pathLength: { type: "spring", duration: 1, bounce: 0 }
            }
        },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: { type: "spring", duration: 1, bounce: 0 }
            }
        }
    };

    return (
        <LoadingButton
            size="large"
            sx={{
                letterSpacing: "0.5px",
                position: "relative",
                background: "none",
                "&:hover": {
                    background: "none"
                }
            }}
            component={motion.button}
            transition={{ duration: 0.5 }}
            whileHover={{
                scale: 1.2,
                letterSpacing: "2px",
                transition: { duration: 0.5 }
            }}
            onHoverStart={() => buttonControls.start("visible")}
            onHoverEnd={() => buttonControls.start("hidden")}
            {...buttonProps}
        >
            {children}
            <div className="w-100 h-100 position-absolute">
                <motion.svg height="100%" width="100%" viewBox="0 0 500 100" initial="hidden" animate={buttonControls}>
                    <motion.path
                        d="M250 100 H 0 M250 100 H 500"
                        stroke={theme.palette.primary.main}
                        strokeWidth="5"
                        variants={buttonLineDraw}
                    />
                </motion.svg>
            </div>
        </LoadingButton>
    );
}
