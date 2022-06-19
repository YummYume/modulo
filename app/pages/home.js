import React, { useState, useEffect, useRef } from "react";
import { dehydrate, QueryClient, useQuery, useMutation, useQueryClient } from "react-query";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import format from "date-fns/format";
import { toast, Flip } from "react-toastify";
import { zonedTimeToUtc } from "date-fns-tz";
import Paper from "@mui/material/Paper";
import {
    Scheduler,
    Appointments,
    MonthView,
    DayView,
    WeekView,
    Toolbar,
    ViewSwitcher,
    DateNavigator,
    TodayButton,
    AppointmentTooltip,
    DragDropProvider,
    ConfirmationDialog,
    AppointmentForm,
    AllDayPanel
} from "@devexpress/dx-react-scheduler-material-ui";
import { EditingState, IntegratedEditing, ViewState } from "@devexpress/dx-react-scheduler";
import { connectProps } from "@devexpress/dx-react-core";
import DescriptionIcon from "@mui/icons-material/Description";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { useTheme, styled } from "@mui/material/styles";
import PeopleIcon from "@mui/icons-material/People";
import Box from "@mui/material/Box";

import { getCurrentUserFromServer } from "../api/user";
import { useUser } from "../hooks/useUser";
import { isGranted, features } from "../services/user";
import { getEvents, getEventsFromServer, addEvent, editEvent, deleteEvent } from "../api/event";
import SchedulerEventFormOverlay from "../components/SchedulerEventFormOverlay";
import UserAvatar from "../components/UserAvatar";
import DarkSelect from "../components/Mui/DarkSelect";

export default function Home({ isPageReady }) {
    const theme = useTheme();
    const queryClient = useQueryClient();
    const [canView, setCanView] = useState(false);
    const [canAddEvent, setCanAddEvent] = useState(false);
    const [actionEnabled, setActionEnabled] = useState(false);
    const [currentSelectedEvent, setCurrentSelectedEvent] = useState(null);
    const [openedEditForm, setOpenedEditForm] = useState(false);
    const defaultCurrentDate = new Date();
    const defaultCurrentViewName = "Day";
    const eventStatusToast = useRef(null);
    const serverTimezone = process.env.NEXT_PUBLIC_SERVER_TIMEZONE ?? "Etc/Greenwich";
    const { data: user } = useUser();
    const {
        data: events,
        isFetching: isFetchingEvents,
        refetch: fetchEvents
    } = useQuery("events", getEvents, {
        initialData: [],
        refetchOnWindowFocus: false,
        refetchInterval: false,
        enabled: false,
        select: (data) => {
            return data.map((event) => ({
                ...event,
                id: event["@id"], // this is required for the Scheduler to differentiate between events, we could use the normal id or simply the @id
                title: event.name, // this is required for the Scheduler to display the title
                startDate: event.startDate ? zonedTimeToUtc(event.startDate, "Europe/Paris") : null,
                endDate: event.endDate ? zonedTimeToUtc(event.endDate, "Europe/Paris") : null
            }));
        }
    });
    const addEventMutation = useMutation((values) => addEvent(values), {
        onMutate: async () => {
            eventStatusToast.current = toast.loading(`Ajout de l'événement en cours...`);

            await queryClient.cancelQueries("events");
        },
        onSuccess: ({ data }) => {
            if (toast.isActive(eventStatusToast.current)) {
                toast.update(eventStatusToast.current, {
                    render: `Evénement ${data.name} ajouté avec succès.`,
                    type: toast.TYPE.SUCCESS,
                    autoClose: 5000,
                    isLoading: false,
                    closeButton: true,
                    closeOnClick: true,
                    draggable: true,
                    transition: Flip
                });
            } else {
                toast.success(`Evénement ${data.name} ajouté avec succès.`);
            }

            queryClient.setQueryData("events", (events) => [...events, data]);
        },
        onError: (error) => {
            let message = "Une erreur est survenue.";

            if (422 === error?.response?.status) {
                message = "Une erreur est survenue lors de l'ajout.";
            } else if (403 === error?.response?.status) {
                message = "Vous n'êtes pas autorisé à ajouter un événement.";
            }

            if (toast.isActive(eventStatusToast.current)) {
                toast.update(eventStatusToast.current, {
                    render: message,
                    type: toast.TYPE.ERROR,
                    autoClose: 5000,
                    isLoading: false,
                    closeButton: true,
                    closeOnClick: true,
                    draggable: true,
                    transition: Flip
                });
            } else {
                toast.error(message);
            }
        }
    });
    const editEventMutation = useMutation((data) => editEvent(data.id, data.values), {
        onMutate: async (data) => {
            eventStatusToast.current = toast.loading(`Modification de l'événement en cours...`);

            await queryClient.cancelQueries("events");
        },
        onSuccess: ({ data }) => {
            queryClient.setQueryData("events", (currentEvent) =>
                currentEvent.map((event) => (event["@id"] === data["@id"] ? { ...event, ...data } : event))
            );

            if (toast.isActive(eventStatusToast.current)) {
                toast.update(eventStatusToast.current, {
                    render: `Evénement ${data.name} modifié avec succès.`,
                    type: toast.TYPE.SUCCESS,
                    autoClose: 5000,
                    isLoading: false,
                    closeButton: true,
                    closeOnClick: true,
                    draggable: true,
                    transition: Flip
                });
            } else {
                toast.success(`Evénement ${data.name} modifié avec succès.`);
            }
        },
        onError: (error) => {
            let message = "Une erreur est survenue.";

            if (422 === error?.response?.status) {
                message = "Une erreur est survenue lors de la modification.";
            } else if (403 === error?.response?.status) {
                message = "Vous n'êtes pas autorisé à modifier cet événement.";
            }

            if (toast.isActive(eventStatusToast.current)) {
                toast.update(eventStatusToast.current, {
                    render: message,
                    type: toast.TYPE.ERROR,
                    autoClose: 5000,
                    isLoading: false,
                    closeButton: true,
                    closeOnClick: true,
                    draggable: true,
                    transition: Flip
                });
            } else {
                toast.error(message);
            }
        }
    });
    const deleteEventMutation = useMutation((data) => deleteEvent(data), {
        onMutate: async (data) => {
            eventStatusToast.current = toast.loading(`Suppression de l'événement en cours...`);

            await queryClient.cancelQueries("events");

            return events.find((event) => event["@id"] === data);
        },
        onSuccess: (data, id, context) => {
            queryClient.setQueryData("events", (currentEvent) => currentEvent.filter((event) => event["@id"] !== id));

            if (toast.isActive(eventStatusToast.current)) {
                toast.update(eventStatusToast.current, {
                    render: `Evénement ${context.name} supprimé avec succès.`,
                    type: toast.TYPE.SUCCESS,
                    autoClose: 5000,
                    isLoading: false,
                    closeButton: true,
                    closeOnClick: true,
                    draggable: true,
                    transition: Flip
                });
            } else {
                toast.success(`Evénement ${context.name} supprimé avec succès.`);
            }
        },
        onError: (error) => {
            let message = "Une erreur est survenue.";

            if (422 === error?.response?.status) {
                message = "Une erreur est survenue lors de la suppression.";
            } else if (403 === error?.response?.status) {
                message = "Vous n'êtes pas autorisé à supprimer cet événement.";
            }

            if (toast.isActive(eventStatusToast.current)) {
                toast.update(eventStatusToast.current, {
                    render: message,
                    type: toast.TYPE.ERROR,
                    autoClose: 5000,
                    isLoading: false,
                    closeButton: true,
                    closeOnClick: true,
                    draggable: true,
                    transition: Flip
                });
            } else {
                toast.error(message);
            }
        }
    });

    useEffect(() => {
        if (Boolean(user)) {
            setCanView(isGranted(features.AGENDA_ACCESS, user));
            setCanAddEvent(isGranted(features.EVENT_CRUD, user));
        }
    }, []);

    useEffect(() => {
        setActionEnabled(
            canView &&
                !addEventMutation.isLoading &&
                !editEventMutation.isLoading &&
                !deleteEventMutation.isLoading &&
                !isFetchingEvents &&
                isPageReady
        );
    }, [canView, addEventMutation, editEventMutation, deleteEventMutation, isFetchingEvents, isPageReady]);

    useEffect(() => {
        const eventRefetch = setInterval(
            (canView, openedEditForm) => {
                if (canView && !openedEditForm) {
                    console.log(canView && !openedEditForm);
                    console.log(canView, openedEditForm, !openedEditForm);
                    fetchEvents();
                }
            },
            120000,
            canView,
            openedEditForm
        );

        return () => {
            clearInterval(eventRefetch);
        };
    }, []);

    const handleOpenedEditFormChange = () => {
        if (actionEnabled) {
            setOpenedEditForm(!openedEditForm);
        }
    };

    const handleCommit = ({ added, changed, deleted }) => {
        if (Boolean(added)) {
            addEventMutation.mutate({
                name: added.name,
                description: added.notes,
                startDate: added.startDate ? zonedTimeToUtc(added.startDate, serverTimezone) : null,
                endDate: added.endDate ? zonedTimeToUtc(added.endDate, serverTimezone) : null,
                scope: user?.currentScope["@id"]
            });
        } else if (Boolean(changed)) {
            const changedId = Object.keys(changed)[0];
            const changedEvent = events.find((event) => event["@id"] === changedId);

            if (Boolean(changedEvent)) {
                const newValues = {
                    ...changedEvent,
                    ...changed[changedId]
                };

                editEventMutation.mutate({
                    id: changedId,
                    values: {
                        ...newValues,
                        startDate: newValues.startDate ? zonedTimeToUtc(newValues.startDate, serverTimezone) : null,
                        endDate: newValues.endDate ? zonedTimeToUtc(newValues.endDate, serverTimezone) : null,
                        categories: newValues.categories.map((category) => category["@id"]),
                        users: newValues.users.map((participant) => participant["@id"]),
                        roles: newValues.roles.map((role) => role["@id"])
                    }
                });
            }
        } else if (Boolean(deleted)) {
            deleteEventMutation.mutate(deleted);
        }

        return events;
    };

    // Tooltips
    const TooltipLayoutComponent = ({ children, onOpenButtonClick, onDeleteButtonClick, visible, ...restProps }) => (
        <AppointmentTooltip.Layout
            {...restProps}
            onOpenButtonClick={actionEnabled ? onOpenButtonClick : undefined}
            onDeleteButtonClick={actionEnabled ? onDeleteButtonClick : undefined}
            visible={actionEnabled ? visible : false}
        >
            {children}
        </AppointmentTooltip.Layout>
    );

    const TooltipCommandButtonComponent = ({ children, ...restProps }) => (
        <AppointmentTooltip.CommandButton
            {...restProps}
            style={{ color: theme.palette.box.mainBox.color }}
        ></AppointmentTooltip.CommandButton>
    );

    const StyledTooltipHeaderComponent = styled(AppointmentTooltip.Header)(() => ({
        backgroundColor: theme.palette.box.mainBox.background + " !important",
        "& .MuiButtonBase-root": {
            color: theme.palette.box.mainBox.color + " !important",
            "&:hover": {
                backgroundColor: theme.palette.box.mainBox.background
            }
        },
        "& .Header-line": {
            backgroundColor: theme.palette.box.mainBox.color + " !important"
        }
    }));

    const TooltipHeaderComponent = ({ children, ...restProps }) => (
        <StyledTooltipHeaderComponent {...restProps}></StyledTooltipHeaderComponent>
    );

    const StyledTooltipContentComponent = styled(AppointmentTooltip.Content)(() => ({
        backgroundColor: theme.palette.box.mainBox.background + " !important",
        color: theme.palette.box.mainBox.color + " !important",
        "& .Content-title": {
            color: theme.palette.box.mainBox.color + " !important"
        },
        "& .MuiGrid-container > .MuiGrid-root > .MuiSvgIcon-root": {
            color: theme.palette.box.mainBox.color + " !important"
        },
        "& .Content-relativeContainer > .MuiSvgIcon-root": {
            color: theme.palette.secondary.main + " !important"
        }
    }));

    const TooltipContentComponent = ({ children, appointmentData, ...restProps }) => (
        <StyledTooltipContentComponent {...restProps} appointmentData={appointmentData}>
            <Grid container alignItems="center">
                {appointmentData.description && (
                    <React.Fragment>
                        <Grid item xs={2} className="text-center" sx={{ paddingBottom: "12px" }}>
                            <DescriptionIcon />
                        </Grid>
                        <Grid item xs={10} sx={{ paddingBottom: "12px" }}>
                            <span>{appointmentData.description}</span>
                        </Grid>
                    </React.Fragment>
                )}
                {appointmentData.users?.length && (
                    <React.Fragment>
                        <Grid item xs={2} className="text-center" sx={{ alignSelf: "baseline" }}>
                            <PeopleIcon />
                        </Grid>
                        <Grid item xs={10}>
                            {appointmentData.users.map((participant) => (
                                <div key={participant["@id"]} className="row justify-content-center align-items-center mb-2">
                                    <div className="col-2">
                                        <UserAvatar user={participant} />
                                    </div>
                                    <div className="col-10 text-start">
                                        <span>{participant.fullName}</span>
                                    </div>
                                </div>
                            ))}
                        </Grid>
                    </React.Fragment>
                )}
            </Grid>
        </StyledTooltipContentComponent>
    );

    // Switcher
    const SwitcherComponent = ({ currentView, availableViews, onChange }) => (
        <FormControl
            className="my-2"
            sx={{
                minWidth: 120,
                "& .MuiInputLabel-root": {
                    color: "menu.color"
                },
                "& .MuiInputLabel-root.Mui-focused": {
                    color: "menu.color"
                }
            }}
            size="small"
        >
            <InputLabel id="view-switcher-label">Vue</InputLabel>
            <DarkSelect
                labelId="view-switcher-label"
                id="view-switcher"
                value={currentView.name}
                label="Vue"
                onChange={(event) => onChange(event?.target?.value ?? "Month")}
            >
                {availableViews.map((view) => (
                    <MenuItem key={view.name} value={view.name}>
                        {view.displayName}
                    </MenuItem>
                ))}
            </DarkSelect>
        </FormControl>
    );

    // Appointment
    const AppointmentComponent = ({ children, style, onClick, onDoubleClick, ...restProps }) => (
        <Appointments.Appointment
            onClick={actionEnabled ? onClick : undefined}
            onDoubleClick={actionEnabled ? onDoubleClick : undefined}
            {...restProps}
            style={{
                ...style,
                backgroundColor: theme.palette.secondary.main,
                borderRadius: "5px"
            }}
        >
            {children}
        </Appointments.Appointment>
    );

    // Today button
    const StyledTodayButtonComponent = styled(TodayButton.Button)(() => ({
        borderColor: theme.palette.box.mainBox.color,
        color: theme.palette.box.mainBox.color,
        "&:hover": {
            backgroundColor: theme.palette.box.mainBox.background,
            borderColor: theme.palette.box.mainBox.color
        }
    }));

    const TodayButtonComponent = ({ children, ...restProps }) => <StyledTodayButtonComponent {...restProps}></StyledTodayButtonComponent>;

    // Date navigator
    const StyledNavigationButtonComponent = styled(DateNavigator.NavigationButton)(() => ({
        color: theme.palette.box.mainBox.color,
        "&:hover": {
            backgroundColor: theme.palette.box.mainBox.background
        }
    }));

    const NavigationButtonComponent = ({ children, ...restProps }) => (
        <StyledNavigationButtonComponent {...restProps}></StyledNavigationButtonComponent>
    );

    const StyledOpenButtonComponent = styled(DateNavigator.OpenButton)(() => ({
        color: theme.palette.box.mainBox.color,
        "&:hover": {
            backgroundColor: theme.palette.box.mainBox.background
        }
    }));

    const OpenButtonComponent = ({ children, ...restProps }) => <StyledOpenButtonComponent {...restProps}></StyledOpenButtonComponent>;

    const StyledDateOverlayComponent = styled(DateNavigator.Overlay)(() => ({
        "& .MuiPaper-root": {
            color: theme.palette.box.mainBox.color,
            backgroundColor: theme.palette.box.mainBox.background
        },
        "& .MuiIconButton-root": {
            color: theme.palette.box.mainBox.color,
            "&:hover": {
                backgroundColor: theme.palette.box.secondaryBox.background,
                color: theme.palette.box.secondaryBox.color
            }
        },
        "& .MuiTableCell-head": {
            color: theme.palette.box.mainBox.color
        },
        "& .MuiTableCell-body": {
            color: theme.palette.box.mainBox.color,
            "&:hover": {
                backgroundColor: theme.palette.box.secondaryBox.background,
                color: theme.palette.box.secondaryBox.color
            }
        }
    }));

    const DateOverlayComponent = ({ children, ...restProps }) => (
        <StyledDateOverlayComponent {...restProps}>{children}</StyledDateOverlayComponent>
    );

    // Month view
    const StyledMonthViewLayoutComponent = styled(MonthView.Layout)(() => ({
        "& .MainLayout-header": {
            "& .MuiTableCell-root": {
                backgroundColor: theme.palette.menu.background,
                "& .Cell-dayOfWeek": {
                    color: theme.palette.menu.color
                }
            }
        },
        "& .MainLayout-flexRow": {
            "& .MuiTableCell-root": {
                backgroundColor: theme.palette.menu.background,
                "& .Cell-text:not(.Cell-otherMonth)": {
                    color: theme.palette.menu.color
                },
                "& .Cell-otherMonth": {
                    color: theme.palette.menu.color,
                    opacity: 0.5
                }
            }
        }
    }));

    const MonthViewLayoutComponent = ({ children, ...restProps }) => (
        <StyledMonthViewLayoutComponent {...restProps}>{children}</StyledMonthViewLayoutComponent>
    );

    // Week view
    const StyledWeekViewLayoutComponent = styled(WeekView.Layout)(() => ({
        "& .MainLayout-header": {
            "& .MuiTableCell-root": {
                backgroundColor: theme.palette.menu.background,
                "& .Cell-dayOfWeek": {
                    color: theme.palette.menu.color
                },
                "& .Cell-dayOfMonth": {
                    color: theme.palette.menu.color
                }
            }
        },
        "& .MainLayout-flexRow": {
            "& .MuiTableCell-root": {
                backgroundColor: theme.palette.menu.background,
                "& .Label-label > .Label-text": {
                    color: theme.palette.menu.color
                }
            }
        },
        "& .TitleCell-container": {
            backgroundColor: theme.palette.menu.background,
            "& .TitleCell-title": {
                color: theme.palette.menu.color
            }
        }
    }));

    const WeekViewLayoutComponent = ({ children, ...restProps }) => (
        <StyledWeekViewLayoutComponent {...restProps}>{children}</StyledWeekViewLayoutComponent>
    );

    // Day view
    const StyledDayViewLayoutComponent = styled(DayView.Layout)(() => ({
        "& .MainLayout-header": {
            "& .MuiTableCell-root": {
                backgroundColor: theme.palette.menu.background,
                "& .Cell-dayOfWeek": {
                    color: theme.palette.menu.color
                },
                "& .Cell-dayOfMonth": {
                    color: theme.palette.menu.color
                }
            }
        },
        "& .MainLayout-flexRow": {
            "& .MuiTableCell-root": {
                backgroundColor: theme.palette.menu.background,
                "& .Label-label > .Label-text": {
                    color: theme.palette.menu.color
                }
            }
        },
        "& .TitleCell-container": {
            backgroundColor: theme.palette.menu.background,
            "& .TitleCell-title": {
                color: theme.palette.menu.color
            }
        }
    }));

    const DayViewLayoutComponent = ({ children, ...restProps }) => (
        <StyledDayViewLayoutComponent {...restProps}>{children}</StyledDayViewLayoutComponent>
    );

    return (
        <React.Fragment>
            <Head>
                <title>Accueil | Modulo</title>
                <meta name="description" content="Accueil de l'application Modulo." />
            </Head>
            <div className="container-fluid mx-sm-5">
                <Typography variant="h2" component="h1" className="text-center text-break my-5">
                    Accueil Connecté
                </Typography>
                <Typography variant="h3" component="h2" className="text-break mt-2">
                    Mon Agenda
                </Typography>
                <Paper
                    className="mt-2 mb-5 position-relative"
                    sx={{
                        border: `2px solid ${theme.palette.box.mainBox.color}`,
                        backgroundColor: theme.palette.menu.background,
                        color: theme.palette.menu.color
                    }}
                >
                    {!canView && (
                        <Box
                            className="position-absolute d-flex align-items-center justify-content-center"
                            sx={{
                                top: "50%",
                                right: "50%",
                                zIndex: "1000",
                                transform: "translate(50%, -50%)",
                                width: "100%",
                                height: "100%",
                                backgroundColor: theme.palette.box.mainBox.background,
                                color: theme.palette.box.mainBox.color,
                                opacity: 0.9,
                                padding: "0.5rem"
                            }}
                        >
                            <Typography variant="h2" component="h2" className="text-break text-center w-100 mt-2" sx={{ opacity: 1 }}>
                                {"Votre fonction actuelle ne vous permet pas d'accéder à l'agenda."}
                            </Typography>
                        </Box>
                    )}
                    <Scheduler data={events} height={700} locale="fr-FR" firstDayOfWeek={1}>
                        <ViewState
                            defaultCurrentDate={format(defaultCurrentDate, "yyyy-MM-dd")}
                            defaultCurrentViewName={defaultCurrentViewName}
                        />
                        <EditingState
                            onCommitChanges={handleCommit}
                            onEditingAppointmentChange={(event) => setCurrentSelectedEvent(event)}
                            onAddedAppointmentChange={() => setCurrentSelectedEvent(null)}
                        />
                        <IntegratedEditing />
                        <DayView displayName="Jour" layoutComponent={DayViewLayoutComponent} />
                        <WeekView displayName="Semaine" layoutComponent={WeekViewLayoutComponent} />
                        <MonthView displayName="Mois" layoutComponent={MonthViewLayoutComponent} />
                        <Toolbar />
                        <ViewSwitcher switcherComponent={SwitcherComponent} />
                        <Appointments appointmentComponent={AppointmentComponent} />
                        <DateNavigator
                            navigationButtonComponent={NavigationButtonComponent}
                            openButtonComponent={OpenButtonComponent}
                            overlayComponent={DateOverlayComponent}
                        />
                        <AllDayPanel messages={{ allDay: "Toute la journée" }} />
                        <TodayButton messages={{ today: "Aujourd'hui" }} buttonComponent={TodayButtonComponent} />
                        <ConfirmationDialog
                            messages={{
                                discardButton: "Ignorer",
                                deleteButton: "Supprimer",
                                cancelButton: "Annuler",
                                confirmDeleteMessage: "Voulez-vous vraiment supprimer cet événement ?",
                                confirmCancelMessage: "Ignorer les modifications non enregistrées ?"
                            }}
                        />
                        <AppointmentTooltip
                            showCloseButton
                            showOpenButton
                            showDeleteButton={actionEnabled}
                            commandButtonComponent={TooltipCommandButtonComponent}
                            headerComponent={TooltipHeaderComponent}
                            contentComponent={TooltipContentComponent}
                            layoutComponent={TooltipLayoutComponent}
                        />
                        <DragDropProvider allowDrag={() => actionEnabled} allowResize={() => actionEnabled} />
                        <AppointmentForm
                            readOnly={!actionEnabled}
                            visible={actionEnabled && openedEditForm}
                            onVisibilityChange={handleOpenedEditFormChange}
                            overlayComponent={connectProps(SchedulerEventFormOverlay, () => {
                                return {
                                    event: currentSelectedEvent,
                                    handleCommit: handleCommit,
                                    setOpenedEditForm: setOpenedEditForm
                                };
                            })}
                        />
                    </Scheduler>
                </Paper>
            </div>
        </React.Fragment>
    );
}

export async function getServerSideProps({ req }) {
    const queryClient = new QueryClient();
    let user;

    try {
        user = await queryClient.fetchQuery("user", () => getCurrentUserFromServer(req.headers.cookie));
    } catch (error) {
        return {
            redirect: {
                permanent: false,
                destination: "/"
            },
            props: {}
        };
    }

    try {
        if (Boolean(user)) {
            if (isGranted(features.AGENDA_ACCESS, user)) {
                await queryClient.prefetchQuery("events", () => getEventsFromServer(req.headers.cookie));
            }
        }
    } catch (error) {
        // TODO error logging
    }

    return {
        props: {
            dehydratedState: dehydrate(queryClient)
        }
    };
}
