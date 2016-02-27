var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var _ = require("sdk/l10n").get;
var self = require("sdk/self");
var tabs = require('sdk/tabs');
var prefs = require('sdk/simple-prefs').prefs;

var urls = require('sdk/url');
var notifications = require("sdk/notifications");
var preferencesUtils = require("sdk/preferences/utils");

var wallabag = require("wallabag");

var newConnectionPanel = require("connectionPanel").new;

// a dummy function, to show how tests work.
// to see how to test this function, look at test/test-index.js
function dummy(text, callback) {
  callback(text);
}


var button = ToggleButton({
  id: "wallabag",
  label: "Wallabag",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onChange: handleChange
});

var connectionPanel = newConnectionPanel(button, function onSuccess(data) {
    connectionPanel.hide();
    postPage();
})

var savedPanel = panels.Panel({
  contentURL: self.data.url("saved.html"),
  onHide: handleHide,
  onShow: function() {

  }
});

function handleChange(state) {
    var wallabagUrl = prefs.wallabagUrl;
    var wallabagClientId = prefs.wallabagClientId;
    var wallabagSecretId = prefs.wallabagSecretId;
    var wallabagToken = prefs.wallabagToken;

    if (wallabagUrl === "" || wallabagClientId === "" || wallabagSecretId === "" | !urls.isValidURI(wallabagUrl)) {
        if (wallabagUrl === "" || wallabagClientId === "" || wallabagSecretId === "") {
            var errorMessage = _("cfg_required_msg");
        } else {
            var errorMessage = _("cfg_valid_url_msg");
        }

        notifications.notify({
            title: _("cfg_config_error_title"),
            text: errorMessage,
            iconURL: "./icon-64.png"
        });

        button.state('window', {checked: false});
        preferencesUtils.open(self);
    } else if (wallabagToken === "") {
        connectionPanel.show({
            position: button
        });
    } else {
        if (state.checked) {
            postPage();
        }
    }
}

function postPage() {
    wallabag.post(wallabag_token, tabs.activeTab.url, function(response) {
        savedPanel.show({
            position: button
        });
    }, function(error) {
        connectionPanel.show({
            position: button
        });
    });
}

function handleHide() {
  button.state('window', {checked: false});
}
exports.dummy = dummy;
