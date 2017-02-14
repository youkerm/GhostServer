
/**
 * Created by mitch on 2/7/2017.
 */

function Location(config) {
    this.config = config;

    this.history = []; // latest 100 messages
    this.clients = []; // list of currently connected clients (users)
}

Location.prototype.addClient = function(client) {
    client.changeLocation(this.clients, this.history);
    this.clients.push(client);
}

Location.prototype.close = function() {
    this.clients = null;
    this.history = null;
}

