import React from "react";
import AvatarIcon from "@mui/icons-material/AccountCircle";
import Avatar from "@mui/material/Avatar";
import Image from "next/image";
import { useTheme } from "@mui/material/styles";

export default function UserAvatar({ avatarProps, user }) {
    const theme = useTheme();
    const firstNameLetter = user?.firstName ? user.firstName.charAt(0) : "";
    const lastNameLetter = user?.lastName ? user.lastName.charAt(0) : "";
    const initials = firstNameLetter.toUpperCase() + lastNameLetter.toUpperCase();

    const fullNameToColor = (fullName) => {
        if (!fullName) {
            return theme.palette.primary.main;
        }

        const string = fullName ? fullName.toLowerCase().replace(" ", "") : "";
        let hash = 0;

        for (let i = 0; i < string.length; i++) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        const color = hash.toString(16).replace("-", "");

        return "#" + ("000000" + color).slice(-6);
    };

    return (
        <Avatar {...avatarProps} sx={{ ...avatarProps.sx, backgroundColor: fullNameToColor(user?.fullName) }}>
            {Boolean(user) ? (
                Boolean(user.avatar) ? (
                    <Image src={user.avatar.contentUrl} alt={initials} layout="fill" />
                ) : (
                    <span>{initials}</span>
                )
            ) : (
                <AvatarIcon />
            )}
        </Avatar>
    );
}
