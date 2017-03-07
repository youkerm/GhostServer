/**
 * Created by mitch on 2/7/2017.
 */

function Login(database, EventManager, Config) {
    this.database = database;
    this.EventManager = EventManager;
    this.Config = Config;
}

Login.prototype.login = function(client, email, facebook_key, lat, lng) {

    let self = this;
    if (this.Config.DEV_MODE) {
        client.isLogin = true;
        client.firstName = 'Tester';
        client.lastName = '';

        client.connection.sendUTF(JSON.stringify({ type:'login_response', data: { response: 'success', user_id: userID, first_name: firstName, last_name: lastName }}));
        self.changeLocation(client, lat, lng);
    } else {
        if (this.validInput(email) && this.validInput(facebook_key)) {
            let get_info = new this.database.preparedStatment('get-userid', 'SELECT first_name, last_name FROM users WHERE email=$1 AND facebook_key=$2', [email, facebook_key]); // Creating a prepared statement

            this.database.userDB.one(get_info)
                .then(function(data) {
                    let firstName = data.first_name;
                    let lastName = data.last_name;

                    if (firstName != null) { // Found user
                        client.isLogin = true;
                        client.email = email;
                        client.facebookKey = facebook_key;
                        client.firstName = firstName;
                        client.lastName = lastName;

                        client.connection.sendUTF(JSON.stringify({ type:'login_response', data: { response: 'success', first_name: firstName, last_name: lastName }}));
                        self.changeLocation(client, lat, lng);
                    } else {
                        client.isLogin = false;
                        client.firstName = '';
                        client.lastName = '';
                    }
                })
                .catch(error => {
                    /* Set client to default credentials */
                    client.isLogin = false;
                    client.firstName = '';
                    client.lastName = '';

                    client.connection.sendUTF(JSON.stringify({ type:'login_response', data: { response: 'failed'}}));

                    console.log(error);
                    console.log('Could not find user.');
                    return false;
                });
        }
    }
};

Login.prototype.validInput = function (input) {
    return true;
};

Login.prototype.changeLocation = function(client, lat, lng) {
    let findLocation = new this.database.preparedStatment('find-location', 'SELECT location_id FROM locations WHERE ST_Point($1, $2) @ bounds;', [lng, lat]); // Creating a prepared statement

    let self = this;
    this.database.Location_DB().one(findLocation)
        .then(function(data) {
            let id = data.location_id;
            if (id != null) {
                self.EventManager.changeLocation(client, id);
            }
        })
        .catch(error => {
            console.log(error);
            console.log('Could not locate a location for user.');
            return false;
        });
};

module.exports = Login;

