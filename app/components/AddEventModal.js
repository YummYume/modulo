import React from "react";
import Typography from "@mui/material/Typography";
import { Formik, Form } from "formik";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import CheckIcon from "@mui/icons-material/Check";
import DateTimePicker from "@mui/lab/DateTimePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterMoment from "@mui/lab/AdapterMoment";
import "moment/locale/fr";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

export default function AddEventModal({
    addEventMutation,
    categories,
    handleSubmit,
    initialValues,
    isCategoriesLoading,
    isParticipantsLoading,
    openModal,
    participants,
    setOpenModal,
    validationSchema
}) {
    return (
        <Modal open={openModal} onClose={() => setOpenModal(false)} className="d-flex justify-content-center align-items-center">
            <Box backgroundColor="box.index.backgroundLogin" maxWidth="90%" width="35rem" className="p-4 rounded">
                <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                    {({ isSubmitting, values, touched, errors, handleChange, handleBlur, setFieldValue, setFieldTouched }) => (
                        <Form>
                            <Typography variant="h4" className="text-center my-4">
                                Créer un événement
                            </Typography>
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
                                className="my-2"
                            />
                            <LocalizationProvider dateAdapter={AdapterMoment} locale={"fr"}>
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
                            <LocalizationProvider dateAdapter={AdapterMoment}>
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
                            <FormControl fullWidth className="my-2" error={touched.categories && !!errors.categories}>
                                <Autocomplete
                                    loading={isCategoriesLoading}
                                    loadingText="Chargement..."
                                    id="categories"
                                    name="categories"
                                    value={values.categories}
                                    onChange={(event, value) => setFieldValue("categories", value)}
                                    onBlur={handleBlur}
                                    options={categories["hydra:member"]}
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
                                <FormHelperText>{touched.participants && errors.participants}</FormHelperText>
                            </FormControl>
                            <FormControl fullWidth className="my-2" error={touched.participants && !!errors.participants}>
                                <Autocomplete
                                    loading={isParticipantsLoading}
                                    loadingText="Chargement..."
                                    id="participants"
                                    name="participants"
                                    value={values.participants}
                                    onChange={(event, value) => setFieldValue("participants", value)}
                                    onBlur={handleBlur}
                                    options={participants["hydra:member"]}
                                    disableCloseOnSelect
                                    getOptionLabel={({ fullName }) => fullName}
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
                                    renderInput={(params) => <TextField {...params} label="Participants" />}
                                    multiple
                                    openOnFocus
                                    limitTags={2}
                                />
                                <FormHelperText>{touched.participants && errors.participants}</FormHelperText>
                            </FormControl>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            id="active"
                                            name="active"
                                            variant="outlined"
                                            value={values.active}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.active && !!errors.active}
                                        />
                                    }
                                    label="Actif"
                                />
                            </FormGroup>
                            <div className="text-center">
                                <LoadingButton
                                    loading={isSubmitting || addEventMutation.isLoading}
                                    type="submit"
                                    variant="contained"
                                    loadingPosition="end"
                                    endIcon={<CheckIcon />}
                                >
                                    Valider
                                </LoadingButton>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Modal>
    );
}
