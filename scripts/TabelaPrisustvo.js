let TabelaPrisustvo = function (divRef, podaci) {
    divRef.innerHTML = "";
    //validacija podataka

    // broj prisustva na predavanju/vjezbi je veci od broja predavanja/vjezbi sedmicno
    // broj prisustva je manji od nule
    for (const prisustvo of podaci.prisustva) {
        if (prisustvo.predavanja < 0 || prisustvo.predavanja > podaci.brojPredavanjaSedmicno
            || prisustvo.vjezbe < 0 || prisustvo.vjezbe > podaci.brojVjezbiSedmicno) {
            divRef.innerHTML = "Podaci o prisustvu nisu validni!";
            return;
        }
    }
    // isti student ima dva ili vise unosa prisustva za istu sedmicu
    // const prisustva = podaci.prisustva.map(
    //     prisustvo => {
    //         return { sedmica: prisustvo.sedmica, prisustvo: prisustvo.index };
    //     }
    // );
    // if (prisustva.length != new Set(prisustva).size) {
    //     divRef.innerHTML = "Podaci o prisustvu nisu validni!";
    //     return;
    // }
    // console.log(prisustva);
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