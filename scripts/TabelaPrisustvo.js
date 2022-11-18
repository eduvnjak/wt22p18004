let TabelaPrisustvo = function (divRef, podaci) {
    divRef.innerHTML = "";
    //validacija podataka

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