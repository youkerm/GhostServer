/**
 * Created by mitch on 2/8/2017.
 */

function LocationManager(config) {
    this.config = config;

    this.locations = []; // list of currently open locations
    this.clients = []; // list of clients that haven't been assigned to a location
}

LocationManager.prototype.addClient = function(client) {
    this.clients.push(client);
}

