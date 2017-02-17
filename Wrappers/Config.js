/**
 * Created by mitch on 2/7/2017.
 */

"use strict";

function Config() {
    this.DEV_MODE = true;

    this.PORT = 447;
    this.HOST = 'localhost';

    this.DB_HOST = '72.90.86.178';
    this.DB_PORT = 5432;
    this.DB_USER = 'postgres';
    this.DB_PASS = 'halfmoon';
    this.DB_DATABASE = 'ghost';

    process.title = 'ghost-server';
}

Config.prototype.inDevMode = function() {
    return this.DEV_MODE;
};

Config.prototype.getPort = function() {
    return this.PORT;
};

Config.prototype.getHost = function() {
    return this.HOST;
};

Config.prototype.getDBPort = function() {
    return this.DB_PORT;
};

Config.prototype.getDBHost = function() {
    return this.DB_HOST;
};

Config.prototype.getDBUsername = function() {
    return this.DB_USER;
};

Config.prototype.getDBPassword = function() {
    return this.DB_PASS;
};

Config.prototype.getDBDatabase = function() {
    return this.DB_DATABASE;
};

module.exports = Config;