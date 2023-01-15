const prijavaButton = document.getElementById("prijavaButton");
const callback = function (error, data) {
    if (error) {
        const poruka = document.getElementById("message");
        poruka.innerHTML = error.poruka;
        poruka.classList.remove("hidden");
    } else {
        // window.location.href = "http://localhost:3000/predmeti.html"
        window.location.replace("http://localhost:3000/predmeti.html");
    }
}
function login() {
    PoziviAjax.postLogin(document.getElementById("username").value, document.getElementById("password").value, callback);
}
prijavaButton.addEventListener("click", login);
document.getElementById("username").addEventListener("keyup", (event) => {
    if (event.key === 'Enter') {
        login();
    }
})
document.getElementById("password").addEventListener("keyup", (event) => {
    if (event.key === 'Enter') {
        login();
    }
})