/**
 * Created by mitch on 2/14/2017.
 */

function Database(Config) {
    let cassandra = require('cassandra-driver');
    let promise = require('bluebird');
    let options = { promiseLib: promise };
    let pgp = require('pg-promise')(options);

    let locationConnection = 'postgres://' + Config.LOCATION_DB.USERNAME + ':' + Config.LOCATION_DB.PASSWORD + '@' + Config.LOCATION_DB.HOST + ':' + Config.LOCATION_DB.PORT + '/' + Config.LOCATION_DB.DATABASE;
    let userConnection = 'postgres://' + Config.USER_DB.USERNAME + ':' + Config.USER_DB.PASSWORD + '@' + Config.USER_DB.HOST + ':' + Config.USER_DB.PORT + '/' + Config.USER_DB.DATABASE;
    let socialConnectionSQL = 'postgres://' + Config.SOCIAL_SQL_DB.USERNAME + ':' + Config.SOCIAL_SQL_DB.PASSWORD + '@' + Config.SOCIAL_SQL_DB.HOST + ':' + Config.SOCIAL_SQL_DB.PORT + '/' + Config.SOCIAL_SQL_DB.DATABASE;

    this.locationDB = pgp(locationConnection);
    this.userDB = pgp(userConnection);
    this.socialDBSQL = pgp(socialConnectionSQL);

    this.preparedStatment = require('pg-promise').PreparedStatement;

    this.socialDBNoSQL = new cassandra.Client({ contactPoints: [Config.SOCIAL_NoSQL_DB.HOST] });
    this.socialDBNoSQL.connect(function (err) {
        if (err == null) {
            console.log('Connected to Cassandra Cluster');
        } else {
            console.log(err);
        }
    });
}

Database.prototype.Location_DB = function() {
    return this.locationDB;
};

Database.prototype.User_DB = function() {
    return this.userDB;
};

Database.prototype.Social_SQL_DB = function() {
    return this.socialDBSQL;
};

Database.prototype.Social_NoSQL_DB = function() {
    return this.socialDBNoSQL;
};

module.exports = Database;