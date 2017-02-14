"use strict";

let Config = require('./Wrappers/Config');
let LocationManager = require('./Managers/LocationManager');

let webSocketServer = require('websocket').server;
let http = require('http');

let config = new Config();
let server = http.createServer(function(request, response) { /* Not important. We're writing WebSocket server, not HTTP server */ });

server.listen(config.getPort(), config.getHost(), function() {
    console.log((new Date()) + " Server is listening on " + config.getHost() + ":" + config.getPort());
});

/* WebSocket server */
let wsServer = new webSocketServer({ httpServer: server });

let locationManager = new LocationManager(wsServer, config); // Where everything is managed