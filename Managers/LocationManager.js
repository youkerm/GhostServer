/**
 * Created by mitch on 2/8/2017.
 */

let Client = require('./Wrappers/Client');
let Database = require('./Wrappers/Database');

function LocationManager(wsServer, config) {
    this.config = config;
    this.database = new Database(config);

    this.manager_bounds = []; // Bounds of the locations of which this manager can create an instance
    this.locations = []; // list of currently open locations
    this.lobby_clients = []; // list of clients that haven't been assigned to a location

    // This callback function is called every time someone
    wsServer.on('request', function(request) {
        console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

        let connection = request.accept(null, request.origin);
        LocationManager.addConnection(connection);

    });
}

LocationManager.prototype.addConnection = function(connection) {
    if (connection != null) {
        let client = new Client(connection, this.lobby_clients, this.database, this.config);
        this.lobby_clients.push(client);
    }
};

module.exports = LocationManager;