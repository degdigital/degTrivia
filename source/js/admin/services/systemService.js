import dbService from '../../services/dbService.js';

function disableApplication() {
    dbService.getDb().ref().update({
        disableAll: true,
        resetApp: false
    });
}

function resetApplication() {
    dbService.getDb().ref().update({
        resetApp: true,
        disableAll: false
    });
}

function updateQuestionDuration(newTime) {
    dbService.getDb().ref().update({
        questionDuration: newTime
    });
}

export default {
    disableApplication,
    resetApplication,
    updateQuestionDuration
};