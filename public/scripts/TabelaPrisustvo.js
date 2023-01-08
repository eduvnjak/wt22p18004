let TabelaPrisustvo = function (divRef, podaci, callback = null) {
    function dajRimskiBroj(sedmica) {
        switch (sedmica) {
            case 1:
                return "I";
            case 2:
                return "II";
            case 3:
                return "III";
            case 4:
                return "IV";
            case 5:
                return "V";
            case 6:
                return "VI";
            case 7:
                return "VII";
            case 8:
                return "VIII";
            case 9:
                return "IX";
            case 10:
                return "X";
            case 11:
                return "XI";
            case 12:
                return "XII";
            case 13:
                return "XIII";
            case 14:
                return "XIV";
            case 15:
                return "XV";
            default:
                return null;
        }
    }
    function dajProcentualnoPrisustvo(index, sedmica) {
        const prisustvo = podaci.prisustva.find(x => x.sedmica == sedmica && x.index == index);
        if (!prisustvo) return `\xA0\xA0\xA0\xA0\xA0`;
        const procenat = ((prisustvo.predavanja * 1.0 + prisustvo.vjezbe) / (podaci.brojPredavanjaSedmicno + podaci.brojVjezbiSedmicno)) * 100;
        return Math.round(procenat) + "%";
    }
    function dajKlasuZaCelijuPredavanja(index, sedmica, trenutnaCelija) {
        const prisustvo = podaci.prisustva.find(x => x.sedmica == sedmica && x.index == index);
        if (!prisustvo) return "nije_uneseno";
        if (trenutnaCelija < prisustvo.predavanja)
            return "prisutan";
        return "nije_prisutan";
    }
    function dajKlasuZaCelijuVjezbi(index, sedmica, trenutnaCelija) {
        const prisustvo = podaci.prisustva.find(x => x.sedmica == sedmica && x.index == index);
        if (!prisustvo) return "nije_uneseno";
        if (trenutnaCelija < prisustvo.vjezbe)
            return "prisutan";
        return "nije_prisutan";
    }
    function dajPrisustvoObjekat(index, sedmica) {
        const prisustvo = podaci.prisustva.find(x => x.sedmica == sedmica && x.index == index);
        return {
            sedmica: sedmica,
            predavanja: prisustvo ? prisustvo.predavanja : 0,
            vjezbe: prisustvo ? prisustvo.vjezbe : 0
        }
    }
    function promijeniPrisustvo(naziv, index, prisustvoObjekat, casVrsta, trenutniStil) {
        if (!(casVrsta == "P" || casVrsta == "V")) return;
        if (!(trenutniStil == "nije_uneseno" || trenutniStil == "prisutan" || trenutniStil == "nije_prisutan")) return;

        if (trenutniStil == "nije_uneseno" || trenutniStil == "nije_prisutan") {
            if (casVrsta == "P") {
                prisustvoObjekat.predavanja++;
            } else {
                prisustvoObjekat.vjezbe++;
            }
        } else {
            if (casVrsta == "P") {
                prisustvoObjekat.predavanja--;
            } else {
                prisustvoObjekat.vjezbe--;
            }
        }
        console.log(prisustvoObjekat);
        PoziviAjax.postPrisustvo(naziv, index, prisustvoObjekat, callback);
    }
    divRef.innerHTML = "";
    //validacija podataka

    // broj prisustva na predavanju/vjezbi nije veci od broja predavanja/vjezbi sedmicno
    // broj prisustva nije manji od nule
    for (const prisustvo of podaci.prisustva) {
        if (prisustvo.predavanja < 0 || prisustvo.predavanja > podaci.brojPredavanjaSedmicno
            || prisustvo.vjezbe < 0 || prisustvo.vjezbe > podaci.brojVjezbiSedmicno) {
            divRef.innerHTML = "Podaci o prisustvu nisu validni!";
            return;
        }
    }
    // isti student nema vise od jednog unosa prisustva za jednu sedmicu
    for (let i = 0; i < podaci.prisustva.length - 1; i++) {
        const prisustvo1 = podaci.prisustva[i];
        for (let j = i + 1; j < podaci.prisustva.length; j++) {
            const prisustvo2 = podaci.prisustva[j];
            if (prisustvo1.sedmica == prisustvo2.sedmica && prisustvo1.index == prisustvo2.index) {
                divRef.innerHTML = "Podaci o prisustvu nisu validni!";
                return;
            }
        }
    }
    // ne postoje dva ili više studenta sa istim indeksom
    if (podaci.studenti.length != new Set(podaci.studenti.map(x => x.index)).size) {
        divRef.innerHTML = "Podaci o prisustvu nisu validni!";
        return;
    }
    // ne postoje podaci za studenta koji nije u listi studenata 
    const prisustvaIndexi = new Set(podaci.prisustva.map(x => x.index));
    const studentiIndexi = new Set(podaci.studenti.map(x => x.index));
    for (const iterator of prisustvaIndexi) {
        if (!studentiIndexi.has(iterator)) {
            divRef.innerHTML = "Podaci o prisustvu nisu validni!";
            return;
        }
    }
    // ne postoji sedmica između dvije sedmice, u kojima je uneseno prisustvo barem jednom studentu, u kojoj nema priustva za bar jednog studenta
    const sedmice = new Set(podaci.prisustva.map(x => x.sedmica));
    const sedmiceSortirane = Array.from(sedmice).sort();
    const pocetna = sedmiceSortirane[0];
    for (let i = 0; i < sedmiceSortirane.length; i++) {
        const element = sedmiceSortirane[i];
        if (pocetna + i != element) {
            divRef.innerHTML = "Podaci o prisustvu nisu validni!";
            return;
        }
    }
    // ako nisu validni zavrsi
    const table = document.createElement("table");
    const tableBody = document.createElement("tbody");

    const headerRow = document.createElement("tr");
    // header za ime i prezime
    const headerCellIme = document.createElement("th");
    const headerCellImeText = document.createTextNode("Ime i prezime");
    headerCellIme.appendChild(headerCellImeText);
    // header za index
    const headerCellIndex = document.createElement("th");
    const headerCellIndexText = document.createTextNode("Index");
    headerCellIndex.appendChild(headerCellIndexText);
    //headeri za sedmice 
    headerRow.append(headerCellIme, headerCellIndex);
    const posljednjaUnesenaSedmica = sedmiceSortirane[sedmiceSortirane.length - 1] ?? 1;
    var trenutnaSedmica = posljednjaUnesenaSedmica;
    for (let sedmica = 1; sedmica <= 15; sedmica++) {
        const headerCellSedmice = document.createElement("th");
        if (sedmica <= posljednjaUnesenaSedmica) {
            headerCellSedmice.textContent = dajRimskiBroj(sedmica);
        } else if (sedmica == posljednjaUnesenaSedmica + 1) {
            headerCellSedmice.textContent = dajRimskiBroj(sedmica);
            if (sedmica < 14) {
                headerCellSedmice.textContent += "-XV";
            }
        }
        if (sedmica == posljednjaUnesenaSedmica) {
            headerCellSedmice.setAttribute("colspan", podaci.brojPredavanjaSedmicno + podaci.brojVjezbiSedmicno);
        }
        headerRow.append(headerCellSedmice);
    }

    tableBody.appendChild(headerRow);

    for (let student of podaci.studenti) {
        const studentRow = document.createElement("tr");

        const cellIme = document.createElement("td");
        cellIme.setAttribute("rowspan", 2);
        cellIme.textContent = student.ime;

        const cellIndex = document.createElement("td");
        cellIndex.setAttribute("rowspan", 2);
        cellIndex.textContent = student.index;

        studentRow.append(cellIme, cellIndex);
        for (let sedmica = 1; sedmica < posljednjaUnesenaSedmica; sedmica++) {
            const cellPrisustvo = document.createElement("td");
            cellPrisustvo.setAttribute("rowspan", 2);
            cellPrisustvo.textContent = dajProcentualnoPrisustvo(student.index, sedmica);
            studentRow.append(cellPrisustvo);
        }
        for (let i = 1; i <= podaci.brojPredavanjaSedmicno; i++) {
            const cellPrisustvo = document.createElement("td");
            cellPrisustvo.classList.add("cas_vrsta");
            cellPrisustvo.textContent = "P" + i;
            studentRow.append(cellPrisustvo);
        }
        for (let i = 1; i <= podaci.brojVjezbiSedmicno; i++) {
            const cellPrisustvo = document.createElement("td");
            cellPrisustvo.classList.add("cas_vrsta");
            cellPrisustvo.textContent = "V" + i;
            studentRow.append(cellPrisustvo);
        }

        if (posljednjaUnesenaSedmica < 15) {
            const cellOstatak = document.createElement("td");
            cellOstatak.setAttribute("rowspan", 2);
            cellOstatak.setAttribute("colspan", 15 - posljednjaUnesenaSedmica);
            studentRow.append(cellOstatak);
        }
        tableBody.append(studentRow);

        const kvadratiRow = document.createElement("tr");

        for (let i = 0; i < podaci.brojPredavanjaSedmicno; i++) {
            const celija = document.createElement("td");
            celija.append(document.createElement("div"));
            const klasa = dajKlasuZaCelijuPredavanja(student.index, posljednjaUnesenaSedmica, i);
            celija.classList.add(klasa);
            if (callback) celija.addEventListener("click", promijeniPrisustvo.bind(this, podaci.predmet, student.index, dajPrisustvoObjekat(student.index, trenutnaSedmica), "P", klasa));
            kvadratiRow.append(celija);
        }
        for (let i = 0; i < podaci.brojVjezbiSedmicno; i++) {
            const celija = document.createElement("td");
            celija.append(document.createElement("div"));
            const klasa = dajKlasuZaCelijuVjezbi(student.index, posljednjaUnesenaSedmica, i);
            celija.classList.add(klasa);
            if (callback) celija.addEventListener("click", promijeniPrisustvo.bind(this, podaci.predmet, student.index, dajPrisustvoObjekat(student.index, trenutnaSedmica), "V", klasa));
            kvadratiRow.append(celija);
        }
        tableBody.append(kvadratiRow);

    }
    table.appendChild(tableBody);
    table.setAttribute("id", "tabela_prisustvo");

    const divWrap = document.createElement("div");
    divWrap.style.display = "flex";
    const bugfix = document.createElement("div");
    bugfix.setAttribute("id", "bugfix");
    bugfix.style.minWidth = "20px";

    divWrap.append(table, bugfix);

    divRef.append(divWrap);

    fixDonjiDesniRub(trenutnaSedmica);

    let sljedecaSedmica = function () {
        if (trenutnaSedmica == posljednjaUnesenaSedmica) return;
        trenutnaSedmica++;
        const redoviTabele = document.querySelectorAll("#tabela_prisustvo tr");
        if (!redoviTabele.length) return;
        const ukupnoCasova = podaci.brojPredavanjaSedmicno + podaci.brojVjezbiSedmicno;
        (redoviTabele[0].childNodes[trenutnaSedmica]).removeAttribute("colspan");
        (redoviTabele[0].childNodes[trenutnaSedmica + 1]).setAttribute("colspan", ukupnoCasova);
        for (let i = 1; i < redoviTabele.length; i += 2) {
            const redGore = redoviTabele[i].childNodes;
            (redGore[trenutnaSedmica]).before(redGore[trenutnaSedmica + ukupnoCasova]);
            redGore[trenutnaSedmica].textContent = dajProcentualnoPrisustvo(redGore[1].textContent, trenutnaSedmica - 1);
            if (trenutnaSedmica == 15) {
                redGore[trenutnaSedmica].classList = "";
            }
            const redDole = redoviTabele[i + 1].childNodes;
            for (let j = 0; j < podaci.brojPredavanjaSedmicno; j++) {
                redoviTabele[i + 1].replaceChild(redDole[j].cloneNode(true), redDole[j]);
                redDole[j].className = "";
                const klasa = dajKlasuZaCelijuPredavanja(redGore[1].textContent, trenutnaSedmica, j);
                redDole[j].classList.add(klasa);
                if (callback) {
                    redDole[j].addEventListener("click", promijeniPrisustvo.bind(this, podaci.predmet, redGore[1].textContent, dajPrisustvoObjekat(redGore[1].textContent, trenutnaSedmica), "P", klasa));
                }
            }
            for (let j = podaci.brojPredavanjaSedmicno; j < ukupnoCasova; j++) {
                redoviTabele[i + 1].replaceChild(redDole[j].cloneNode(true), redDole[j]);
                redDole[j].className = "";
                const klasa = dajKlasuZaCelijuVjezbi(redGore[1].textContent, trenutnaSedmica, j - podaci.brojPredavanjaSedmicno);
                redDole[j].classList.add(klasa);
                if (callback) {
                    redDole[j].addEventListener("click", promijeniPrisustvo.bind(this, podaci.predmet, redGore[1].textContent, dajPrisustvoObjekat(redGore[1].textContent, trenutnaSedmica), "V", klasa));
                }
            }
        }
        fixDonjiDesniRub(trenutnaSedmica);
    };

    let prethodnaSedmica = function () {
        if (trenutnaSedmica == 1) return;
        trenutnaSedmica--;
        const redoviTabele = document.querySelectorAll("#tabela_prisustvo tr");
        if (!redoviTabele.length) return;
        const ukupnoCasova = podaci.brojPredavanjaSedmicno + podaci.brojVjezbiSedmicno;
        (redoviTabele[0].childNodes[trenutnaSedmica + 2]).removeAttribute("colspan");
        (redoviTabele[0].childNodes[trenutnaSedmica + 1]).setAttribute("colspan", ukupnoCasova);
        for (let i = 1; i < redoviTabele.length; i += 2) {
            const redGore = redoviTabele[i].childNodes;
            (redGore[trenutnaSedmica + 1 + ukupnoCasova]).after(redGore[trenutnaSedmica + 1]);
            redGore[trenutnaSedmica + ukupnoCasova + 1].textContent = dajProcentualnoPrisustvo(redGore[1].textContent, trenutnaSedmica + 1);
            const redDole = redoviTabele[i + 1].childNodes;
            for (let j = 0; j < podaci.brojPredavanjaSedmicno; j++) {
                redoviTabele[i + 1].replaceChild(redDole[j].cloneNode(true), redDole[j]);
                redDole[j].className = "";
                const klasa = dajKlasuZaCelijuPredavanja(redGore[1].textContent, trenutnaSedmica, j);
                redDole[j].classList.add(klasa);
                if (callback) {
                    redDole[j].addEventListener("click", promijeniPrisustvo.bind(this, podaci.predmet, redGore[1].textContent, dajPrisustvoObjekat(redGore[1].textContent, trenutnaSedmica), "P", klasa));
                }
            }
            for (let j = podaci.brojPredavanjaSedmicno; j < ukupnoCasova; j++) {
                redoviTabele[i + 1].replaceChild(redDole[j].cloneNode(true), redDole[j]);
                redDole[j].className = "";
                const klasa = dajKlasuZaCelijuVjezbi(redGore[1].textContent, trenutnaSedmica, j - podaci.brojPredavanjaSedmicno);
                redDole[j].classList.add(klasa);
                if (callback) {
                    redDole[j].addEventListener("click", promijeniPrisustvo.bind(this, podaci.predmet, redGore[1].textContent, dajPrisustvoObjekat(redGore[1].textContent, trenutnaSedmica), "V", klasa));
                }
            }
        }
        fixDonjiDesniRub(trenutnaSedmica);
    };
    const dugme_nazad = document.createElement("button");
    dugme_nazad.setAttribute("id", "dugme_nazad");
    // dugme_nazad.textContent = "Prethodna sedmica";
    const ikonica_nazad = document.createElement("i");
    ikonica_nazad.classList.add("fa-solid", "fa-arrow-left", "fa-2x");
    dugme_nazad.appendChild(ikonica_nazad);

    const dugme_naprijed = document.createElement("button");
    dugme_naprijed.setAttribute("id", "dugme_naprijed");
    // dugme_naprijed.textContent = "Sljedeća sedmica";
    const ikonica_naprijed = document.createElement("i");
    ikonica_naprijed.classList.add("fa-solid", "fa-arrow-right", "fa-2x");
    dugme_naprijed.appendChild(ikonica_naprijed);
    divRef.append(dugme_nazad, dugme_naprijed);

    document.getElementById("dugme_nazad").addEventListener("click", prethodnaSedmica);
    document.getElementById("dugme_naprijed").addEventListener("click", sljedecaSedmica);

    return {
        sljedecaSedmica: sljedecaSedmica,
        prethodnaSedmica: prethodnaSedmica
    };

};

function fixDonjiDesniRub(trenutnaSedmica) {
    if (trenutnaSedmica == 15) {
        const radiusElement = document.querySelector("#tabela_prisustvo tr:last-of-type td:last-of-type");
        radiusElement.classList.add("border_radius");
    } else {
        const radiusElement = document.querySelector("#tabela_prisustvo tr:nth-last-of-type(2) td:last-of-type");
        radiusElement.classList.add("border_radius");
    }
}
