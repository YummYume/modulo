<?php

namespace App\Enum;

use App\Enum\Traits\UtilsTrait;

enum Feature: string
{
    use UtilsTrait;

    case EVENT_CRUD = 'event_crud';
    case EDIT_THIRD_PARTY_EVENT = 'edit_third_party_event';
    case EDIT_CHILD_EVENT = 'edit_child_event';
    case DELETE_THIRD_PARTY_EVENT = 'delete_third_party_event';
    case DELETE_CHILD_EVENT = 'delete_child_event';
    case CUSTOMIZE_GUEST_FUNCTIONS = 'customize_guest_functions';
    case NOMINATIVE_INVITATIONS = 'nominative_invitations';
    case CUSTOMIZE_EVENT_VISIBILITY = 'customize_event_visibility';
    case AGENDA_ACCESS = 'agenda_access';
    case SEE_CHILD_EVENTS = 'see_child_events';
}
