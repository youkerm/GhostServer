/**
 * Created by mitch on 2/14/2017.
 */

function Database(config) {
    let pgp = require('pg-promise')(options);
    let connectionString = 'postgres://' + config.getDBHost() + ':' + config.getDBPort() + '/' + config.getDBUsername();

    this.db = pgp(connectionString);
}

Database.prototype.getDB = function() {
    return this.db;
};

module.exports = Database;