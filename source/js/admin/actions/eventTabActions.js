import {saveEvent} from '../services/eventsService';

export const saveEventChanges = (eventObject, eventId) => dispatch => {
    saveEvent(eventObject, eventId);
}