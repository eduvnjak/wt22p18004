const PoziviAjax = (() => {

    //fnCallback u svim metodama se poziva kada stigne odgovor sa servera putem Ajax-a
    // svaki callback kao parametre ima error i data, error je null ako je status 200 i data je tijelo odgovora
    // ako postoji greška poruka se prosljeđuje u error parametar callback-a, a data je tada null
    function impl_getPredmet(naziv, fnCallback) {
        var ajax = new XMLHttpRequest();

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4) {
                if (ajax.status == 200) {
                    fnCallback(null, JSON.parse(ajax.response));
                } else {
                    fnCallback(JSON.parse(ajax.response), null)
                }
            }
        }

        ajax.open("GET", `http://localhost:3000/predmeti/${naziv}`, true);
        ajax.send();
    }
    // vraća listu predmeta za loginovanog nastavnika ili grešku da nastavnik nije loginovan
    function impl_getPredmeti(fnCallback) {
        var ajax = new XMLHttpRequest();

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4) {
                if (ajax.status == 200) {
                    fnCallback(null, JSON.parse(ajax.response));
                } else {
                    fnCallback(JSON.parse(ajax.response), null)
                }
            }
        }

        ajax.open("GET", "http://localhost:3000/predmeti", true);
        ajax.send();
    }
    function impl_postLogin(username, password, fnCallback) {
        // console.log(`stiglo {username: ${username}, password: ${password}}`)
        var ajax = new XMLHttpRequest();

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4) {
                if (ajax.status == 200) {
                    fnCallback(null, JSON.parse(ajax.response));
                } else {
                    fnCallback(JSON.parse(ajax.response), null)
                }
            }
        }

        ajax.open("POST", "http://localhost:3000/login", true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify({ username: username, password: password }));
    }
    function impl_postLogout(fnCallback) {

    }
    //prisustvo ima oblik {sedmica:N,predavanja:P,vjezbe:V}
    function impl_postPrisustvo(naziv, index, prisustvo, fnCallback) {

    }

    return {
        postLogin: impl_postLogin,
        postLogout: impl_postLogout,
        getPredmet: impl_getPredmet,
        getPredmeti: impl_getPredmeti,
        postPrisustvo: impl_postPrisustvo
    };
})();
