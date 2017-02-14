/**
 * Created by mitch on 2/7/2017.
 */

function Client(connection, clients, database, config) {
    this.connection = connection;
    this.clients = clients;
    this.database = database;
    this.config = config;

    const Login = require('./Login');
    this.LoginManager = new Login(this.connection, this.config);

    if (this.history.length > 0) {
        this.connection.sendUTF(JSON.stringify({type: 'history', data: this.history}));
    }

    this.getEvents();
}


Client.prototype.getEvents = function() {
    let connection  = this.connection;
    let clients = this.clients;
    let history = this.history;
    let LoginManager = this.LoginManager;

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
                LoginManager.login(data.username, data.password, data.lat, data.lng);
            } else {
                if (LoginManager.isLoggedIn()) {

                    if (type === 'post') {
                        console.log((new Date()) + ' Received Message from ' + LoginManager.getUsername() + ': ' + data);

                        // we want to keep history of all sent messages
                        let obj = {
                            time: (new Date()).getTime(),
                            text: data,
                            author: LoginManager.getUsername()
                        };
                        history.push(obj);
                        history = history.slice(-100);

                        // broadcast message to all connected clients
                        let json2 = JSON.stringify({type: 'message', data: obj});
                        for (let i = 0; i < clients.length; i++) {
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
        let index = clients.indexOf(this);
        clients.splice(index, 1);
    });
};

Client.prototype.getConnection = function() {
    return this.connection;
};

Client.prototype.getLoginManager = function() {
    return this.LoginManager;
};

Client.prototype.changeLocation = function(clients, history) {
    this.clients = clients;
    this.history = history;

    //Sends to the client to drop all current feeds and update
    //this.connection.sendUTF(JSON.stringify({type: 'change_location'}));

    if (this.history.length > 0) {
        this.connection.sendUTF(JSON.stringify({type: 'history', data: this.history}));
    }
};

module.exports = Client;