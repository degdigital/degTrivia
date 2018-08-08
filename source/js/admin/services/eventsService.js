// takes FB structure and flattens it for component use
export function flattenEvent(eventObj) {
    const retVal = {};

    retVal.activeGameId = eventObj.activeGameId;
    retVal.alias = eventObj.alias;
    retVal.gameBetweenQuestionsCopyTitle = eventObj.betweenQuestionsCopy.title;
    retVal.gameBetweenQuestionsCopyDescription = eventObj.betweenQuestionsCopy.description;
    retVal.gameWaitBeforeQuestionsCopyTitle = eventObj.gameWaitBeforeQuestionsCopy.title;
    retVal.gameWaitBeforeQuestionsCopyDescription = eventObj.gameWaitBeforeQuestionsCopy.description;
    retVal.hashtag = eventObj.hashtag;
    retVal.leaderboardCopyDescription = eventObj.leaderboardCopy.description;
    retVal.name = eventObj.name;
    retVal.postgameResultsCopyDescription = eventObj.postgameResultsCopy.description;
    retVal.registrationCopyTitle = eventObj.registrationCopy.title;
    retVal.registrationCopyDisclosure = eventObj.registrationCopy.disclosure;

    return retVal;
}