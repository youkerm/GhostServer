/**
 * Created by mitch on 2/7/2017.
 */

function Client(connection, config) {
    this.connection = connection;
    this.config = config;

    const Login = require('./Login');
    this.LoginManager = new Login(this.connection, this.config);

    if (this.history.length > 0) {
        this.connection.sendUTF(JSON.stringify({type: 'history', data: this.history}));
    }

    this.getEvents();
}


Client.prototype.getEvents = function() {
    var connection  = this.connection;
    var clients = this.clients;
    var history = this.history;
    var LoginManager = this.LoginManager;

    // user sent some message
    connection.on('message', function(message) {
        if (message.type === 'utf8') { // accept only text
            try {
                var json = JSON.parse(message.utf8Data);
            } catch (e) {
                console.log('This doesn\'t look like a valid JSON: ', message.utf8Data);
                return;
            }

            var type = json.type;
            var data = json.data;

            if (type === 'login') {
                LoginManager.login(data.username, data.password);
            } else {
                if (LoginManager.isLoggedIn()) {

                    if (type === 'post') {
                        console.log((new Date()) + ' Received Message from ' + LoginManager.getUsername() + ': ' + data);

                        // we want to keep history of all sent messages
                        var obj = {
                            time: (new Date()).getTime(),
                            text: data,
                            author: LoginManager.getUsername()
                        };
                        history.push(obj);
                        history = history.slice(-100);

                        // broadcast message to all connected clients
                        var json2 = JSON.stringify({type: 'message', data: obj});
                        for (var i = 0; i < clients.length; i++) {
                            clients[i].getConnection().sendUTF(json2);
                        }
                    }
                }
            }
        }
    });

    // user disconnected
    connection.on('close', function() {
        console.log((new Date()) + " User " + LoginManager.getUsername() + " disconnected.");
        this.LoginManager = null;
        var index = clients.indexOf(this);
        clients.splice(index, 1);
    });
}

Client.prototype.getConnection = function() {
    return this.connection;
}

Client.prototype.getLoginManager = function() {
    return this.LoginManager;
}

Client.prototype.changeLocation = function(clients, history) {
    this.clients = clients;
    this.history = history;

    //Sends to the client to drop all current feeds and update
    //this.connection.sendUTF(JSON.stringify({type: 'change_location'}));

    if (this.history.length > 0) {
        this.connection.sendUTF(JSON.stringify({type: 'history', data: this.history}));
    }
}

module.exports = Client;