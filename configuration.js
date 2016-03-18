var prefs = require('sdk/simple-prefs').prefs;
var ss = require("sdk/simple-storage");

var _ = require("sdk/l10n").get;
const { resolve } = require('sdk/core/promise');
const { reject } = require('sdk/core/promise');
var notifications = require("sdk/notifications");
var preferencesUtils = require("sdk/preferences/utils");
var self = require("sdk/self");
var urls = require('sdk/url');

/**
 * Check if the configuration is ok for connection
 */
function has_access() {
    return prefs.wallabagUrl && prefs.wallabagClientId && prefs.wallabagSecretId && ss.storage.wallabagAccessToken && ss.storage.wallabagRefreshToken && urls.isValidURI(prefs.wallabagUrl);
}

/**
 * Check if configuration is ok for creating access token
 */
function verify_config() {
  if (prefs.wallabagUrl === "" || prefs.wallabagClientId === "" || prefs.wallabagSecretId === "") {
    var errorMessage = _("cfg_required_msg");
  } else if (!urls.isValidURI(prefs.wallabagUrl)) {
    var errorMessage = _("cfg_valid_url_msg");
  }

  if (errorMessage) {
    notifications.notify({
      title: _("cfg_config_error_title"),
      text: errorMessage,
      iconURL: "./icon-64.png"
    });

    preferencesUtils.open(self);
    return reject();
  } else {
    return resolve({
      url: prefs.wallabagUrl,
      client_id: prefs.wallabagClientId,
      client_secret: prefs.wallabagSecretId
    });
  }
}

function set(wallabag_access_token, wallabag_refresh_token) {
  ss.storage.wallabagAccessToken = wallabag_access_token;
  ss.storage.wallabagRefreshToken = wallabag_refresh_token;
}

exports.has_access = has_access;
exports.verify_config = verify_config;
exports.set = set;
