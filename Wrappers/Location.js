
/**
 * Created by mitch on 2/7/2017.
 */

function Location(id, eventManager, Config) {
    this.id = id;
    this.eventManager = eventManager;
    this.Config = Config;

    this.history = []; // latest 100 messages
    this.clients = []; // list of currently connected clients (users)

    this.loadHistory();
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

    client = null;

    if (this.clients.length == 0) {
        this.eventManager.deleteLocation(this);
    }
};

Location.prototype.loadHistory = function() {
    let Database =  this.eventManager.getDatabase();
    let getHistory = 'SELECT * FROM ghost.posts_by_location WHERE location_id = ? LIMIT 100';
    let params = [this.id];
    let self = this;

    Database.Social_NoSQL_DB().execute(getHistory, params, { prepare: true }, function (err, result) {
        if (err != null) {
            console.log(err);
        } else {
            for (let i = result.rows.length-1; i >= 0; i--) {
                let row = result.rows[i];

                console.log(row.message);

                let obj = {
                    time: row.created,
                    text: row.message,
                    author: row.profile_name
                };

                for (let c = 0; c < self.clients.length; c++) {
                    let client = self.clients[c];
                    let json = JSON.stringify({type: 'message', data: obj});
                    client.connection.sendUTF(json);
                }

                self.history.push(obj);
            }
        }
    });
};

Location.prototype.close = function() {
    this.clients = null;
    this.history = null;

    // Remove location from locations list
    this.eventManager.deleteLocation(this);
};

module.exports = Location;

