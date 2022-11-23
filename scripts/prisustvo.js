import TabelaPrisustvo from './TabelaPrisustvo.js';
let div = document.getElementById("tabela_container");
console.log("TU");
//instanciranje
let prisustvo = TabelaPrisustvo(div,
    {
        "studenti": [{
            "ime": "Neko Nekic",
            "index": 12345
        },
        {
            "ime": "Drugi Neko",
            "index": 12346
        },
        {
            "ime": "Neko 2",
            "index": 12347
        }
        ],
        "prisustva": [{
            "sedmica": 13,
            "predavanja": 2,
            "vjezbe": 1,
            "index": 12345
        },
        {
            "sedmica": 13,
            "predavanja": 2,
            "vjezbe": 2,
            "index": 12346
        },
        {
            "sedmica": 14,
            "predavanja": 2,
            "vjezbe": 0,
            "index": 12345
        },
        {
            "sedmica": 14,
            "predavanja": 0,
            "vjezbe": 0,
            "index": 12346
        },
        {
            "sedmica": 15,
            "predavanja": 2,
            "vjezbe": 3,
            "index": 12346
        }
        ],
        "predmet": "Razvoj mobilnih aplikacija",
        "brojPredavanjaSedmicno": 3,
        "brojVjezbiSedmicno": 5
    }
);
