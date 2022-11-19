let TabelaPrisustvo = function (divRef, podaci) {
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
                return "XII";
            case 14:
                return "XIV";
            case 15:
                return "XV";
            default:
                return null;
        }
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
    headerRow.append(headerCellIme, headerCellIndex)
    const posljednjaUnesenaSedmica = sedmiceSortirane[sedmiceSortirane.length - 1];
    for (let sedmica = 1; sedmica <= 15; sedmica++) {
        const headerCellSedmice = document.createElement("th");
        let headerCellSedmiceText = document.createTextNode("");
        if (sedmica <= posljednjaUnesenaSedmica) {
            headerCellSedmiceText = document.createTextNode(dajRimskiBroj(sedmica));
        } else if (sedmica == posljednjaUnesenaSedmica + 1) {
            headerCellSedmiceText = document.createTextNode(dajRimskiBroj(sedmica) + "-XV");
        }
        if (sedmica == posljednjaUnesenaSedmica) {
            headerCellSedmice.setAttribute("colspan", podaci.brojPredavanjaSedmicno + podaci.brojVjezbiSedmicno);
        }
        headerCellSedmice.appendChild(headerCellSedmiceText);
        headerRow.append(headerCellSedmice);
    }

    tableBody.appendChild(headerRow);

    for (let student of podaci.studenti) {
        const studentRow = document.createElement("tr");
        console.log(student.ime + " " + student.index);

        const cellIme = document.createElement("td");
        cellIme.setAttribute("rowspan", 2)
        cellIme.textContent = student.ime;

        const cellIndex = document.createElement("td");
        cellIndex.setAttribute("rowspan", 2)
        cellIndex.textContent = student.index;

        studentRow.append(cellIme, cellIndex);
        for (let sedmica = 1; sedmica < posljednjaUnesenaSedmica; sedmica++) {
            const cellPrisustvo = document.createElement("td");
            cellPrisustvo.setAttribute("rowspan", 2)
            cellPrisustvo.textContent = "0%";
            // iznad placeholder, treba pozvati neku fun koja vrati prisustvo
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
        //placeholder; ovdje fino obojiti
        for (let i = 0; i < podaci.brojPredavanjaSedmicno + podaci.brojVjezbiSedmicno; i++) {
            const celija = document.createElement("td");
            celija.append(document.createElement("div"));
            celija.classList.add("prisutan");
            kvadratiRow.append(celija);
        }
        tableBody.append(kvadratiRow);

    }
    table.appendChild(tableBody);
    divRef.append(table);
};
export default TabelaPrisustvo;