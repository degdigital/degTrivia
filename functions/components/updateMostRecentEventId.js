module.exports = function(db, change, context) {
    const nextVal = change.after.val();

    if (nextVal) {
        return db.ref().update({
            mostRecentEvent: nextVal
        })
    }
    return Promise.resolve();
}