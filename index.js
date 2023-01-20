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
app.get('/predmeti/:NAZIV', async function (req, res) {
    if (!req.session.username) {
        res.status(403).json({ greska: "Nastavnik nije loginovan" });
        return;
    }
    if (!req.session.predmeti.includes(req.params.NAZIV)) {
        res.status(403).json({ greska: `Niste nastavnik na predmetu ${req.params.NAZIV}` });
        return;
    }
    try {
        const predmet = await db.sequelize.models.predmet.findOne({ where: { naziv: req.params.NAZIV } });
        if (predmet === null) {
            //ovo se ne bi trebalo moći dogoditi
            res.json(null);
            return;
        }
        const studenti = await predmet.getStudenti();
        // ako nema studenata onda nema ni prisustva tako da se nista ne može ispisati (nema podataka)
        if (!studenti.length) {
            res.json(null);
            return;
        }
        // ako nema prisustva trebalo bi se nešto bar ispisati
        const prisustva = await predmet.getPrisustva();
        const objekat = {
            studenti: studenti.map((student) => ({
                ime: student.ime,
                index: student.index
            })),
            prisustva: prisustva ? prisustva.map((prisustvo) => ({
                sedmica: prisustvo.sedmica,
                predavanja: prisustvo.predavanja,
                vjezbe: prisustvo.vjezbe,
                index: prisustvo.studentIndex
            })) : [],
            predmet: predmet.naziv,
            brojPredavanjaSedmicno: predmet.brojPredavanjaSedmicno,
            brojVjezbiSedmicno: predmet.brojVjezbiSedmicno
        }
        res.json(objekat);
    } catch (error) {
        console.log(error);
        res.json(500).json({ greska: "Greška pri čitanju podataka" })
    }
});
app.post('/prisustvo/predmet/:NAZIV/student/:index', async function (req, res) {
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
    try {
        const predmet = await db.sequelize.models.predmet.findOne({ where: { naziv: req.params.NAZIV } });
        if (predmet === null) {
            //ovo se ne bi trebalo moći dogoditi
            res.status(400).json({ greska: `Ne postoji predmet ${req.params.NAZIV}` }); //ovdje mozda 404
            return;
        }
        // slučajevi student ne postoji i student nije na predmetu
        // console.log(typeof req.params.index); string
        const student = await db.sequelize.models.student.findOne({ where: { index: req.params.index } });
        //parse int na req.params.index ??
        if (student == null || ! await predmet.hasStudent(student)) {
            res.status(400).json({ greska: `Ne postoji student sa indexom ${req.params.index} na predmetu ${req.params.NAZIV}` });
            return;
        }
        if (req.body.sedmica < 1 || req.body.sedmica > 15) {
            res.status(400).json({ greska: "Nepravilni parametri zahtjeva" });
            return;
        }
        if (req.body.predavanja < 0 || req.body.predavanja > predmet.brojPredavanjaSedmicno) {
            res.status(400).json({ greska: "Nepravilni parametri zahtjeva" });
            return;
        }
        if (req.body.vjezbe < 0 || req.body.vjezbe > predmet.brojVjezbiSedmicno) {
            res.status(400).json({ greska: "Nepravilni parametri zahtjeva" });
            return;
        }
        var prisustvo = (await predmet.getPrisustva()).find((obj) => obj.sedmica == req.body.sedmica && obj.studentIndex == req.params.index);
        // moze li ovaj poziv gore ovako
        // da li ispod null ili undefined
        if (prisustvo === undefined) {
            prisustvo = await db.sequelize.models.prisustvo.create({
                sedmica: req.body.sedmica,
                predavanja: req.body.predavanja,
                vjezbe: req.body.vjezbe,
                predmetId: predmet.id,
                studentIndex: student.index
            });
        } else {
            await prisustvo.update({
                predavanja: req.body.predavanja,
                vjezbe: req.body.vjezbe
            })
        }
        const studenti = await predmet.getStudenti(); 
        const prisustva = await predmet.getPrisustva();
        const objekat = {
            studenti: studenti.map((student) => ({
                ime: student.ime,
                index: student.index
            })),
            prisustva: prisustva.length ? prisustva.map((prisustvo) => ({
                sedmica: prisustvo.sedmica,
                predavanja: prisustvo.predavanja,
                vjezbe: prisustvo.vjezbe,
                index: prisustvo.studentIndex
            })) : [],
            predmet: predmet.naziv,
            brojPredavanjaSedmicno: predmet.brojPredavanjaSedmicno,
            brojVjezbiSedmicno: predmet.brojVjezbiSedmicno
        }
        res.json(objekat);
    } catch (error) {
        console.log(error);
        res.status(500).json({ greska: "Greška pri čitanju podataka" });
    }
});
app.listen(3000);