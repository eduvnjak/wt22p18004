let TabelaPrisustvo = function (divRef, podaci) {
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
    //ako nisu validni zavrsi
    const table = document.createElement("table");
    const tableBody = document.createElement("tbody");

    const headerRow = document.createElement("tr");
    const headerCellIme = document.createElement("th");
    const headerCellImeText = document.createTextNode("Ime i prezime");
    headerCellIme.appendChild(headerCellImeText);

    const headerCellIndex = document.createElement("th");
    const headerCellIndexText = document.createTextNode("Index");
    headerCellIndex.appendChild(headerCellIndexText);

    const headerCellSedmice = document.createElement("th");
    const headerCellSedmiceText = document.createTextNode("I-XV");
    headerCellSedmice.appendChild(headerCellSedmiceText);

    headerRow.append(headerCellIme, headerCellIndex, headerCellSedmice)
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

        const cellPrisustvo = document.createElement("td");
        cellPrisustvo.setAttribute("rowspan", 2)
        cellPrisustvo.textContent = "0%";

        studentRow.append(cellIme, cellIndex, cellPrisustvo);
        tableBody.append(studentRow);
        tableBody.append(document.createElement("tr"));
    }
    table.appendChild(tableBody);
    divRef.append(table);
};
export default TabelaPrisustvo;