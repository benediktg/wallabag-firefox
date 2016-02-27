var Request = require("sdk/request").Request;

function Wallabag(url, token) {
    this.url = url;
    this.token = token;
}

Wallabag.prototype.connect = function connect(client_id, client_secret, username, password, success, error) {
    Request({
        url: "http://v2.wallabag.org/oauth/v2/token",
        content: {
            'grant_type': 'password',
            'client_id': client_id,
            'client_secret': client_secret,
            'username': username,
            'password': password
        },
        onComplete: function(response) {
            if (response.status == 200) {
                success(response);
            } else {
                error(response);
            }
        }
  }).post();
}

function post(token, url, success, error) {
    Request({
        url: "http://v2.wallabag.org/api/entries",
        content: {
            'url': url
        },
        onComplete: function(response) {
            if (response.status == 200) {
                success(response);
            } else {
                error(response);
            }
        }
  }).post();
}

exports.connect = connect;
exports.post = post;
