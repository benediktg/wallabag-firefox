var tabs = require('sdk/tabs');
var prefs = require('sdk/simple-prefs').prefs;

var configuration = require("configuration");
var server = require("server");
var connection = require("connection");
var button_library = require("button");

// instance with all the information to contact the server
var wallabag_server;

// if we have an URL and an access token
if (configuration.has_access()) {
  console.log("Access token existing, trying to create a server…");
  wallabag_server = server.create(prefs.wallabagUrl, prefs.wallabagClientId, prefs.wallabagClientSecret, prefs.wallabagAccessToken, prefs.wallabagRefreshToken);
}

var button = button_library.create(handleChange);

function handleChange() {
  // if the Wallabag server is not defined (unreachable or no connection)
  if (! wallabag_server) {
    console.log("Wallabag server undefined, checking configuration…");

    // verify_config will redirect the user if something is wrong
    configuration.verify_config().then(function(wallabag) {
      var connection_panel = connection.create_panel(
        wallabag.url,
        wallabag.client_id,
        wallabag.client_secret,
        function afterConnection(access_token, refresh_token) {
          console.log("Connection successful: setting access and refresh token in configuration");
          configuration.set(access_token, refresh_token);
          wallabag_server = server.create(
            wallabag.url,
            wallabag.client_id,
            wallabag.client_secret,
            access_token,
            refresh_token
          );
          connection_panel.hide();
          button.state('window', {checked: false});
        }
      );

      connection_panel.show({
          position: button
      });
    }, function() {
      button.state('window', {checked: false});
    });
  } else {
    console.log("Wallabag server is ready! I can post!");
    server.post(wallabag_server, tabs.activeTab.url).then(function(data) {
      button.state('window', {checked: false});
    }, function(data) {
      button.state('window', {checked: false});

      if (data.error === "invalid_grant") {
        console.log("Access token expired.");
        connection.refresh(wallabag_server.url, wallabag_server.client_id, wallabag_server.client_secret, wallabag_server.refresh_token).then(function(data) {
          console.log(data);
          console.log("Access token refreshed.");
        }, function(data) {
          console.log(data);
          console.log("Impossible to refresh the access token.");
        });
      } else {
        console.log("Problem");
      }
    });
  }
};
