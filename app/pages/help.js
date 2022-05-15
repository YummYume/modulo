import React from "react";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import Head from "next/head";

export default function Help() {
    return (
        <React.Fragment>
            <Head>
                <title>Modulo | Aide</title>
                <meta name="description" content="Aide pour l'application Modulo." />
            </Head>
            <div className="container-fluid w-100 my-3">
                <Typography variant="h1" className="text-center mb-5">
                    Aide
                </Typography>
                <Slide direction="up" in={true} timeout={{ enter: 1000 }} mountOnEnter unmountOnExit>
                    <div>
                        <Typography variant="body1" className="mb-5">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin aliquet, elit nec suscipit pharetra, tortor
                            sapien placerat mi, sed sagittis dui urna non nulla. Cras aliquam, nisi et bibendum semper, odio magna
                            ullamcorper orci, venenatis facilisis magna turpis at justo. Cras vitae diam sit amet nulla iaculis fermentum.
                            Vivamus vel semper augue. Donec porttitor est lorem, eu faucibus quam lacinia et. Mauris felis quam, hendrerit
                            non lobortis id, venenatis sed ex. Nulla lacus dolor, faucibus nec odio ac, ultricies rhoncus leo. Nullam
                            cursus, neque non porttitor blandit, quam justo viverra eros, et euismod quam augue et diam. Integer laoreet
                            pellentesque risus id sollicitudin. Duis ultrices nisl eu massa finibus elementum. Praesent facilisis orci ac
                            dolor tincidunt feugiat. Maecenas semper urna vel nisi tincidunt tristique. Praesent ligula lectus, cursus et
                            pulvinar eu, hendrerit et dolor. Aenean nibh nisi, vulputate a libero non, rhoncus dapibus ipsum. Vestibulum sit
                            amet ex ac dui dignissim gravida in vitae felis. Nulla in facilisis est, posuere placerat eros. Integer
                            elementum pharetra nulla vestibulum semper. Donec nec justo gravida, commodo augue in, hendrerit leo. Quisque ut
                            neque vitae lacus pulvinar suscipit. Nullam ut ante efficitur, blandit sem et, malesuada ante. Duis sapien ante,
                            sodales a nulla non, tincidunt egestas ligula. Proin dictum fermentum neque id fermentum. Praesent eget laoreet
                            tortor. Vivamus lacus tortor, posuere quis ipsum pretium, efficitur pulvinar lacus. Quisque laoreet, libero non
                            vestibulum suscipit, lectus nisl pellentesque erat, id dignissim ligula felis sed lorem. Donec consectetur sem
                            quis arcu vulputate, porttitor tincidunt elit molestie. Sed pellentesque condimentum velit id congue. Nunc
                            aliquam, leo non pulvinar lobortis, magna nisi tincidunt est, id gravida ipsum est et lacus. Mauris dapibus dui
                            vitae auctor fringilla. Nam vel ante sagittis, lacinia urna vel, feugiat mi. In vel libero sem. Quisque a
                            egestas nisl, non commodo ante. Cras vestibulum massa sed sodales faucibus. Mauris sagittis mi ut felis
                            malesuada elementum. Aenean in justo at lorem lacinia pretium eu id purus. Pellentesque laoreet varius
                            condimentum. Nam convallis nunc et facilisis faucibus. Aliquam tristique a mauris ac aliquet. Maecenas
                            elementum, ligula nec sagittis finibus, libero felis porta lorem, quis blandit risus tortor sit amet dui. Etiam
                            vitae tincidunt quam. Maecenas bibendum lacus tincidunt sapien tincidunt, at elementum mauris dapibus. Integer
                            nec aliquam tortor, egestas vulputate mi. Donec porta lorem quam, a malesuada orci consequat eu. Phasellus
                            bibendum nec arcu at efficitur. Praesent ultricies lacus a mollis posuere. Praesent interdum iaculis ligula eu
                            viverra. Aliquam at nulla eleifend, gravida neque eu, blandit leo. Sed ut auctor mauris. Sed quis neque est.
                            Suspendisse viverra euismod porta. Donec tellus nisi, ullamcorper sit amet ligula commodo, fringilla fringilla
                            lacus. Aenean congue arcu odio, sed vestibulum massa accumsan vel. In volutpat velit maximus purus consectetur
                            tincidunt. Mauris lorem ligula, bibendum suscipit feugiat at, ornare in augue. Aliquam erat volutpat. Duis at
                            semper purus. Mauris eu imperdiet nulla. Phasellus pharetra sed odio in tempor. Integer sagittis augue vitae
                            elit euismod, vitae hendrerit massa eleifend. Etiam ornare eget libero eu sollicitudin. Vivamus fermentum elit
                            id ullamcorper dignissim. Proin pellentesque turpis et commodo sollicitudin. Donec eleifend augue vitae nibh
                            viverra faucibus. Fusce pharetra lacus nunc, nec pulvinar tellus facilisis quis. Proin gravida vitae ante non
                            fermentum. Suspendisse non felis semper, cursus tellus eget, fringilla sem. Cras viverra libero eu urna auctor,
                            a dapibus lorem tristique. Nulla commodo ex sagittis metus pellentesque varius.
                        </Typography>
                    </div>
                </Slide>
            </div>
        </React.Fragment>
    );
}
