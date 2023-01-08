const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const bcrypt = require('bcrypt');

const app = express();

app.use(express.static('public'))
app.use(express.static('./public/html'))

app.use(bodyParser.json());

//provjeri ove opcije
app.use(session({
    secret: 'tajna sifra',
    resave: true,
    saveUninitialized: true
}));
// !!!provjeri ove relativne linkove !! sta su tackice!!

app.post('/login', function (req, res) {
    //provjeri return statuse
    if (req.body.username && req.body.password) {
        // console.log("poslani parametri");
        fs.readFile("data/nastavnici.json", (err, data) => {
            if (err) {
                res.status(500).json({ poruka: "Neuspješna prijava" });
            }
            // console.log("procitani nastavnici.json; " + data);
            const nastavniciObjekat = JSON.parse(data);
            // console.log(nastavniciObjekat);
            //ovdje probaj onaj destructuring
            const nastavnikObjekat = nastavniciObjekat.find((user) => user.nastavnik.username == req.body.username)
            if (nastavnikObjekat) {
                // console.log("nastavnik pronađen" + JSON.stringify(nastavnikObjekat));
                bcrypt.compare(req.body.password, nastavnikObjekat.nastavnik.password_hash, function (err, result) {
                    if (err) {
                        res.status(500).json({ poruka: "Neuspješna prijava" });
                        return;
                    }
                    if (result) {
                        req.session.username = req.body.username;
                        req.session.predmeti = nastavnikObjekat.predmeti;
                        res.json({ poruka: "Uspješna prijava" });
                    } else {
                        res.status(401).json({ poruka: "Neuspješna prijava" });

                    }
                })
            } else {
                res.status(401).json({ poruka: "Neuspješna prijava" });
            }
        });
    } else {
        // console.log("nisu poslani parametri");
        res.status(400).json({ poruka: "Neuspješna prijava" });
    }
});
app.post('/logout', function (req, res) {
    req.session.destroy();
    res.json({ poruka: "Uspješan logout" })
    //ovako ili podatke (ili session?) na null
})
//ovo skloni na kraju
// app.get('/loginStatus', function (req, res) {
//     res.json({ nastavnik: req.session.username ?? "null" });
// });
app.get('/predmeti', function (req, res) {
    if (req.session.username) {
        res.json({ predmeti: req.session.predmeti });
    } else {
        res.status(401).json({ greska: "Nastavnik nije loginovan" });
    }
});
app.get('/predmeti/:NAZIV', function (req, res) {
    //da li treba provjeriti jel korisnik ulogovan i da li je predmet u sesiji
    //da li je potrebno decode route param
    if (req.session.username) {
        if (req.session.predmeti.includes(req.params.NAZIV)) {
            fs.readFile("data/prisustva.json", (err, data) => {
                if (err) {
                    res.status(500).json({ greska: "Greška pri čitanju podataka" });
                    return;
                }
                const svaPrisustva = JSON.parse(data); //promijeni ime ovog objekta
                var prisustvoObjekat = svaPrisustva.find((obj) => obj.predmet == req.params.NAZIV);
                if (prisustvoObjekat === undefined) prisustvoObjekat = null;
                res.json(prisustvoObjekat);
            })
        } else {
            res.status(403).json({ greska: `Niste nastavnik na predmetu ${req.params.NAZIV}` });
        }
    } else {
        res.status(401).json({ greska: "Nastavnik nije loginovan" });
    }
});
app.post('/prisustvo/predmet/:NAZIV/student/:index', function (req, res) {
    //da li loginovani nastavnik mora biti nastavnik na predmetu
    //da li mora postojati student sa indexom (iako se nece ispravno tabela nacrtati)
    if (req.body.sedmica == undefined || req.body.predavanja == undefined || req.body.vjezbe == undefined) {
        res.status(400).json({ greska: "Nepravilno tijelo zahtjeva" });
        return;
    }
    fs.readFile("data/prisustva.json", (err, data) => {
        if (err) {
            res.status(500).json({ greska: "Greška pri čitanju podataka" });
            return;
        }
        const svaPrisustva = JSON.parse(data);
        const prisustvoObjekat = svaPrisustva.find((obj) => obj.predmet == req.params.NAZIV);
        if (prisustvoObjekat === undefined) {
            res.status(400).json({ greska: `Ne postoji predmet ${req.params.NAZIV}` }); //ovdje mozda 404
            return;
        }
        if (req.body.sedmica < 1 || req.body.sedmica > 15) {
            res.status(400).json({ greska: "Nepravilni parametri zahtjeva" });
            return;
        }
        if (req.body.predavanja < 0 || req.body.predavanja > prisustvoObjekat.brojPredavanjaSedmicno) {
            res.status(400).json({ greska: "Nepravilni parametri zahtjeva" });
            return;
        }
        if (req.body.vjezbe < 0 || req.body.vjezbe > prisustvoObjekat.brojVjezbiSedmicno) {
            res.status(400).json({ greska: "Nepravilni parametri zahtjeva" });
            return;
        }
        const prisustvo = prisustvoObjekat.prisustva.find((obj) => obj.index == req.params.index && obj.sedmica == req.body.sedmica);
        if (prisustvo === undefined) {
            const novoPrisustvo = {
                sedmica: req.body.sedmica,
                predavanja: req.body.predavanja,
                vjezbe: req.body.vjezbe,
                index: req.params.index
            }
            prisustvoObjekat.prisustva.push(novoPrisustvo);
        } else {
            prisustvo.predavanja = req.body.predavanja;
            prisustvo.vjezbe = req.body.vjezbe;
        }
        // console.log(JSON.stringify(svaPrisustva));
        fs.writeFile("data/prisustva.json", JSON.stringify(svaPrisustva), (err) => {
            if (err) {
                res.status(500).json({ greska: "Greška pri pisanju podataka" });
                return;
            }
            res.json(prisustvoObjekat);
        })
    })
});
app.listen(3000);