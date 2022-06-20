export const features = {
    EVENT_CRUD: "event_crud",
    EDIT_THIRD_PARTY_EVENT: "edit_third_party_event",
    EDIT_CHILD_EVENT: "edit_child_event",
    DELETE_THIRD_PARTY_EVENT: "delete_third_party_event",
    DELETE_CHILD_EVENT: "delete_child_event",
    CUSTOMIZE_GUEST_FUNCTIONS: "customize_guest_functions",
    NOMINATIVE_INVITATIONS: "nominative_invitations",
    CUSTOMIZE_EVENT_VISIBILITY: "customize_event_visibility",
    AGENDA_ACCESS: "agenda_access",
    SEE_CHILD_EVENTS: "see_child_events"
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

    return currentScope.role?.features?.includes(permission);
};

export const adminRoles = () => [roles.ROLE_ADMIN, roles.ROLE_SUPER_ADMIN];
