"use strict";

let Config = require('./Wrappers/Config');
let EventManager = require('./Managers/EventManager');

let webSocketServer = require('websocket').server;
let http = require('http');

let config = new Config();
let server = http.createServer(function(request, response) { /* Not important. We're writing WebSocket server, not HTTP server */ });

server.listen(config.getPort(), config.getHost(), function() {
    console.log((new Date()) + " Server is listening on " + config.getHost() + ":" + config.getPort());
});

/* WebSocket server */
let wsServer = new webSocketServer({ httpServer: server });

let manager = new EventManager(wsServer, config); // Where everything is managed
manager.run();