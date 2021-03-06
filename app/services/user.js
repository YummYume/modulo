export const features = {
    EVENT_CRUD: "EVENT_CRUD",
    EDIT_THIRD_PARTY_EVENT: "EDIT_THIRD_PARTY_EVENT",
    EDIT_CHILD_EVENT: "EDIT_CHILD_EVENT",
    DELETE_THIRD_PARTY_EVENT: "DELETE_THIRD_PARTY_EVENT",
    DELETE_CHILD_EVENT: "DELETE_CHILD_EVENT",
    CUSTOMIZE_GUEST_FUNCTIONS: "CUSTOMIZE_GUEST_FUNCTIONS",
    NOMINATIVE_INVITATIONS: "NOMINATIVE_INVITATIONS",
    CUSTOMIZE_EVENT_VISIBILITY: "CUSTOMIZE_EVENT_VISIBILITY",
    AGENDA_ACCESS: "AGENDA_ACCESS",
    SEE_CHILD_EVENTS: "SEE_CHILD_EVENTS"
};

export const roles = {
    ROLE_USER: "ROLE_USER",
    ROLE_ADMIN: "ROLE_ADMIN",
    ROLE_SUPER_ADMIN: "ROLE_SUPER_ADMIN"
};

export const isGranted = (permission, user) => {
    const currentScope = user?.currentScope;

    if (!currentScope || !features.hasOwnProperty(permission)) {
        return false;
    }

    return currentScope.role?.features ? Object.values(currentScope.role.features).includes(permission) : false;
};

export const adminRoles = () => [roles.ROLE_ADMIN, roles.ROLE_SUPER_ADMIN];
