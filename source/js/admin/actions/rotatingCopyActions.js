import rotatingCopyService from '../services/rotatingCopyService';

import {
    ROTATING_COPY_UPDATED
} from './types';

export const addRotatingCopy = (textVal, eventId) => dispatch => {
    rotatingCopyService.add(textVal, eventId).then(newItem => {
        dispatch({
            type: ROTATING_COPY_UPDATED,
            newItem: newItem,
            eventId
        })
    });
}