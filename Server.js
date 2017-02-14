"use strict";

var Client = require('./Wrappers/Client');
var Config = require('./Wrappers/Config.js');

var webSocketServer = require('websocket').server;
var http = require('http');

var history = []; // latest 100 messages
var clients = []; // list of currently connected clients (users)

var config = new Config();
var server = http.createServer(function(request, response) { /* Not important. We're writing WebSocket server, not HTTP server */ });

server.listen(config.getWebSocketPort(), function() {
    console.log((new Date()) + " Server is listening on port " + config.getWebSocketPort());
});

/* WebSocket server */
var wsServer = new webSocketServer({ httpServer: server });


// This callback function is called every time someone
wsServer.on('request', function(request) {
    console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

    var connection = request.accept(null, request.origin);

    if (connection != null) {
        var client = new Client(connection, clients, history, config);
        clients.push(client);
    }

});