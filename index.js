const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const bcrypt = require('bcrypt');
const db = require('./baza.js');

const app = express();

app.use(bodyParser.json());

app.use(session({
    secret: 'tajna sifra',
    resave: false,
    saveUninitialized: false
}));

app.use(express.static('public/html'));
app.use('/css', express.static('public/css'));
app.use('/icons', express.static('public/icons'));
app.use('/scripts', express.static('public/scripts'));

app.post('/login', async function (req, res) {
    if (req.body.username && req.body.password) {
        try {
            // console.log("poslani parametri");
            const nastavnik = await db.sequelize.models.nastavnik.findOne({ where: { username: req.body.username } });
            if (nastavnik === null) {
                res.status(403).json({ poruka: "Neuspješna prijava" });
                return;
            }
            const match = await bcrypt.compare(req.body.password, nastavnik.password_hash);
            if (match) {
                const predmeti = await nastavnik.getPredmeti();
                req.session.username = req.body.username;
                req.session.predmeti = predmeti.map((predmet) => predmet.naziv);
                res.json({ poruka: "Uspješna prijava" });
            } else {
                res.status(403).json({ poruka: "Neuspješna prijava" });
                return;
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ poruka: "Neuspješna prijava" });
        }
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
app.get('/predmeti', function (req, res) {
    if (req.session.username) {
        res.json({ predmeti: req.session.predmeti });
    } else {
        res.status(403).json({ greska: "Nastavnik nije loginovan" });
    }
});
app.get('/predmeti/:NAZIV', function (req, res) {
    if (!req.session.username) {
        res.status(403).json({ greska: "Nastavnik nije loginovan" });
        return;
    }
    if (!req.session.predmeti.includes(req.params.NAZIV)) {
        res.status(403).json({ greska: `Niste nastavnik na predmetu ${req.params.NAZIV}` });
        return;
    }
    fs.readFile("data/prisustva.json", (err, data) => {
        if (err) {
            res.status(500).json({ greska: "Greška pri čitanju podataka" });
            return;
        }
        const svaPrisustva = JSON.parse(data);
        var prisustvoObjekat = svaPrisustva.find((obj) => obj.predmet == req.params.NAZIV);
        if (prisustvoObjekat === undefined) prisustvoObjekat = null;
        res.json(prisustvoObjekat);
    })
});
app.post('/prisustvo/predmet/:NAZIV/student/:index', function (req, res) {
    if (!req.session.username) {
        res.status(403).json({ greska: "Nastavnik nije loginovan" });
        return;
    }
    if (!req.session.predmeti.includes(req.params.NAZIV)) {
        res.status(403).json({ greska: `Niste nastavnik na predmetu ${req.params.NAZIV}` });
        return;
    }
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
        if (prisustvoObjekat.studenti.find((student) => student.index === parseInt(req.params.index)) === undefined) {
            res.status(400).json({ greska: `Ne postoji student sa indexom ${req.params.index} na predmetu ${req.params.NAZIV}` });
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
                index: parseInt(req.params.index)
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