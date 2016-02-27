var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var self = require("sdk/self");
var tabs = require('sdk/tabs');

var wallabag = require("wallabag");
var wallabag_token;

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
    if (state.checked) {
        postPage();
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
