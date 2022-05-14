import React from "react";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import Head from "next/head";

export default function LegalNotice() {
    return (
        <React.Fragment>
            <Head>
                <title>Modulo | Mentions Légales</title>
                <meta name="description" content="Les mentions légales concernant notre site modulo-scout.fr." />
            </Head>
            <div className="container-fluid w-100 my-3">
                <h1>
                    <Typography variant="h1" className="text-center mb-5">
                        Mentions Légales
                    </Typography>
                </h1>
                <Slide direction="up" in={true} timeout={{ enter: 1000 }} mountOnEnter unmountOnExit>
                    <div>
                        <Typography variant="h2" className="mb-4">
                            Identification et publication
                        </Typography>
                        <Typography variant="body1" className="mb-5">
                            Il est précisé aux Utilisateurs du site www.modulo-scout.com l’identité des différents intervenants dans le
                            cadre de sa réalisation et de son suivi :<br />
                            <br />
                            Le présent site est publié par : Modulo scout ,dont le siège social est sis xxxxxx
                            <br />
                            Numéro de téléphone : 01 01 01 01 01
                            <br />
                            Numéro SIRET : 000 000 000 00000 <br />
                            Numéro de TVA Intracommunautaire : FR00000000000 <br />
                            Directeur de la publication : xxxxxx
                        </Typography>
                        <Typography variant="h2" className="mb-4">
                            Marques
                        </Typography>
                        <Typography variant="body1" className="mb-5">
                            Les marques et logos de la société (nom société) figurant sur le site sont des marques et logos déposées. Toute
                            reproduction totale ou partielle de ces marques et logos sans autorisation expresse de la société (nom société)
                            est prohibée.
                        </Typography>
                        <Typography variant="h2" className="mb-4">
                            Hébergeur
                        </Typography>
                        <Typography variant="body1" className="mb-5">
                            L’hébergement est assuré par la société OVH dont le siège social est sis 2 rue Kellermann – 59100 Roubaix –
                            France. Numéro de téléphone de l’hébergeur 08 203 203 63 – n° indigo (0,118 €/min).
                        </Typography>
                        <Typography variant="h2" className="mb-4">
                            Protection de la vie privée
                        </Typography>
                        <Typography variant="body1" className="mb-5">
                            – Quelles données personnelles sont collectées :<br />
                            <br />
                            Si notre site ne propose pas de comptes utilisateurs, alors aucun enregistrement nominatif à ses visiteurs n’est
                            réalisé pour la simple consultation des pages. Cependant, pour la création d’un compte ou l’utilisation d’un
                            formulaire de contact, de paiement en ligne, vous pouvez-être invité à renseigner des données personnelles
                            (prénom, nom, email, téléphone, adresse…) le caractère obligatoire de ses données vous est précisé à l’aide
                            d’une astérisque.
                            <br />
                            Votre adresse IP peut aussi être collectée pour nous aider à détecter les commentaires et/ou avis indésirables.
                            <br /> <br /> – Des données sont collectées durant les actions suivantes : <br />
                            <br />
                            La création et l’utilisation d’un compte personnel, La réalisation d’une transaction en ligne (demande de
                            rendez-vous, demande de réservation à l’aide d’une formulaire de contact), L’utilisation du formulaire de
                            contact, livre d’or et/ou commentaires, La navigation sur le site internet et la consultation des pages, <br />{" "}
                            <br /> – Contenus embarqués depuis d’autres sites : <br />
                            <br />
                            Les pages de ce site peuvent inclure des contenus intégrés (par exemple des vidéos, images, articles…). Le
                            contenu intégré depuis d’autres sites se comporte de la même manière que si le visiteur se rendait sur cet autre
                            site. Ces sites web peuvent alors collecter des données sur vous, utiliser des cookies, embarquer des outils de
                            suivis tiers, suivre vos interactions avec ces contenus embarqués si vous disposez d’un compte connecté sur leur
                            site web. <br />
                            <br />– Combien de temps vos données sont conservées ?<br />
                            <br /> Si vous avez été amené à créer un compte utilisateur, ou à utiliser un formulaire de contact ou de
                            réservation, vos données sont stockées pour une période maximale de 3 ans à compter de la dernière prise de
                            contact et/ou trace d’activité sur votre compte. Si vous avez été amenés à réaliser une transaction en ligne,
                            les données de vos commandes sont conservées durant l’execution de cette dernière et durant la période
                            nécessaire à des fins probatoire et de gestion des contentieux.
                            <br />
                            <br /> – Avec qui partageons nous vos données ?<br />
                            <br /> Vos données ne sont partagées avec aucune tierce partie et société partenaires. <br />
                            <br />– Comment exercer mon droit à la modification et suppression de mes données ?<br />
                            <br /> Conformément à la loi Informatique et Libertés du 6 janvier 1978 modifiée, vous disposez de droits
                            d’accès, de rectification, d’effacement, d’opposition au ou de limitation du traitement de vos données, de
                            retrait de votre consentement. Vous pouvez réaliser votre demande directement à l’aide du formulaire de contact
                            du site internet.
                        </Typography>
                        <Typography variant="h2" className="mb-4">
                            Date de la dernière mise à jour
                        </Typography>
                        <Typography variant="body1">
                            La dernière mise à jour de ces mentions légales, politique de confidentialité et conditions d’utilisation sont
                            en date du 08/05/2022.
                        </Typography>
                    </div>
                </Slide>
            </div>
        </React.Fragment>
    );
}
