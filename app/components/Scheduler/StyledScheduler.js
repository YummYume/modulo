import { useTheme, styled } from "@mui/material/styles";
import {
    AllDayPanel,
    Appointments,
    AppointmentTooltip,
    ConfirmationDialog,
    DateNavigator,
    DayView,
    DragDropProvider,
    MonthView,
    TodayButton,
    WeekView
} from "@devexpress/dx-react-scheduler-material-ui";

// Tooltips
export const StyledTooltipLayoutComponent = styled(AppointmentTooltip.Layout)(() => ({
    "& .MuiPaper-root": {
        backgroundColor: "transparent"
    }
}));

export const StyledTooltipHeaderComponent = styled(AppointmentTooltip.Header)(() => {
    const theme = useTheme();

    return {
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
    };
});

export const StyledTooltipContentComponent = styled(AppointmentTooltip.Content)(() => {
    const theme = useTheme();

    return {
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
    };
});

// Appointments
export const StyledAppointmentComponent = styled(Appointments.Appointment)(() => {
    const theme = useTheme();

    return {
        backgroundColor: theme.palette.secondary.main + " !important",
        borderRadius: "5px !important"
    };
});

// Today button
export const StyledTodayButtonComponent = styled(TodayButton.Button)(() => {
    const theme = useTheme();

    return {
        borderColor: theme.palette.box.mainBox.color,
        color: theme.palette.box.mainBox.color,
        "&:hover": {
            backgroundColor: theme.palette.box.mainBox.background,
            borderColor: theme.palette.box.mainBox.color
        }
    };
});

// Date navigator
export const StyledNavigationButtonComponent = styled(DateNavigator.NavigationButton)(() => {
    const theme = useTheme();

    return {
        color: theme.palette.box.mainBox.color,
        "&:hover": {
            backgroundColor: theme.palette.box.mainBox.background
        }
    };
});

export const StyledOpenButtonComponent = styled(DateNavigator.OpenButton)(() => {
    const theme = useTheme();

    return {
        color: theme.palette.box.mainBox.color,
        "&:hover": {
            backgroundColor: theme.palette.box.mainBox.background
        }
    };
});

export const StyledDateOverlayComponent = styled(DateNavigator.Overlay)(() => {
    const theme = useTheme();

    return {
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
    };
});

// Month view
export const StyledMonthViewDayLayoutComponent = styled(MonthView.DayScaleLayout)(() => {
    const theme = useTheme();

    return {
        "& .MuiTableRow-root": {
            "& .MuiTableCell-root": {
                backgroundColor: theme.palette.menu.background,
                "& .Cell-dayOfWeek": {
                    color: theme.palette.menu.color
                }
            }
        }
    };
});

export const StyledMonthViewDayCellComponent = styled(MonthView.TimeTableCell)(() => {
    const theme = useTheme();

    return {
        "& .Cell-text:not(.Cell-otherMonth)": {
            color: theme.palette.menu.color
        },
        "& .Cell-otherMonth": {
            color: theme.palette.menu.color,
            opacity: 0.5
        }
    };
});

// Week view
export const StyledWeekViewDayLayoutComponent = styled(WeekView.DayScaleLayout)(() => {
    const theme = useTheme();

    return {
        "& .MuiTableRow-root": {
            "& .MuiTableCell-root": {
                backgroundColor: theme.palette.menu.background,
                "& .Cell-dayOfWeek": {
                    color: theme.palette.menu.color
                },
                "& .Cell-dayOfMonth": {
                    color: theme.palette.menu.color
                }
            }
        }
    };
});

export const StyledWeekTimeScaleLayoutComponent = styled(WeekView.TimeScaleLayout)(() => {
    const theme = useTheme();

    return {
        "& .MuiTableRow-root": {
            "& .MuiTableCell-root": {
                backgroundColor: theme.palette.menu.background,
                "& .Label-label > .Label-text": {
                    color: theme.palette.menu.color
                }
            }
        }
    };
});

// Day view
export const StyledDayViewDayLayoutComponent = styled(DayView.DayScaleLayout)(() => {
    const theme = useTheme();

    return {
        "& .MuiTableRow-root": {
            "& .MuiTableCell-root": {
                backgroundColor: theme.palette.menu.background,
                "& .Cell-dayView > .Cell-dayOfWeek, .Cell-dayOfMonth": {
                    color: theme.palette.menu.color
                }
            }
        }
    };
});

export const StyledDayTimeScaleLayoutComponent = styled(DayView.TimeScaleLayout)(() => {
    const theme = useTheme();

    return {
        "& .MuiTableRow-root": {
            "& .MuiTableCell-root": {
                backgroundColor: theme.palette.menu.background,
                "& .Label-label > .Label-text": {
                    color: theme.palette.menu.color
                }
            }
        }
    };
});

// All day panel
export const StyledAllDayPanelTitleCellComponent = styled(AllDayPanel.TitleCell)(() => {
    const theme = useTheme();

    return {
        backgroundColor: theme.palette.menu.background,
        "& .TitleCell-title": {
            color: theme.palette.menu.color + " !important"
        }
    };
});

export const StyledAllDayPanelCellComponent = styled(AllDayPanel.Cell)(() => {
    const theme = useTheme();

    return {
        backgroundColor: theme.palette.menu.background,
        "&:hover": {
            backgroundColor: theme.palette.menu.background + " !important",
            opacity: 0.9
        }
    };
});

// Drag and drop
export const StyledDragAndDropLayoutComponent = styled(DragDropProvider.DraftAppointment)(() => {
    const theme = useTheme();

    return {
        backgroundColor: theme.palette.secondary.main + " !important",
        borderRadius: "6px" + " !important"
    };
});

export const StyledDragAndDropSourceLayoutComponent = styled(DragDropProvider.SourceAppointment)(() => {
    const theme = useTheme();

    return {
        backgroundColor: theme.palette.secondary.main + " !important",
        borderRadius: "6px" + " !important"
    };
});

// Confirmation dialog
export const StyledConfirmationDialogOverlayComponent = styled(ConfirmationDialog.Overlay)(() => {
    const theme = useTheme();

    return {
        "& .MuiPaper-root": {
            backgroundColor: theme.palette.menu.background,
            color: theme.palette.menu.color,
            "& .MuiButton-root": {
                color: theme.palette.menu.color,
                "&:hover": {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.text.main
                }
            }
        }
    };
});
