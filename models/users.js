var user = function() {
    var array_user_names = [];

    this.getUsers = function() {
        return array_user_names;
    };

    this.addUser = function(username) {
        array_user_names.push(username);
        return username;
    };

    this.findUser = function(username) {
        var pos = array_user_names.indexOf(username);
        if (pos > -1) {
            return pos;
        }

        return -1;
    };

    this.deleteUser = function(username) {
        var pos = this.findUser(username);
        if (pos == -1) {
            return false;
        }

        array_user_names.splice(pos, 1);

        return true;
    };
};

module.exports = new user();