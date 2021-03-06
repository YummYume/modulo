import React from "react";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";
import Head from "next/head";

export default function CookiePolicy() {
    return (
        <React.Fragment>
            <Head>
                <title>Gestion des cookies | Modulo</title>
                <meta name="description" content="Qu'est-ce qu'un cookie? Comment les utilisons-nous? Les réponses ici." />
            </Head>
            <div className="container-fluid w-100 my-5 mx-lg-5 mx-md-5 mx-sm-3">
                <Typography variant="h2" component="h1" className="text-center mb-5" fontWeight={400}>
                    Gestion des cookies
                </Typography>
                <Fade in={true} timeout={{ enter: 1000 }}>
                    <div>
                        <Typography variant="h4" component="h2" className="mb-4">
                            À propos des cookies
                        </Typography>
                        <Typography className="mb-5">
                            Nous utilisons différents cookies sur le site pour améliorer l’interactivité du site et nos services.
                        </Typography>
                    </div>
                </Fade>
                <Fade in={true} timeout={{ enter: 1750 }}>
                    <div>
                        <Typography variant="h4" component="h2" className="mb-4">
                            1. Qu’est-ce qu’un “cookie” ?
                        </Typography>
                        <Typography className="mb-5">
                            Un “cookie” est une suite d’informations, généralement de petite taille et identifié par un nom, qui peut être
                            transmis à votre navigateur par un site web sur lequel vous vous connectez. Votre navigateur web le conservera
                            pendant une certaine durée, et le renverra au serveur web chaque fois que vous vous y re-connecterez. Les
                            cookies ont de multiples usages : ils peuvent servir à mémoriser votre identifiant client auprès d’un site
                            marchand, le contenu courant de votre panier d’achat, un identifiant permettant de tracer votre navigation pour
                            des finalités statistiques ou publicitaires, etc.
                        </Typography>
                    </div>
                </Fade>
                <Fade in={true} timeout={{ enter: 2250 }}>
                    <div>
                        <Typography variant="h4" component="h2" className="mb-4">
                            2. Pourquoi des cookies ?
                        </Typography>
                        <Typography className="mb-3">
                            Lorsque vous naviguez sur notre site, des informations relatives à votre navigation sont susceptibles d’être
                            enregistrées dans des fichiers « Cookies » déposés sur votre ordinateur, tablette numérique ou smartphone.
                        </Typography>
                        <ul>
                            <li>
                                D’afficher, lors de votre première visite, le bandeau signalant la présence de cookies et la faculté que
                                vous avez de les accepter ou de les refuser.
                            </li>
                            <li>
                                D’établir des mesures statistiques de fréquentation et d’utilisation du site en vue d’adapter le site aux
                                demandes de ses visiteurs : nombre de visites sur le «www.journal-officiel.gouv.fr» et de ses rubriques,
                                nombre de pages vues, les pages visitées.
                            </li>
                        </ul>
                        <Typography className="mb-5">2 types de cookies sont déposés sur le site journal officiel :</Typography>
                        <Typography variant="h5" component="h3" className="mb-4">
                            2.1 Cookies internes nécessaires au site pour fonctionner
                        </Typography>
                        <Typography className="mb-5">
                            Ces cookies permettent au site de fonctionner de manière optimale. Vous pouvez vous y opposer et les supprimer
                            en utilisant les paramètres de votre navigateur, cependant votre expérience utilisateur risque d’être dégradée.
                        </Typography>
                        <Typography variant="h5" component="h3" className="mb-4">
                            2.2 Cookies tiers destinés à améliorer l’interactivité du site.
                        </Typography>
                        <Typography className="mb-3">À savoir :</Typography>
                        <ul>
                            <li>Les données collectées ne sont pas recoupées avec d’autres traitements</li>
                            <li>Le cookie ne permet pas de suivre la navigation de l’internaute sur d’autres sites.</li>
                        </ul>
                        <Typography className="mb-5">
                            Vous pouvez paramétrer votre navigateur afin qu’il vous signale la présence de cookies et vous propose de les
                            accepter ou non. Vous pouvez accepter ou refuser les cookies au cas par cas ou bien les refuser une fois pour
                            toutes. Il est rappelé que ce paramétrage est susceptible de modifier vos conditions d’accès aux services du
                            site nécessitant l’utilisation de cookies. Le paramétrage des cookies est différent pour chaque navigateur et en
                            général décrit dans les menus d’aide.
                        </Typography>
                    </div>
                </Fade>
                <Fade in={true} timeout={{ enter: 3000 }}>
                    <div>
                        <Typography variant="h4" component="h2" className="mb-4">
                            3. Comment supprimer les cookies ?
                        </Typography>
                        <Typography className="mb-5">
                            Vous pouvez désactiver les cookies. Votre navigateur peut également être paramétré pour vous signaler les
                            cookies qui sont déposés dans votre ordinateur et vous demander de les accepter ou non. Vous pouvez accepter ou
                            refuser les cookies au cas par cas ou bien les refuser systématiquement une fois pour toutes. Nous vous
                            rappelons que le paramétrage est susceptible de modifier vos conditions d’accès à nos services nécessitant
                            l’utilisation de cookies. La configuration de chaque navigateur est différente. Elle est décrite dans le menu
                            d’aide de votre navigateur, qui vous permettra de savoir de quelle manière modifier vos souhaits en matière de
                            cookies. Vous pouvez désactiver les cookies en suivant les instructions comme suit :
                        </Typography>
                        <Typography variant="h5" component="h3" className="mb-4">
                            3.1. Internet Explorer
                        </Typography>
                        <ul>
                            <li>Dans Internet Explorer, cliquez sur le bouton « Outils », puis sur « Options Internet ».</li>
                            <li>Sous l’onglet « Général », sous « Historique de navigation », cliquez sur « Paramètres ».</li>
                            <li>Cliquez sur le bouton « Afficher les fichiers ».</li>
                            <li>
                                Cliquez sur l’en-tête de colonne « Nom » pour trier tous les fichiers dans l’ordre alphabétique, puis
                                parcourez la liste jusqu’à ce que vous trouviez des fichiers commençant par le préfixe « Cookie » (tous les
                                cookies possèdent ce préfixe et contiennent habituellement le nom du site Web qui a créé le cookie).
                            </li>
                            <li>Sélectionnez-le ou les cookies comprenant le nom « moodulo-scout.fr » et supprimez-les.</li>
                            <li>
                                Fermez la fenêtre qui contient la liste des fichiers, puis cliquez deux fois sur OK pour retourner dans
                                Internet Explorer.
                            </li>
                        </ul>
                        <Typography className="mb-5">Précisions, actualisation : consultez la page d’aide d’Internet Explorer.</Typography>
                        <Typography variant="h5" component="h3" className="mb-4">
                            3.2. Firefox
                        </Typography>
                        <ul>
                            <li>Allez dans l’onglet « Outils » du navigateur, puis sélectionnez le menu « Options ».</li>
                            <li>Dans la fenêtre qui s’affiche, choisissez « Vie privée » et cliquez sur « Affichez les cookies ».</li>
                            <li>Dans la fenêtre qui s’affiche, choisissez « Vie privée » et cliquez sur « Affichez les cookies ».</li>
                            <li>Repérez les fichiers qui contiennent le nom « modulo-scout.fr ». Sélectionnez-les et supprimez-les.</li>
                        </ul>
                        <Typography className="mb-5">Précisions, actualisation : consultez la page d’aide de Firefox.</Typography>
                        <Typography variant="h5" component="h3" className="mb-4">
                            3.3. Safari
                        </Typography>
                        <ul>
                            <li>Dans votre navigateur, choisissez le menu « Édition » Préférences ».</li>
                            <li>Cliquez sur « Sécurité ».</li>
                            <li>Cliquez sur « Afficher les cookies ».</li>
                            <li>
                                Sélectionnez les cookies qui contiennent le nom « modulo-scout.fr » et cliquez sur « Effacer » ou sur « Tout
                                effacer ».
                            </li>
                            <li>Après avoir supprimé les cookies, cliquez sur « Terminé ».</li>
                        </ul>
                        <Typography className="mb-5">Précisions, actualisation : consultez la page d’aide de Safari.</Typography>

                        <Typography variant="h5" component="h3" className="mb-4">
                            3.4. Google Chrome
                        </Typography>
                        <ul>
                            <li>Cliquez sur l’icône du menu « Outils ».</li>
                            <li>Sélectionnez « Options ».</li>
                            <li>Cliquez sur l’onglet « Options avancées » et accédez à la section « Confidentialité ».</li>
                            <li>Cliquez sur le bouton « Afficher les cookies ».</li>
                            <li>Repérez les fichiers qui contiennent le nom « modulo-scout.fr ». Sélectionnez-les et supprimez-les.</li>
                            <li>Cliquez sur « Fermer » pour revenir à votre navigateur.</li>
                        </ul>
                        <Typography>Précisions, actualisation : consultez la page d’aide de Chrome.</Typography>
                    </div>
                </Fade>
            </div>
        </React.Fragment>
    );
}
