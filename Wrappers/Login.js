/**
 * Created by mitch on 2/7/2017.
 */

function Login(database, config) {
    this.database = database;
    this.config = config;
}

Login.prototype.login = function(connection, userID, password) {
    let isLogin = false;
    if (this.config.inDevMode()) {
        isLogin = true;
    } else {
        if (userID != null && password != null) {
            // Login logic here
            // QUERY DATABASE AND RETURN RESULT
        }
    }

    if (isLogin) {
        connection.sendUTF(JSON.stringify({ type:'login_response', data: { response: 'success', username: userID }}));
    } else {
        connection.sendUTF(JSON.stringify({ type:'login_response', data: { response: 'failed'}}));
    }
    return isLogin;
};

Login.prototype.changeLocation = function(client, EventManager, lat, lng) {
    let findLocation = new this.database.ps('find-location', 'SELECT location_id FROM locations WHERE ST_Point($1, $2) @ bounds;', [lng, lat]); // Creating a prepared statement

    this.database.getDB().one(findLocation)
        .then(function(data) {
            let id = data.location_id;
            if (id != null) {
                EventManager.changeLocation(client, id);
            }
        })
        .catch(error => {
            console.log(error);
            console.log('Could not locate a location for user.');
            return false;
        });
};

module.exports = Login;

