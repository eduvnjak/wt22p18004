const callback1 = function (error, data) {
    if (error) {
        document.getElementById("message").innerHTML = error.greska;
    } else {
        const meni = document.getElementById("meni");
        for (const predmet of data.predmeti) {
            const listItem = document.createElement("li");
            listItem.innerText = predmet;
            listItem.addEventListener("click", prikaziTabeluPrisustva.bind(null, predmet));
            meni.children[0].appendChild(listItem);
        }
    }
}
const callback2 = function (error, data) {
    if (error) {
        document.getElementById("message").innerHTML = error.greska;
    } else {
        const tabelaContainer = document.getElementById("tabela_container");
        if (data) {
            TabelaPrisustvo(tabelaContainer, data);
        } else {
            tabelaContainer.innerHTML = "Nema podataka za ovaj predmet"
        }
    }
}
const prikaziTabeluPrisustva = (predmet) => {
    const meni = document.getElementById("meni");
    for (const li of meni.children[0].children) {
        if (li.textContent == predmet) {
            li.classList.add("odabran");
        } else {
            li.classList.remove("odabran");
        }
    }
    PoziviAjax.getPredmet(predmet, callback2);
}
PoziviAjax.getPredmeti(callback1);