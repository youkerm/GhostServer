/**
 * Created by mitch on 2/8/2017.
 */

let Client = require('../Wrappers/Client');
let Location = require('../Wrappers/Location');
let Database = require('../Wrappers/Database');
let Login = require('../Wrappers/Login');

function EventManager(ws, config) {
    this.ws = ws;
    this.config = config;
    this.database = new Database(config);

//                            SW.lng,    SW.lat,      NE.lng,      NE.lat
    this.manager_bounds = [ -170.704466, 14.819484, -66.949822605, 71.706221 ]; // Bounds of the locations of which this manager can create an instance

    this.locations = []; // list of currently open locations
    this.lobby_clients = []; // list of clients that haven't been assigned to a location
    this.loginManager = new Login(this.database, config);
}

EventManager.prototype.run = function() {
    let self = this;

    // This callback function is called every time a clients connects
    this.ws.on('request', function(request) {
        console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

        let connection = request.accept(null, request.origin);
        self.addClient(connection);
    });
};


/* Adds a client to lobby waiting to login and change to location */
EventManager.prototype.addClient = function(connection) {
    if (connection != null) {
        let client = new Client(connection, this, this.config);
        this.lobby_clients.push(client);
    }
};

/* Deletes a client from the lobby
 * NOTE: this is to be used when the user disconnects while in the lobby */
EventManager.prototype.deleteClient = function(client) {
    let index = this.lobby_clients.indexOf(client);
    if (index > 0) {
        this.lobby_clients.splice(index, 1);
    }
};

EventManager.prototype.getLoginManager = function() {
    return this.loginManager;
};

EventManager.prototype.getDatabase = function() {
    return this.database;
};

/* Find the location in the list of open locations */
EventManager.prototype.findLocation = function(locationID) {
    for (let i = 0; i < this.locations.length; i++) {
        if (this.locations[i].getID() == locationID) {
            return this.locations[i];
        }
    }
    return false;
};

EventManager.prototype.spawnLocation = function(locationID, client) {
    let bounds = this.manager_bounds;
    let findLocation = new this.database.ps('spawn-location', 'SELECT location_id FROM locations WHERE location_id = $5 AND bounds @ ST_MakeEnvelope($1, $2, $3, $4, 4326);', [bounds[0], bounds[1], bounds[2], bounds[3], locationID]); // Creating a prepare

    //console.log('SELECT location_id FROM locations WHERE location_id = \'' + locationID + '\' AND bounds @ ST_MakeEnvelope(' + bounds[0] + ', ' + bounds[1] + ', ' + bounds[2] + ', ' + bounds[3] + ', 4326);');

    self = this;
    this.database.getDB().one(findLocation)
        .then(function(data) {
            let location = new Location(locationID, self, self.config);
            self.locations.push(location);

            /* Removes the client from the old location */
            if (!client.location) { // If in lobby
                self.deleteClient(client);
            } else {
                let oldLocation = client.location;
                oldLocation.deleteClient(client);
            }

            client.setLocation(location);
            location.addClient(client);

            /* Sends chat history to client */
            if (location.history.length > 0) {
                client.connection.sendUTF(JSON.stringify({type: 'history', data: location.history}));
            }

        })
        .catch(error => {
            console.log(error);
            console.log('Could not spawn location.');
        });
};


EventManager.prototype.changeLocation = function(client, locationID) {
    /* Find location or create the location if possible. */
    let location = this.findLocation(locationID);

    /* Adds client to the new location */
    if (location != false) {
        console.log('here');

        /* Removes the client from the old location */
        if (!client.location) { // If in lobby
            this.deleteClient(client);
        } else {
            let oldLocation = client.location;
            oldLocation.deleteClient(client);
        }

        client.setLocation(location);
        location.addClient(client);

        /* Sends chat history to client */
        if (location.history.length > 0) {
            client.connection.sendUTF(JSON.stringify({type: 'history', data: location.history}));
        }
    } else  {
        this.spawnLocation(locationID, client); // Location not found; Create location if possible
    }
};

module.exports = EventManager;