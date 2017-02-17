
/**
 * Created by mitch on 2/7/2017.
 */

function Location(id, eventManager, config) {
    this.id = id;
    this.eventManager = eventManager;
    this.config = config;

    this.history = []; // latest 100 messages
    this.clients = []; // list of currently connected clients (users)
}

Location.prototype.getID = function() {
    return this.id;
};

Location.prototype.addClient = function(client) {
    this.clients.push(client);
};

Location.prototype.deleteClient = function(client) {
    let index = this.clients.indexOf(client);
    if (index != -1) {
        this.clients.splice(index, 1);
    }
};

Location.prototype.getHistory = function() {
    return this.history;
};

Location.prototype.close = function() {
    this.clients = null;
    this.history = null;

    // Remove location from locations list
    let index = this.eventManager.locations.indexOf(this);
    if (index > 0) {
        this.eventManager.locations.splice(index, 1);
    }
};

module.exports = Location;

