const viewEvent = "EVENT_VIEW";
const addEvent = "EVENT_ADD";
const editEvent = "EVENT_EDIT";
const deleteEvent = "EVENT_DELETE";
const addParticipants = "EVENT_ADD_PARTICIPANTS";
const addRoles = "EVENT_ADD_ROLES";
const setVisibility = "EVENT_SET_VISIBILITY";

const eventCrud = "event_crud";
const editThirdPartyEvent = "edit_third_party_event";
const editChildEvent = "edit_child_event";
const deleteThirdPartyEvent = "delete_third_party_event";
const deleteChildEvent = "delete_child_event";
const customizeGuestFunctions = "customize_guest_functions";
const nominativeInvitations = "nominative_invitations";
const customizeEventVisibility = "customize_event_visibility";
const agendaAccess = "agenda_access";
const seeChildEvents = "see_child_events";

const publicAccess = "public_access";
const restrictedAccess = "restricted_access";
const privateAccess = "private_access";

// Can the user view an event?
const canView = (event, user) => {
    // The scope currently used by the user
    let scope = user.currentScope;

    // If no access to the agenda, or the event isn't active, then no access to the event
    if (!event.active || !hasFeature(scope, agendaAccess)) {
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
        if (event.scope.structure.parentStructure === scope.structure && !hasFeature(scope, seeChildEvents)) {
            return false;
        }

        // If the visibility is public, then the user can view the event
        // If the visibility is restricted, then the user can view the event if he is part of the participants or is the creator
        // If the visibility is private, then the user can view the event if he is the creator
        switch (event.visibility) {
            case publicAccess:
                return true;
            case restrictedAccess:
                return event.createdBy === user || event.users.includes(user) || event.scope.structure === scope.structure;
            case privateAccess:
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
    if (!hasFeature(scope, agendaAccess)) {
        return false;
    }

    // Can add an event if access to the agenda and if permission to add events
    return hasFeature(scope, eventCrud);
};

// Can the user edit an event?
const canEdit = (event, user) => {
    // The scope currently used by the user
    let scope = user.currentScope;

    // If no access to the agenda, then impossible to edit an event
    if (!hasFeature(scope, agendaAccess)) {
        return false;
    }

    // If is creator of the event, then the user can edit the event if granted
    if (event.createdBy === user) {
        return hasFeature(scope, eventCrud);
    }

    // If same structure, then the user can edit the event if granted
    if (event.scope.structure === scope.structure) {
        return hasFeature(scope, editThirdPartyEvent);
    }

    // If child structure, then the user can edit the event if granted
    if (scope.structure.childStructures.includes(event.scope.structure)) {
        return hasFeature(scope, editChildEvent);
    }

    // Return false by default
    return false;
};

// Can the user delete an event?
const canDelete = (event, user) => {
    // The scope currently used by the user
    let scope = user.currentScope;

    // If no access to the agenda, then impossible to delete an event
    if (!hasFeature(scope, agendaAccess)) {
        return false;
    }

    // If is creator of the event, then the user can delete the event if granted
    if (event.createdBy === user) {
        return hasFeature(scope, eventCrud);
    }

    // If same structure, then the user can delete the event if granted
    if (event.scope.structure === scope.structure) {
        return hasFeature(scope, deleteThirdPartyEvent);
    }

    // If child structure, then the user can delete the event if granted
    if (scope.structure.childStructures.includes(event.scope.structure)) {
        return hasFeature(scope, deleteChildEvent);
    }

    // Return false by default
    return false;
};

// Can the user add participants to an event?
const canAddParticipants = (user) => {
    // The scope currently used by the user
    let scope = user.currentScope;

    // If no access to the agenda, then impossible to add participants to an event
    if (!hasFeature(scope, agendaAccess)) {
        return false;
    }

    return hasFeature(scope, nominativeInvitations);
};

// Can the user add roles to an event?
const canAddRoles = (user) => {
    // The scope currently used by the user
    let scope = user.currentScope;

    // If no access to the agenda, then impossible to add roles to an event
    if (!hasFeature(scope, agendaAccess)) {
        return false;
    }

    return hasFeature(scope, customizeGuestFunctions);
};

// Can the user change the visibility of an event?
const canSetVisibility = (event, user) => {
    // The scope currently used by the user
    let scope = user.currentScope;

    // If no access to the agenda, then impossible to change the visibility of an event
    if (!hasFeature(scope, agendaAccess)) {
        return false;
    }

    return hasFeature(scope, customizeEventVisibility || event.createdBy === user);
};

const hasFeature = (scope, feature) => {
    return scope.role.features.includes(feature);
};
