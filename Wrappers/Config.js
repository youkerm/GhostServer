/**
 * Created by mitch on 2/7/2017.
 */

"use strict";

function Config() {
    this.DEV_MODE = true;

    this.WS_PORT = 447;
    process.title = 'ghost-server';
}

Config.prototype.inDevMode = function() {
    return this.DEV_MODE;
}

Config.prototype.getWebSocketPort = function() {
    return this.WS_PORT;
}

module.exports = Config;