var self = require("sdk/self");
var panels = require("sdk/panel");
var wallabag = require("wallabag");

exports.new = function (button, onSuccess) {
    var connectionPanel = panels.Panel({
        contentURL: self.data.url("connection.html"),
        contentScriptFile: self.data.url("connection.js"),
        onHide: function() {
            button.state('window', {checked: false});
        }
    });

    connectionPanel.port.on("connection", function (data) {
      wallabag.connect(
          data.client_id,
          data.client_secret,
          data.username,
          data.password,
          function(response) {
              console.log("Connection success");
              onSuccess(response.json);
          },
          function(response) {
              console.log("Connection error: " + response.status);
              connectionPanel.port.emit("error", "Impossible de se connecter.");
              onSuccess(response.json);
          }
        );
    });

    return connectionPanel;
};
