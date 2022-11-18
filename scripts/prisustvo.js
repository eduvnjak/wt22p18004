import TabelaPrisustvo from './TabelaPrisustvo.js';
let div = document.getElementById("tabela_prisustvo");
console.log("TU");
//instanciranje
let prisustvo = TabelaPrisustvo(div,
    {
        studenti: [{
            ime: "Neko",
            index: 12345
        },
        {
            ime: "Drugi neko",
            index: 12346            
        }],
        prisustva: [{
            sedmica: 1,
            predavanja: 1,
            vjezbe: 1,
            index: 12345
        }],
        predmet: "WT",
        brojPredavanjaSedmicno: 3,
        brojVjezbiSedmicno: 2
    }
);