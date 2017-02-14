/**
 * Created by mitch on 2/7/2017.
 */

function Login(connection, config) {
    this.connection = connection;
    this.config = config;

    this.isLogin = false;
    this.located = false;
}

Login.prototype.login = function(userID, password, lat, lng) {
    if (!this.isLogin) {
        this.userID = userID;
        this.password = password;

        if (this.config.inDevMode()) {
            this.isLogin = true;
        } else {
            if (this.userID != null && this.password != null) {
                //Login logic here
                //QUERY DATABASE AND RETURN RESULT
            }
        }

        if (this.isLoggedIn()) {
            this.connection.sendUTF(JSON.stringify({ type:'login_response', data: { response: 'success', username: this.getUsername() }}));
        } else {
            this.connection.sendUTF(JSON.stringify({ type:'login_response', data: { response: 'failed'}}));
        }
    }
    return this.isLoggedIn();
};

Login.prototype.getDBLocation = function(lat, lng) {

};


Login.prototype.getUsername = function() {
    return this.userID;
};

Login.prototype.isLoggedIn = function() {
    return this.isLogin;
};

module.exports = Login;

