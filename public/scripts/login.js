const logoutDugme = document.getElementById("logout");

logoutDugme.addEventListener("click", () => {
    PoziviAjax.postLogout((error, data) => {
        if (error) {
            alert(error);
        } else {
            window.location.replace("http://localhost:3000/prijava.html");
        }
    });
})

PoziviAjax.getPredmeti((error, data) => {
    if (error) {
        logoutDugme.innerHTML = "Log in";
    }
})