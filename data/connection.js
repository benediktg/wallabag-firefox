var form = document.getElementById("connectionForm");
connectionForm.addEventListener('submit', function (event) {
    var client_id = document.getElementById("client_id").value;
    var client_secret = document.getElementById("client_secret").value;
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    self.port.emit("connection", {
        client_id: client_id,
        client_secret: client_secret,
        username: username,
        password: password
    });
}, false);

self.port.on("error", function (text) {
    var alert = document.createElement('div');
    alert.setAttribute("id", "alertBox");
    alert.setAttribute("class", "alert alert-danger");
    alert.appendChild(document.createTextNode(text));
    form.insertBefore(alert, form.childNodes[0]);
});
