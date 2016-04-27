var panels = require("sdk/panel");
var Request = require("sdk/request").Request;
const { defer } = require('sdk/core/promise');
var _ = require("sdk/l10n").get;

function create_panel(wallabag_url, wallabag_client_id, wallabag_client_secret, onSuccess) {
    var connection_panel = panels.Panel({
        contentURL: "./connection/index.html",
        contentScriptFile: "./connection/main.js"
    });

    connection_panel.port.on("connection", function (data) {
      connect(
        wallabag_url,
        wallabag_client_id,
        wallabag_client_secret,
        data.username,
        data.password,
        function(response) {
          console.log("Connection success");
          onSuccess(response.access_token, response.refresh_token);
        },
        function(response) {
          console.log("Connection error: " + response);
          connection_panel.port.emit("error", _('connection_impossible'));
        }
      );
    });

    return connection_panel;
}

function connect(wallabag_url, wallabag_client_id, wallabag_client_secret, username, password, onSuccess, onError) {
  Request({
    url: wallabag_url + "/oauth/v2/token",
    content: {
      grant_type: 'password',
      client_id: wallabag_client_id,
      client_secret: wallabag_client_secret,
      username: username,
      password: password
    },
    onComplete: function(response) {
      if (response.status == 200) {
          onSuccess(response.json);
      } else {
          onError(response.json);
      }
    }
  }).post();
}

function refresh(url, client_id, client_secret, refresh_token) {
  var deferred = defer();

  Request({
    url: url + "/oauth/v2/token",
    content: {
      grant_type: 'refresh_token',
      client_id: client_id,
      client_secret: client_secret,
      refresh_token: refresh_token
    },
    onComplete: function(response) {
      console.log(response);
      if (response.status == 200) {
          deferred.resolve(response.json);
      } else {
          deferred.reject(response.json);
      }
    }
  }).post();

  return deferred.promise;
}

exports.create_panel = create_panel;
exports.connect = connect;
exports.refresh = refresh;
