import { features } from "./user";

export const attributes = {
    VIEW: "EVENT_VIEW",
    ADD: "EVENT_ADD",
    EDIT: "EVENT_EDIT",
    DELETE: "EVENT_DELETE",
    ADD_PARTICIPANTS: "EVENT_ADD_PARTICIPANTS",
    ADD_ROLES: "EVENT_ADD_ROLES",
    SET_VISIBILITY: "EVENT_SET_VISIBILITY"
};

export const accessTypes = {
    PUBLIC_ACCESS: "public_access",
    RESTRICTED_ACCESS: "restricted_access",
    PRIVATE_ACCESS: "private_access"
};

export const isGrantedEvent = (permission, user, event) => {
    switch (permission) {
        case attributes.VIEW:
            return canView(user, event);
        case attributes.ADD:
            return canAdd(user);
        case attributes.EDIT:
            return canEdit(user, event);
        case attributes.DELETE:
            return canDelete(user, event);
        case attributes.ADD_PARTICIPANTS:
            return canAddParticipants(user);
        case attributes.ADD_ROLES:
            return canAddRoles(user);
        case attributes.SET_VISIBILITY:
            return canSetVisibility(user, event);
        default:
            return false;
    }
};

// Can the user view an event?
const canView = (user, event) => {
    // The scope currently used by the user
    let scope = user.currentScope;

    // If no access to the agenda, or the event isn't active, then no access to the event
    if (!event.active || !hasFeature(scope, features.AGENDA_ACCESS)) {
        return false;
    }

    // If the user created the event, or has the same structure as the event, or is part of the participants
    if (
        event.createdBy === user ||
        event.scope.structure === scope.structure ||
        event.users.includes(user) ||
        event.scope.structure.parentStructure === scope.structure ||
        event.scope.structure.childStructures.includes(scope.structure)
    ) {
        // If the event is a child structure but the scope cannot see child events, then no access
        if (event.scope.structure.parentStructure === scope.structure && !hasFeature(scope, features.SEE_CHILD_EVENTS)) {
            return false;
        }

        // If the visibility is public, then the user can view the event
        // If the visibility is restricted, then the user can view the event if he is part of the participants or is the creator
        // If the visibility is private, then the user can view the event if he is the creator
        switch (event.visibility) {
            case accessTypes.PUBLIC_ACCESS:
                return true;
            case accessTypes.RESTRICTED_ACCESS:
                return event.createdBy === user || event.users.includes(user) || event.scope.structure === scope.structure;
            case accessTypes.PRIVATE_ACCESS:
                return event.createdBy === user;
            default:
                return false;
        }
    }

    return false;
};

// Can the user add an event?
const canAdd = (user) => {
    // The scope currently used by the user
    let scope = user.currentScope;

    // If no access to the agenda, then impossible to add an event
    if (!hasFeature(scope, features.AGENDA_ACCESS)) {
        return false;
    }

    // Can add an event if access to the agenda and if permission to add events
    return hasFeature(scope, features.EVENT_CRUD);
};

// Can the user edit an event?
const canEdit = (user, event) => {
    // The scope currently used by the user
    let scope = user.currentScope;

    // If no access to the agenda, then impossible to edit an event
    if (!hasFeature(scope, features.AGENDA_ACCESS)) {
        return false;
    }

    // If is creator of the event, then the user can edit the event if granted
    if (event.createdBy === user) {
        return hasFeature(scope, features.EVENT_CRUD);
    }

    // If same structure, then the user can edit the event if granted
    if (event.scope.structure === scope.structure) {
        return hasFeature(scope, features.EDIT_THIRD_PARTY_EVENT);
    }

    // If child structure, then the user can edit the event if granted
    if (scope.structure.childStructures.includes(event.scope.structure)) {
        return hasFeature(scope, features.EDIT_CHILD_EVENT);
    }

    // Return false by default
    return false;
};

// Can the user delete an event?
const canDelete = (user, event) => {
    // The scope currently used by the user
    let scope = user.currentScope;

    // If no access to the agenda, then impossible to delete an event
    if (!hasFeature(scope, features.AGENDA_ACCESS)) {
        return false;
    }

    // If is creator of the event, then the user can delete the event if granted
    if (event.createdBy === user) {
        return hasFeature(scope, features.EVENT_CRUD);
    }

    // If same structure, then the user can delete the event if granted
    if (event.scope.structure === scope.structure) {
        return hasFeature(scope, features.DELETE_THIRD_PARTY_EVENT);
    }

    // If child structure, then the user can delete the event if granted
    if (scope.structure.childStructures.includes(event.scope.structure)) {
        return hasFeature(scope, features.DELETE_CHILD_EVENT);
    }

    // Return false by default
    return false;
};

// Can the user add participants to an event?
const canAddParticipants = (user) => {
    // The scope currently used by the user
    let scope = user.currentScope;

    // If no access to the agenda, then impossible to add participants to an event
    if (!hasFeature(scope, features.AGENDA_ACCESS)) {
        return false;
    }

    return hasFeature(scope, features.NOMINATIVE_INVITATIONS);
};

// Can the user add roles to an event?
const canAddRoles = (user) => {
    // The scope currently used by the user
    let scope = user.currentScope;

    // If no access to the agenda, then impossible to add roles to an event
    if (!hasFeature(scope, features.AGENDA_ACCESS)) {
        return false;
    }

    return hasFeature(scope, features.CUSTOMIZE_GUEST_FUNCTIONS);
};

// Can the user change the visibility of an event?
const canSetVisibility = (user, event) => {
    // The scope currently used by the user
    let scope = user.currentScope;

    // If no access to the agenda, then impossible to change the visibility of an event
    if (!hasFeature(scope, features.AGENDA_ACCESS)) {
        return false;
    }

    return hasFeature(scope, features.CUSTOMIZE_EVENT_VISIBILITY || event.createdBy === user);
};

const hasFeature = (scope, feature) => {
    return scope.role.features.includes(feature);
};
