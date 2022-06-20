import React, { useRef, useState } from "react";
import Typography from "@mui/material/Typography";
import { Formik, Form } from "formik";
import Button from "@mui/material/Button";
import CheckIcon from "@mui/icons-material/Check";
import AddIcon from "@mui/icons-material/Add";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import * as yup from "yup";
import { useQuery } from "react-query";
import frLocale from "date-fns/locale/fr";
import { AppointmentForm } from "@devexpress/dx-react-scheduler-material-ui";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";

import { getUsers } from "../api/user";
import { getCategories } from "../api/category";
import { getRoles } from "../api/role";
import DarkTextField from "./Mui/DarkTextField";
import DarkAutocomplete from "./Mui/DarkAutocomplete";
import DarkDateTimePicker from "./Mui/DarkDateTimePicker";
import { attributes, isGrantedEvent } from "../services/event";

export default function SchedulerEventFormOverlay({
    children,
    event,
    eventDefaultValues,
    handleCommit,
    setOpenedEditForm,
    actionEnabled,
    user,
    ...restProps
}) {
    const { data: categories, isFetching: isCategoriesLoading } = useQuery("categories", getCategories, {
        initialData: { "hydra:member": [] },
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchInterval: 60000 * 5, // 5 minutes
        enabled: restProps.visible
    });
    const { data: users, isFetching: isusersLoading } = useQuery("users", getUsers, {
        initialData: { "hydra:member": [] },
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchInterval: 60000 * 5, // 5 minutes
        enabled: restProps.visible
    });
    const { data: roles, isFetching: isRolesLoading } = useQuery("roles", getRoles, {
        initialData: { "hydra:member": [] },
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchInterval: 60000 * 5, // 5 minutes
        enabled: restProps.visible
    });
    const visibilities = ["public_access", "restricted_access", "private_access"];
    const optionLabels = { public_access: "Publique", restricted_access: "Restreinte", private_access: "Privée" };
    const validationSchema = yup.object({
        categories: yup.array(),
        description: yup.string().required("Veuillez saisir une description."),
        startDate: yup.date().typeError("Veuillez saisir une date valide.").required("Veuillez saisir une date de début."),
        endDate: yup
            .date()
            .typeError("Veuillez saisir une date valide.")
            .min(yup.ref("startDate"), "La date de fin doit être supérieure à la date de début.")
            .nullable(),
        name: yup.string().required("Veuillez saisir un nom."),
        users: yup.array(),
        roles: yup.array(),
        visibility: yup.string().typeError("Veuillez saisir une visibilité valide.")
    });
    const initialValues = event ?? {
        categories: [],
        description: "",
        startDate: null,
        endDate: null,
        name: "",
        users: [],
        roles: [],
        visibility: "public_access",
        ...eventDefaultValues
    };
    const [disabledRoles, setDisabledRoles] = useState([]);
    const canAdd = isGrantedEvent(attributes.ADD, user);
    const canEdit = event ? isGrantedEvent(attributes.EDIT, user, event) : false;
    const canAddParticipants = isGrantedEvent(attributes.ADD_PARTICIPANTS, user);
    const canAddRoles = isGrantedEvent(attributes.ADD_ROLES, user);
    const canChangeVisibility = isGrantedEvent(attributes.SET_VISIBILITY, user, event);
    const formRef = useRef();

    const handleCategoryChange = (setFieldValue, categories) => {
        setFieldValue("categories", categories);
        setDisabledRoles([]);

        let formRoles = formRef.current.values.roles;
        let defaultRoles = [];
        let rolesId = [];

        // Get each category's default invited roles id
        categories.map(({ invitedRoles }) => {
            invitedRoles.map((role) => {
                defaultRoles.push(role);
            });
        });

        // Set new roles
        setFieldValue(
            "roles",
            [...defaultRoles, ...formRoles].filter((role) => {
                if (rolesId.includes(role["@id"])) {
                    return false;
                }

                rolesId.push(role["@id"]);

                return true;
            })
        );

        setDisabledRoles(defaultRoles);
    };

    const handleSubmit = (values) => {
        handleCommit({
            added: !event ? values : undefined,
            changed: event ? { [values["@id"]]: values } : undefined,
            deleted: undefined
        });

        setOpenedEditForm(false);
    };

    return (
        <AppointmentForm.Overlay {...restProps}>
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
                enableReinitialize
                innerRef={formRef}
            >
                {({ values, touched, errors, handleChange, handleBlur, setFieldValue, setFieldTouched }) => (
                    <Form style={{ minHeight: "100%" }}>
                        <Box
                            className="container-fluid position-relative"
                            sx={{
                                backgroundColor: "box.mainBox.background",
                                color: "box.mainBox.color",
                                minHeight: "100%"
                            }}
                        >
                            <IconButton
                                className="position-absolute top-0 end-0 m-1"
                                aria-label="close"
                                size="large"
                                onClick={() => setOpenedEditForm(false)}
                            >
                                <CloseIcon sx={{ color: "box.mainBox.color" }} fontSize="inherit" />
                            </IconButton>
                            <Typography variant="h4" className="text-center py-4">
                                {event ? "Modifier un événement" : "Créer un événement"}
                            </Typography>
                            <div className="row justify-content-between">
                                <div className="col-12 col-xl-6">
                                    <div className="mx-1 d-flex flex-column justify-content-between">
                                        <DarkTextField
                                            id="name"
                                            name="name"
                                            label="Nom"
                                            variant="outlined"
                                            fullWidth
                                            value={values.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.name && !!errors.name}
                                            helperText={touched.name && errors.name}
                                            className="my-2"
                                        />
                                        <LocalizationProvider dateAdapter={AdapterDateFns} locale={frLocale}>
                                            <DarkDateTimePicker
                                                id="startDate"
                                                name="startDate"
                                                label="Date de début"
                                                value={values.startDate}
                                                onChange={(value) => setFieldValue("startDate", value)}
                                                variant="outlined"
                                                ampm={false}
                                                renderInput={(props) => (
                                                    <DarkTextField
                                                        {...props}
                                                        className="my-2"
                                                        fullWidth
                                                        error={touched.startDate && !!errors.startDate}
                                                        onBlur={() => setFieldTouched("startDate", true)}
                                                        helperText={touched.startDate && errors.startDate}
                                                        sx={{
                                                            "& .MuiSvgIcon-root": {
                                                                color: "box.mainBox.color"
                                                            }
                                                        }}
                                                    />
                                                )}
                                            />
                                        </LocalizationProvider>
                                        <LocalizationProvider dateAdapter={AdapterDateFns} locale={frLocale}>
                                            <DarkDateTimePicker
                                                id="endDate"
                                                name="endDate"
                                                label="Date de fin"
                                                value={values.endDate}
                                                onChange={(value) => setFieldValue("endDate", value)}
                                                variant="outlined"
                                                ampm={false}
                                                renderInput={(props) => (
                                                    <DarkTextField
                                                        {...props}
                                                        className="my-2"
                                                        fullWidth
                                                        error={touched.endDate && !!errors.endDate}
                                                        onBlur={() => setFieldTouched("endDate", true)}
                                                        helperText={touched.endDate && errors.endDate}
                                                        sx={{
                                                            "& .MuiSvgIcon-root": {
                                                                color: "box.mainBox.color"
                                                            }
                                                        }}
                                                    />
                                                )}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                </div>
                                <div className="col-12 col-xl-6">
                                    <div className="mx-1">
                                        <FormControl fullWidth className="my-2" error={touched.categories && !!errors.categories}>
                                            <DarkAutocomplete
                                                loading={isCategoriesLoading}
                                                loadingText="Chargement..."
                                                noOptionsText="Aucune catégorie trouvée"
                                                id="categories"
                                                name="categories"
                                                value={values.categories}
                                                onChange={(event, value) => handleCategoryChange(setFieldValue, value)}
                                                onBlur={handleBlur}
                                                options={categories["hydra:member"]}
                                                isOptionEqualToValue={(option, value) => option["@id"] === value["@id"]}
                                                disableCloseOnSelect
                                                getOptionLabel={({ name }) => name}
                                                renderOption={(props, { name }, { selected }) => (
                                                    <li {...props}>
                                                        <Checkbox
                                                            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                                            checkedIcon={<CheckBoxIcon fontSize="small" />}
                                                            style={{ marginRight: 8 }}
                                                            checked={selected}
                                                        />
                                                        {name}
                                                    </li>
                                                )}
                                                renderInput={(params) => <DarkTextField {...params} label="Catégories" />}
                                                multiple
                                                openOnFocus
                                                limitTags={2}
                                            />
                                            <FormHelperText>{touched.categories && errors.categories}</FormHelperText>
                                        </FormControl>
                                        <FormControl fullWidth className="my-2" error={touched.roles && !!errors.roles}>
                                            <DarkAutocomplete
                                                disabled={!canAddRoles}
                                                loading={isRolesLoading}
                                                loadingText="Chargement..."
                                                noOptionsText="Aucun rôle trouvé"
                                                id="roles"
                                                name="roles"
                                                value={values.roles}
                                                onChange={(event, value) => setFieldValue("roles", value)}
                                                onBlur={handleBlur}
                                                options={roles["hydra:member"]}
                                                isOptionEqualToValue={(option, value) => option["@id"] === value["@id"]}
                                                disableCloseOnSelect
                                                getOptionLabel={({ name }) => name}
                                                renderOption={(props, { name }, { selected }) => (
                                                    <li {...props}>
                                                        <Checkbox
                                                            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                                            checkedIcon={<CheckBoxIcon fontSize="small" />}
                                                            style={{ marginRight: 8 }}
                                                            checked={selected}
                                                        />
                                                        {name}
                                                    </li>
                                                )}
                                                renderInput={(params) => (
                                                    <DarkTextField {...params} label="Rôles invités" disabled={!canAddRoles} />
                                                )}
                                                multiple
                                                openOnFocus
                                                limitTags={1}
                                                renderTags={(tagValue, getTagProps) =>
                                                    tagValue.map((option, index) => (
                                                        <Chip
                                                            {...getTagProps({ index })}
                                                            key={index}
                                                            label={option.name}
                                                            disabled={disabledRoles.indexOf(option) !== -1}
                                                        />
                                                    ))
                                                }
                                            />
                                            <FormHelperText>{touched.roles && errors.roles}</FormHelperText>
                                        </FormControl>
                                        <FormControl fullWidth className="my-2" error={touched.users && !!errors.users}>
                                            <DarkAutocomplete
                                                disabled={!canAddParticipants}
                                                loading={isusersLoading}
                                                loadingText="Chargement..."
                                                noOptionsText="Aucun utilisateur trouvé"
                                                id="users"
                                                name="users"
                                                value={values.users}
                                                onChange={(event, value) => setFieldValue("users", value)}
                                                onBlur={handleBlur}
                                                options={users["hydra:member"]}
                                                isOptionEqualToValue={(option, value) => option["@id"] === value["@id"]}
                                                disableCloseOnSelect
                                                getOptionLabel={({ fullName, firstName, lastName }) =>
                                                    fullName ?? `${firstName} ${lastName}`
                                                }
                                                renderOption={(props, { fullName }, { selected }) => (
                                                    <li {...props}>
                                                        <Checkbox
                                                            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                                            checkedIcon={<CheckBoxIcon fontSize="small" />}
                                                            style={{ marginRight: 8 }}
                                                            checked={selected}
                                                        />
                                                        {fullName}
                                                    </li>
                                                )}
                                                renderInput={(params) => (
                                                    <DarkTextField
                                                        {...params}
                                                        label="Personnes invitées"
                                                        error={touched.users && !!errors.users}
                                                        disabled={!canAddParticipants}
                                                    />
                                                )}
                                                multiple
                                                openOnFocus
                                                limitTags={2}
                                            />
                                            <FormHelperText>{touched.users && errors.users}</FormHelperText>
                                        </FormControl>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="my-2 mx-1">
                                        <DarkTextField
                                            id="description"
                                            name="description"
                                            label="Description"
                                            variant="outlined"
                                            fullWidth
                                            value={values.description}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.description && !!errors.description}
                                            helperText={touched.description && errors.description}
                                            multiline
                                            minRows="3"
                                        />
                                    </div>
                                    <FormControl fullWidth className="my-2" error={touched.visibility && !!errors.visibility}>
                                        <DarkAutocomplete
                                            disabled={!canChangeVisibility}
                                            id="visibility"
                                            name="visibility"
                                            value={values.visibility}
                                            onChange={(event, value) => setFieldValue("visibility", value)}
                                            onBlur={handleBlur}
                                            options={visibilities}
                                            getOptionLabel={(option) => optionLabels[option]}
                                            renderInput={(params) => (
                                                <DarkTextField
                                                    {...params}
                                                    label="Visibilité"
                                                    error={touched.visibility && !!errors.visibility}
                                                    disabled={!canChangeVisibility}
                                                />
                                            )}
                                            openOnFocus
                                        />
                                        <FormHelperText>{touched.visibility && errors.visibility}</FormHelperText>
                                    </FormControl>
                                </div>
                            </div>
                            <div className="text-center my-4 pb-2">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={!actionEnabled || (event ? !canEdit : !canAdd)}
                                    endIcon={event ? <CheckIcon /> : <AddIcon />}
                                >
                                    {event ? "Modifier" : "Ajouter"}
                                </Button>
                            </div>
                        </Box>
                    </Form>
                )}
            </Formik>
        </AppointmentForm.Overlay>
    );
}
