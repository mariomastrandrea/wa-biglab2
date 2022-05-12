const sqlite3 = require("sqlite3");

const database=(function() {
    let instance;

    return {
        getInstance: function() {
            if(!instance) {
                instance = new sqlite3.Database("../films.db");
            }
            return instance;
        }
    };
})();

module.exports = database;