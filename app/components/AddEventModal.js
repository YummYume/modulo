import React, { useEffect, useRef, useState } from "react";
import Typography from "@mui/material/Typography";
import { Formik, Form } from "formik";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import CheckIcon from "@mui/icons-material/Check";
import DateTimePicker from "@mui/lab/DateTimePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import * as yup from "yup";
import { useQuery } from "react-query";
import frLocale from "date-fns/locale/fr";

import { getUsers } from "../api/user";
import { getCategories } from "../api/category";
import { getRoles } from "../api/role";

export default function AddEventModal({
    addEventMutation,
    editEventMutation,
    handleClose,
    initialValuesOverride,
    open,
    user,
    selectedEvent
}) {
    const { data: categories, isFetching: isCategoriesLoading } = useQuery("categories", getCategories, {
        initialData: { "hydra:member": [] },
        refetchOnWindowFocus: false
    });
    const { data: users, isFetching: isusersLoading } = useQuery("users", getUsers, {
        initialData: { "hydra:member": [] },
        refetchOnWindowFocus: false
    });
    const { data: roles, isFetching: isRolesLoading } = useQuery("roles", getRoles, {
        initialData: { "hydra:member": [] },
        refetchOnWindowFocus: false
    });
    const validationSchema = yup.object({
        categories: yup.array(),
        description: yup.string().required("Veuillez saisir une description."),
        endDate: yup
            .date()
            .typeError("Veuillez saisir une date valide.")
            .min(yup.ref("startDate"), "La date de fin doit être supérieure à la date de début.")
            .nullable(),
        name: yup.string().required("Veuillez saisir un nom."),
        users: yup.array(),
        roles: yup.array(),
        startDate: yup.date().typeError("Veuillez saisir une date valide.").nullable()
    });
    const [initialValues, setInitialValues] = useState({
        categories: [],
        description: "",
        endDate: null,
        name: "",
        users: [],
        roles: [],
        startDate: null
    });
    const [disabledRoles, setDisabledRoles] = useState([]);
    const formRef = useRef();

    const handleSubmit = async (values) => {
        if (Boolean(selectedEvent)) {
            editEventMutation.mutate({
                id: selectedEvent["@id"],
                values: {
                    ...values,
                    categories: values.categories.map((category) => category["@id"]),
                    users: values.users.map((participant) => participant["@id"]),
                    roles: values.roles.map((role) => role["@id"])
                }
            });
        } else {
            addEventMutation.mutate({
                ...values,
                scope: user?.currentScope["@id"],
                categories: values.categories.map((category) => category["@id"]),
                users: values.users.map((participant) => participant["@id"]),
                roles: values.roles.map((role) => role["@id"])
            });
        }
    };

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

    useEffect(() => {
        if (initialValuesOverride) {
            setInitialValues({ ...initialValues, ...initialValuesOverride });
        } else {
            setInitialValues({
                name: "",
                description: "",
                active: true,
                startDate: null,
                endDate: null,
                categories: [],
                users: [],
                roles: []
            });
        }
    }, [initialValuesOverride]);

    return (
        <Modal open={open} onClose={handleClose} className="d-flex justify-content-center align-items-center row">
            <Box backgroundColor="box.index.backgroundLogin" className="rounded col-11 col-sm-10 col-md-9 col-lg-8 col-xl-7">
                <Formik
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    validationSchema={validationSchema}
                    enableReinitialize
                    innerRef={formRef}
                >
                    {({ isSubmitting, values, touched, errors, handleChange, handleBlur, setFieldValue, setFieldTouched }) => (
                        <Form>
                            <Typography variant="h4" className="text-center mt-4 mb-5">
                                {selectedEvent ? "Modifier un événement" : "Créer un événement"}
                            </Typography>
                            <div className="d-flex flex-wrap justify-content-between">
                                <div className="col-12 col-xl-6">
                                    <div className="mx-4 d-flex flex-column justify-content-between">
                                        <TextField
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
                                            <DateTimePicker
                                                id="startDate"
                                                name="startDate"
                                                label="Date de début"
                                                value={values.startDate}
                                                onChange={(value) => setFieldValue("startDate", value)}
                                                variant="outlined"
                                                ampm={false}
                                                renderInput={(props) => (
                                                    <TextField
                                                        {...props}
                                                        className="my-2"
                                                        fullWidth
                                                        error={touched.startDate && !!errors.startDate}
                                                        onBlur={() => setFieldTouched("startDate", true)}
                                                        helperText={touched.startDate && errors.startDate}
                                                    />
                                                )}
                                            />
                                        </LocalizationProvider>
                                        <LocalizationProvider dateAdapter={AdapterDateFns} locale={frLocale}>
                                            <DateTimePicker
                                                id="endDate"
                                                name="endDate"
                                                label="Date de fin"
                                                value={values.endDate}
                                                onChange={(value) => setFieldValue("endDate", value)}
                                                variant="outlined"
                                                ampm={false}
                                                renderInput={(props) => (
                                                    <TextField
                                                        {...props}
                                                        className="my-2"
                                                        fullWidth
                                                        error={touched.endDate && !!errors.endDate}
                                                        onBlur={() => setFieldTouched("endDate", true)}
                                                        helperText={touched.endDate && errors.endDate}
                                                    />
                                                )}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                </div>
                                <div className="col-12 col-xl-6">
                                    <div className="mx-4">
                                        <FormControl fullWidth className="my-2" error={touched.categories && !!errors.categories}>
                                            <Autocomplete
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
                                                renderInput={(params) => <TextField {...params} label="Catégories" />}
                                                multiple
                                                openOnFocus
                                                limitTags={2}
                                            />
                                            <FormHelperText>{touched.categories && errors.categories}</FormHelperText>
                                        </FormControl>
                                        <FormControl fullWidth className="my-2" error={touched.roles && !!errors.roles}>
                                            <Autocomplete
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
                                                renderInput={(params) => <TextField {...params} label="Rôles invités" />}
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
                                            <Autocomplete
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
                                                    <TextField
                                                        {...params}
                                                        label="Personnes invitées"
                                                        error={touched.users && !!errors.users}
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
                                    <div className="my-2 mx-4">
                                        <TextField
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
                                </div>
                            </div>
                            <div className="text-center my-4">
                                <LoadingButton
                                    loading={isSubmitting || addEventMutation.isLoading || editEventMutation.isLoading}
                                    type="submit"
                                    variant="contained"
                                    loadingPosition="end"
                                    endIcon={<CheckIcon />}
                                >
                                    {selectedEvent ? "Modifier" : "Ajouter"}
                                </LoadingButton>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Modal>
    );
}
