var { ToggleButton } = require('sdk/ui/button/toggle');

function create(onChange) {
  return ToggleButton({
    id: "wallabag",
    label: "wallabag",
    icon: {
      "16": "./icon-16.png",
      "32": "./icon-32.png",
      "64": "./icon-64.png"
    },
    onChange: onChange
  });
}

exports.create = create;
