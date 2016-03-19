var tabs = require('sdk/tabs');
var prefs = require('sdk/simple-prefs').prefs;
var ss = require("sdk/simple-storage");

var configuration = require("configuration");
var server = require("server");
var connection = require("connection");
var save = require("save");
var button_library = require("button");

// instance with all the information to contact the server
var wallabag_server;

// if we have an URL and an access token
if (configuration.has_access()) {
  console.log("Access token existing, trying to create a server…");
  wallabag_server = server.create(prefs.wallabagUrl, prefs.wallabagClientId, prefs.wallabagSecretId, ss.storage.wallabagAccessToken, ss.storage.wallabagRefreshToken);
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
          handleChange();
        }
      );

      connection_panel.on('hide', function() {
        button.state('window', {checked: false});
      });
      connection_panel.show({
          position: button,
          height: 300
      });
    }, function() {
      // if the config is incorrect uncheck the button
      button.state('window', {checked: false});
    });
  } else {
    console.log("Wallabag server is ready! I can post!");
    save_panel = save.create_panel();
    save_panel.on('hide', function() {
      button.state('window', {checked: false});
    });
    save_panel.show({
        position: button
    });
    server.post(wallabag_server, tabs.activeTab.url).then(function(data) {
      save.send_post(save_panel, {
        success: true
      });
    }, function(data) {
      if (data.error === "invalid_grant") {
        console.log("Access token expired. Trying to refresh with " + wallabag_server.client_id + " and " + wallabag_server.client_secret);
        connection.refresh(wallabag_server.url, wallabag_server.client_id, wallabag_server.client_secret, wallabag_server.refresh_token).then(function(data) {
          console.log(data);
          configuration.set(data.access_token, data.refresh_token);
          wallabag_server.access_token = data.access_token;
          wallabag_server.refresh_token = data.refresh_token;
          console.log("Access token refreshed.");
        }, function(data) {
          console.log(data);
          console.log("Impossible to refresh the access token.");
          wallabag_server = undefined;
          handleChange();
        });
      } else {
        console.log("Impossible to save the article.");
        console.log(data);
        save.send_post(save_panel, {
          success: false
        });
      }
    }, function(error) {
      console.log(error);
    });
  }
};
