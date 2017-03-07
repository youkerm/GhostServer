/**
 * Created by mitch on 2/7/2017.
 */

function Client(connection, eventManager, Config) {
    /* Bindings */
    this.connection = connection;
    this.Config = Config;
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
    let LoginManager = this.eventManager.getLoginManager();
    let Database = this.eventManager.getDatabase();

    let connection  = this.connection;

    let self = this;
    // user sent some message
    connection.on('message', function(message) {
        if (message.type === 'utf8') { // accept only text
            try {
                let json = JSON.parse(message.utf8Data);
            } catch (e) {
                console.log('This doesn\'t look like a valid JSON: ', message.utf8Data);
                return;
            }

            let type = json.type;
            let data = json.data;

            if (type === 'login') {
                if (!self.isLogin) {
                    LoginManager.login(self, data.email, data.facebook_key, data.lat, data.lng);
                }
            } else {
                if (self.isLogin) {

                    if (type === 'post') {
                        // we want to keep history of all sent messages
                        let uuid = require('uuid4');
                        let postID = uuid();
                        let locationID = self.getLocation().getID();
                        let profileID = '94d56c0b-9fec-4604-9588-202997cf586b';

                        let insertLocation = 'INSERT INTO ghost.posts_by_location (post_id, location_id, profile_id, profile_pic, profile_name, message, created) VALUES (?, ?, ?, ?, ?, ?, dateof(now()))';
                        let locationParams = [postID, locationID, profileID, '', self.firstName + ' ' + self.lastName, data];
                        let params = [postID, locationID, profileID, data];
                        Database.Social_NoSQL_DB().execute(insertLocation, locationParams, { prepare: true }, function (err) {
                            if (err != null) {
                                console.log(err);
                            } else {
                                let obj = {
                                    time: (new Date()).getTime(),
                                    text: data,
                                    author: self.firstName + ' ' + self.lastName
                                };

                                self.getLocation().history.push(obj);
                                self.getLocation().history = self.getLocation().history.slice(-100);

                                // broadcast message to all connected clients
                                let json2 = JSON.stringify({type: 'message', data: obj});
                                for (let i = 0; i < self.getLocation().clients.length; i++) {
                                    self.getLocation().clients[i].connection.sendUTF(json2);
                                }
                            }
                        });

                        let insertProfile = 'INSERT INTO ghost.posts_by_profile (post_id, location_id, profile_id, message, created) VALUES (?, ?, ?, ?, dateof(now()))';
                        Database.Social_NoSQL_DB().execute(insertProfile, params, { prepare: true }, function (err) {
                            if (err != null) {
                                // console.log(err);
                            }
                        });

                        let insertPost = 'INSERT INTO ghost.posts_by_id (post_id, location_id, profile_id, message, created) VALUES (?, ?, ?, ?, dateof(now())))';
                        Database.Social_NoSQL_DB().execute(insertPost, params, { prepare: true }, function (err) {
                            if (err != null) {
                                // console.log(err);
                            }
                        });
                    }
                }
            }
        }
    });

    // user disconnected
    connection.on('close', function() {
        self.disconnect();
    });
};

Client.prototype.disconnect = function() {
    if (!this.getLocation()) { // User in lobby
        this.eventManager.deleteClient(this);
    } else {
        this.getLocation().deleteClient(this);
    }
    console.log((new Date()) + " User " + this.first_name + " " + this.last_name + " disconnected.");
};

module.exports = Client;