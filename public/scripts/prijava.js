const prijavaButton = document.getElementById("prijavaButton");
const callback = function (error, data) {
    if (error) {
        document.getElementById("message").innerHTML = error.poruka;
    } else {
        // window.location.href = "http://localhost:3000/predmeti.html"
        window.location.replace("http://localhost:3000/predmeti.html");
    }
}

prijavaButton.addEventListener("click", () => { PoziviAjax.postLogin(document.getElementById("username").value, document.getElementById("password").value, callback) });