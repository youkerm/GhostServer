/**
 * Created by mitch on 2/7/2017.
 */

function Login(connection, config) {
    this.connection = connection;
    this.config = config;

    this.isLogin = false;
}

Login.prototype.login = function(userID, password) {
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
            console.log((new Date()) + ' User is known as: ' + this.getUsername());
            this.connection.sendUTF(JSON.stringify({ type:'login_response', data: { response: 'success', username: this.getUsername() }}));
        } else {
            this.connection.sendUTF(JSON.stringify({ type:'login_response', data: { response: 'failed'}}));
        }
    }
    return this.isLoggedIn();
}

Login.prototype.getUsername = function() {
    return this.userID;
}

Login.prototype.isLoggedIn = function() {
    return this.isLogin;
}

module.exports = Login;

