var form = document.getElementById("connectionForm");
connectionForm.addEventListener('submit', function (event) {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    self.port.emit("connection", {
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
