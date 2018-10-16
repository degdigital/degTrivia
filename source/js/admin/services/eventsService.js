import dbService from '../../services/dbService.js';

// takes FB structure and flattens it for component use
export function flattenEvent(eventObj) {
    const retVal = {};
    retVal.id = eventObj.id;

    retVal.activeGameId = eventObj.activeGameId;
    retVal.alias = eventObj.alias;
    retVal.gameBetweenQuestionsCopyTitle = eventObj.betweenQuestionsCopy.title;
    retVal.gameBetweenQuestionsCopyDescription = eventObj.betweenQuestionsCopy.description;
    retVal.gameWaitBeforeQuestionsCopyTitle = eventObj.gameWaitBeforeQuestionsCopy.title;
    retVal.gameWaitBeforeQuestionsCopyDescription = eventObj.gameWaitBeforeQuestionsCopy.description;
    retVal.games = eventObj.games;
    retVal.hashtag = eventObj.hashtag;
    retVal.leaderboardCopyDescription = eventObj.leaderboardCopy.description;
    retVal.name = eventObj.name;
    retVal.postgameResultsCopyDescription = eventObj.postgameResultsCopy.description;
    retVal.registrationCopyTitle = eventObj.registrationCopy.title;
    retVal.registrationCopyDisclosure = eventObj.registrationCopy.disclosure;
    retVal.url = eventObj.url;

    return retVal;
}

// takes form vals and returns an object with fb structure
export function buildEventObject(formVals) {
    const retVal = {};

    retVal.activeGameId = formVals.activeGameId || false;
    retVal.alias = formVals.alias.toLowerCase();
    retVal.betweenQuestionsCopy = {
        title: formVals.gameBetweenQuestionsCopyTitle,
        description: formVals.gameBetweenQuestionsCopyDescription
    };
    retVal.gameWaitBeforeQuestionsCopy = {
        title: formVals.gameWaitBeforeQuestionsCopyTitle,
        description: formVals.gameWaitBeforeQuestionsCopyDescription
    };
    retVal.games = formVals.games || false;
    retVal.hashtag = formVals.hashtag;
    retVal.leaderboardCopy = {
        description: formVals.leaderboardCopyDescription
    };
    retVal.name = formVals.name;
    retVal.postgameResultsCopy = {
        description: formVals.postgameResultsCopyDescription
    };
    retVal.registrationCopy = {
        title: formVals.registrationCopyTitle,
        disclosure: formVals.registrationCopyDisclosure
    };
    retVal.url = formVals.url;

    return retVal;
}

export function saveEvent(eventObj, eventId) {
    const ref = dbService.getDb().ref('events');
    const key = eventId || ref.push().key;

    ref.update({
        [key]: eventObj
    });
}