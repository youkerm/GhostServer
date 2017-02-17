/**
 * Created by mitch on 2/14/2017.
 */

function Database(config) {
    let promise = require('bluebird');
    let options = { promiseLib: promise };

    let pgp = require('pg-promise')(options);
    let connectionString = 'postgres://' + config.getDBUsername() + ':' + config.getDBPassword() + '@' + config.getDBHost() + ':' + config.getDBPort() + '/' + config.getDBDatabase();



    this.db = pgp(connectionString);
    this.ps = require('pg-promise').PreparedStatement;
}

Database.prototype.getDB = function() {
    return this.db;
};

Database.prototype.PS = function () {
    return this.ps;
};

module.exports = Database;