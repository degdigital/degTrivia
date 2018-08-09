import rotatingCopyService from '../services/rotatingCopyService';

export const addRotatingCopy = (textVal, eventId) => dispatch => {
    rotatingCopyService.addRotatingCopy(textVal, eventId);
}

export const editRotatingCopy = (itemId, newTextVal, eventId) => dispatch => {
    rotatingCopyService.editRotatingCopy(itemId, newTextVal, eventId);
}

export const deleteRotatingCopy = (itemId, eventId) => dispatch => {
    rotatingCopyService.deleteRotatingCopy(itemId, eventId)
}