'use strict';

const db = {};

function ref() {
    return {
        update: (updateVal) => Promise.resolve(updateVal)
    }
}

db.ref = ref;
module.exports = db;