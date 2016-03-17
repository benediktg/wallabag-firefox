var panels = require("sdk/panel");

function create_panel() {
  var save_panel = panels.Panel({
      contentURL: "./save/index.html",
      contentScriptFile: "./save/main.js"
  });

  return save_panel;
}

function send_post(save_panel, data) {
  save_panel.port.emit("post", data);
}

exports.create_panel = create_panel;
exports.send_post = send_post;
