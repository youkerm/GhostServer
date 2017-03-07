"use strict";

process.title = 'ghost-server';

let Config = require('./Wrappers/Config');
let EventManager = require('./Managers/EventManager');

let webSocketServer = require('websocket').server;
let http = require('http');

let server = http.createServer(function(request, response) { /* Not important. We're writing WebSocket server, not HTTP server */ });

server.listen(Config.WEB_SOCKET.PORT, Config.WEB_SOCKET.HOST, function() {
    console.log((new Date()) + " Server is listening on " + Config.WEB_SOCKET.HOST + ":" + Config.WEB_SOCKET.PORT);
});

/* WebSocket server */
let wsServer = new webSocketServer({ httpServer: server });

let manager = new EventManager(wsServer, Config); // Where everything is managed
manager.run();