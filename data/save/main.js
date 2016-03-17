
self.port.on("post", function (data) {
  if (data.success) {
    document.getElementById("waiting").style.display = "none";
    document.getElementById("failure").style.display = "none";
    document.getElementById("success").style.display = "block";
  } else {
    document.getElementById("waiting").style.display = "none";
    document.getElementById("success").style.display = "none";
    document.getElementById("failure").style.display = "block";
  }
});
