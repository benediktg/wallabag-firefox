const { defer } = require('sdk/core/promise');
var Request = require("sdk/request").Request;

function create(url, client_id, client_secret, access_token, refresh_token) {
  return {
    url: url,
    client_id: client_id,
    client_secret: client_secret,
    access_token: access_token,
    refresh_token: refresh_token
  };
}

function post(server, url) {
  var deferred = defer();
  console.log("I'm gonna add " + url + " on the " + server.url + "/api/entries!");

  Request({
    url: server.url + "/api/entries",
    content: {
      url: url,
    },
    headers: {
      'Authorization': "Bearer " + server.access_token
    },
    onComplete: function(response) {
      if (response.status == 200) {
        deferred.resolve(response.json);
      } else {
        deferred.reject(response.json);
      }
    }
  }).post();

  return deferred.promise;
}

exports.create = create;
exports.post = post;
