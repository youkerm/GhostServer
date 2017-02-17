/**
 * Created by mitch on 2/7/2017.
 */

function Client(connection, eventManager, config) {
    /* Bindings */
    this.connection = connection;
    this.config = config;
    this.eventManager = eventManager;

    /* Class used variables */
    this.isLogin = false;
    this.location = false;

    /* Handles when an event is triggered */
    this.getEvents();
}

Client.prototype.getLocation = function() {
    return this.location;
};

Client.prototype.setLocation = function(loc) {
    this.location = loc;
};

Client.prototype.getEvents = function() {
    let EventManager = this.eventManager;
    let LoginManager = this.eventManager.getLoginManager();
    let Database = EventManager.getDatabase();

    let connection  = this.connection;
    let location = this.location;

    let self = this;
    // user sent some message
    connection.on('message', function(message) {
        if (message.type === 'utf8') { // accept only text
            try {
                var json = JSON.parse(message.utf8Data);
            } catch (e) {
                console.log('This doesn\'t look like a valid JSON: ', message.utf8Data);
                return;
            }

            let type = json.type;
            let data = json.data;

            if (type === 'login') {
                if (!this.isLogin) {
                    this.isLogin = LoginManager.login(connection, data.username, data.password);
                }
                if (this.isLogin) {
                    this.username = data.username;
                    LoginManager.changeLocation(self, EventManager, data.lat, data.lng);
                }
            } else {
                if (this.isLogin) {

                    if (type === 'post') {
                        // we want to keep history of all sent messages
                        let obj = {
                            time: (new Date()).getTime(),
                            text: data,
                            author: this.username
                        };

                        self.getLocation().history.push(obj);
                        self.getLocation().history = self.getLocation().history.slice(-100);

                        // broadcast message to all connected clients
                        let json2 = JSON.stringify({type: 'message', data: obj});
                        for (let i = 0; i < self.getLocation().clients.length; i++) {
                            self.getLocation().clients[i].connection.sendUTF(json2);
                        }

                        console.log((new Date()) + ' Received Message from ' + this.username + ': ' + data);
                    }
                }
            }
        }
    });

    // user disconnected
    connection.on('close', function() {
        console.log((new Date()) + " User " + this.username + " disconnected.");
        if (!this.location) { // User in lobby
            EventManager.deleteClient(this);
        } else { // User in location
            this.getLocation().deleteClient(this);
        }
    });
};

module.exports = Client;