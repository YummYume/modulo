import React from "react";
import { useSpring, animated } from "react-spring";
import { QueryClient, dehydrate } from "react-query";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { useUser } from "../hooks/useUser";
import { getCurrentUserFromServer } from "../api/user";

export default function ScopeChoice() {
    const { data: user } = useUser();
    const titleProps = useSpring({ to: { opacity: 1 }, from: { opacity: 0 }, config: { duration: 5000 } });
    const scopeProps = useSpring({ to: { opacity: 1 }, from: { opacity: 0 } });

    return (
        <Box
            className="d-flex flex-column w-100"
            sx={{
                padding: "100px 80px 60px"
            }}
        >
            <animated.h1 style={titleProps}>Je choisis ma fonction</animated.h1>
            <Box>
                {user.scopes.map((scope) => (
                    <animated.div key={scope.id} style={scopeProps}>
                        <Box>
                            <Typography variant="h1">{scope.name}</Typography>
                        </Box>
                    </animated.div>
                ))}
            </Box>
        </Box>
    );
}

export async function getServerSideProps({ req }) {
    const queryClient = new QueryClient();

    try {
        await queryClient.fetchQuery("user", () => getCurrentUserFromServer(req.headers.cookie));
    } catch (error) {
        return {
            redirect: {
                permanent: false,
                destination: "/"
            },
            props: {}
        };
    }
    return {
        props: {
            dehydratedState: dehydrate(queryClient)
        }
    };
}
