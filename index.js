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
        console.log("nisu poslani parametri");
        res.status(400).json({ poruka: "Neuspješna prijava" });
    }
});
app.post('/logout', function (req, res) {
    req.session.destroy();
    res.json({ poruka: "Uspješan logout" })
    //ovako ili podatke (ili session?) na null
})
app.get('/loginStatus', function (req, res) {
    res.json({ nastavnik: req.session.username ?? "null" });
})
app.get('/predmeti', function (req, res) {
    if (req.session.username) {
        res.json({ predmeti: req.session.predmeti });
    } else {
        res.status(401).json({ greska: "Nastavnik nije loginovan" });
    }
})
app.listen(3000);